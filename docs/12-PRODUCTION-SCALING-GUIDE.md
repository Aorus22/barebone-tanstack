# Production Deployment & Scaling Guide — Bare Bone

This document describes infrastructure guidelines, scaling bottlenecks, security, and maintenance for running Bare Bone at **production scale**.

---

## 0. Production Deployment Policy

Bare Bone uses a blue/green deploy flow behind nginx. The standard deployment path is:

```bash
./deploy/scripts/zero-downtime-deploy.sh
```

Avoid using `docker compose up`, `docker compose down`, `docker compose restart`, or similar commands as the primary deployment path. Those commands can skip critical steps handled by the deploy script:

- selecting active and target application slots
- running migrations on the slot not receiving traffic
- waiting for readiness check `/readyz`
- switching nginx upstream to the new slot
- marking the old slot as draining
- waiting for blocking jobs to finish before stopping the old slot

Direct `docker compose` usage is still allowed for deliberate operational needs, but must be treated as a manual bypass, not a normal deploy workflow.

To add a local shell guard warning when typing risky `docker compose` commands:

```bash
. ./deploy/scripts/source-shell-guard.sh
```

A concise document near deploy artifacts is available at [`deploy/README.md`](../deploy/README.md).

---

## 1. Stateful Scaling Limitations (In-Memory Constraints)

Bare Bone is designed with an efficient architecture that minimizes external dependencies (no Redis for queue/session). However, this carries important consequences for horizontal scaling (multi-instance servers):

### Multi-Instance Scaling Issues (Kubernetes / Multi-VM)
When running the application on more than one container/pod behind a standard Round-Robin Load Balancer:
1. **SSE Stream Failure**: Browser opens EventSource to `/sse` connected to Instance A, but the server action executes on Instance B. Client won't receive progress updates.
2. **Cache Sync Loss**: Uploaded preview data stored in Instance A's volatile memory. When user confirms "Commit", the request is routed to Instance B which has no access to Instance A's memory.

### Production Scale Solutions (Choose One):

#### Option A: Vertical Scaling (Primary Recommendation)
Use **Single-Instance Deployment** with high CPU/RAM (Vertical Scaling).
- **Why?** Node.js runtime + Kysely query engine are very lightweight and fast. A single VPS with 4 vCPU & 8 GB RAM can handle significant traffic without concurrency issues.
- **Advantages**: Very simple, zero additional Load Balancer configuration, no cache synchronization issues.

#### Option B: Horizontal Scaling with Sticky Sessions (Session Affinity)
If Kubernetes (EKS/GKE) or multi-VM deployment is required for high-availability:
- **Configuration**: Load Balancer (AWS ALB, Nginx, Cloudflare) **must** be configured with **Sticky Sessions (Session Affinity)** based on cookies.
- **Result**: All requests from the same browser user (including SSE and Commit operations) are guaranteed to land on the same pod/container.

---

## 2. Backup & Disaster Recovery Strategy

The following automated backup procedures must be implemented:

### A. PostgreSQL Logical Backup
Execute periodic logical backups using `pg_dump` to isolated Object Storage:
```bash
# Automated daily backup script (cronjob)
pg_dump -U $DB_USER -h $DB_HOST -F c -b -v -f /backups/db-$(date +%F).dump $DB_NAME
# Transfer dump file to AWS S3 / Cloudflare R2 periodically
```

### B. Physical File Sync (`storage/`)
If using Local File Storage:
- Sync files in `{cwd}/storage/` to secondary cloud storage asynchronously using `rclone` or `aws s3 sync`.
- **Enterprise Recommendation**: For multi-instance deployments, update `src/lib/server/storage.ts` to upload files directly to S3-Compatible Object Storage using AWS SDK.

---

## 3. SQLite System Action Log Maintenance

The `logs/system-action.db` SQLite file records all server mutation payloads. At high transaction volumes, this file can grow to tens of gigabytes.

### Log Rotation & Pruning Strategy
Create a periodic cronjob (e.g., monthly) to prune logs older than 90 days:

```bash
# SQLite log pruning runbook
sqlite3 logs/system-action.db "DELETE FROM system_action_logs WHERE created_at < datetime('now', '-90 days');"
sqlite3 logs/system-action.db "VACUUM;" # Shrink physical disk file size
```

---

## 4. Environment Hardening

Ensure the following variables are set correctly in the production `.env` file:

### A. Secure Session & Cookie
```ini
NODE_ENV=production
# Cookie sent only over HTTPS
SESSION_COOKIE_SECURE=true
# Cookie restricted to prevent CSRF
SESSION_COOKIE_SAME_SITE=lax
```

### B. CORS & Allowed Hosts Protection
Vite config checks valid hosts. Restrict `allowedHosts` in `vite.config.ts` to your official production domain(s).

### C. HTTPS Reverse Proxy
If behind Nginx/Caddy reverse proxy or Cloudflare:
Ensure `X-Forwarded-For` and `X-Forwarded-Proto` headers are properly forwarded so that IP detection and SSL protocol middleware in Node.js reads accurate data.

---

## 5. Monitoring & Metrics

Key metrics to monitor on server dashboards (Prometheus/Grafana or Datadog):

| Metric | Alert Threshold | Corrective Action |
|--------|----------------|-------------------|
| **CPU Usage** | > 85% for 5 continuous minutes | Upgrade vCPU or scale up pods |
| **Memory Usage** | > 90% | Check for memory leaks in in-memory cache/SSE listeners |
| **Postgres Conn Pool** | Pool exhausted | Increase `max` connection pool in `src/lib/server/db/kysely.ts` |
| **SQLite Disk I/O** | Very slow (`SQLITE_BUSY`) | Check for external DB editors accessing the log file |
| **Disk Space** | Free space < 15% | Run SQLite Pruning Runbook or clean cache files in `/storage` |
