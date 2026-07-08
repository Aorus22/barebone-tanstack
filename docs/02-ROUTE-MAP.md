# Route Map — Bare Bone

All routes are managed via **TanStack file-based routing**. The route generator reads `src/routes/` and auto-generates `src/routeTree.gen.ts`.

---

## Layout Groups

| Layout Group | Path prefix | Auth? | Layout |
|---|---|---|---|
| `(app)` | — | ✅ via `beforeLoad` | `(app)/route.tsx` (minimal) |
| `(auth)` | — | ❌ public | Minimal layout |

`(app)/admin/route.tsx` executes `checkSession()` via `beforeLoad`. Jika tidak authenticated → redirect `/login`.

---

## All Routes

### Auth Routes `(auth)/`

| File | URL | Description |
|---|---|---|
| `(auth)/route.tsx` | — | Layout wrapper |
| `(auth)/login.tsx` | `/login` | Login page (username + password) — juga render ThemeCustomizer |
| `(auth)/logout.tsx` | `/logout` | Clear cookie + redirect ke `/login` |
| `(auth)/server-action.ts` | — | Server fns: `loginUser`, `logoutUser`, `checkSession`, `returnToOriginalAccount` |

### Admin Routes `(app)/admin/`

Semua di-protect via `beforeLoad` → `checkSession()` → redirect `/login`.

| File | URL | Auth | Description |
|---|---|---|---|
| `(app)/admin/route.tsx` | `/admin` | ✅ | Layout: header + sidebar (User Management, Audit Log) + user nav (sign out) |
| `(app)/admin/user-management.tsx` | `/admin/user-management` | ✅ | 2 tabs: Users (CRUD) + Groups (CRUD with permission matrix) |
| `(app)/admin/audit-log/route.tsx` | `/admin/audit-log` | ✅ | Audit trail dari SQLite `system_action_logs` |
| `(app)/admin/audit-log/query.ts` | — | ✅ | Server fn `getAuditLogPage` — pagination + sorting |

### Demo Routes `(app)/demo/`

| File | URL | Description |
|---|---|---|
| `(app)/demo/component/$slug.tsx` | `/demo/component/*` | UI component showcase (Button, Dialog, Charts, dll) |

### Root Routes

| File | URL | Description |
|---|---|---|
| `__root.tsx` | — | Root layout: `<ThemeProvider>`, blocking script anti-flash, `Scripts` |
| `(app)/route.tsx` | — | Layout group root — minimal `<Outlet />` |
| `(app)/index.tsx` | `/` | Component showcase homepage (sidebar + header + catalog) |
| `healthz.ts` | `/healthz` | Health check |
| `readyz.ts` | `/readyz` | Readiness check |
| `sw.ts` | `/sw` | Service worker |

---

## Auth & Admin Flow

```
/login → submit form → loginUser server fn → verify bcrypt → create JWT → set httpOnly cookie
       → redirect ke /admin/user-management

/admin/* → beforeLoad → checkSession() → verify JWT dari cookie → invalid → redirect /login
         → valid → render page

/logout → clear cookie → redirect /login
```

---

## Theme Customizer Anti-Flash

Di `__root.tsx`, blocking script di `<head>` (via `scripts` array) baca `theme-custom-colors` dari localStorage sebelum React mount:

```js
// Simplified logic
var t = JSON.parse(localStorage.getItem('theme-custom-colors'))
if (t.radius) document.documentElement.style.setProperty('--radius', t.radius)
if (t.primary) document.documentElement.style.setProperty('--primary', t.primary)
```

Script ini jalan SYNCHRONOUS saat HTML parsing, sebelum first paint.

---

## Sidebar Navigation

### Admin Sidebar (`(app)/admin/route.tsx`)

```
┌──────────────────────┐
│ Admin                │
│ • User Management 👥 │
│ • Audit Log 📋       │
├──────────────────────┤
│ 👤 Admin             │
│     ➜ Sign Out      │
└──────────────────────┘
```

### Component Showcase Sidebar (`component-showcase-page.tsx`)

```
┌──────────────────────┐
│ demo/ui              │
├──────────────────────┤
│ ACTIONS              │
│  • Button     🖱️    │
│  • Toggle     ...    │
│ FORMS                │
│  • Input      ...    │
│ FEEDBACK             │
│  • Dialog     ...    │
├──────────────────────┤
│ Theme  [☀️🌙💻]      │
│ 👤 Admin             │
│     ➜ Sign Out      │
└──────────────────────┘
```

---

## DemoNav (Module Group Switcher)

`src/components/global/demo-nav.tsx` — popover button di kanan topbar:

```
[ 📊 Components ▾ ]  → dropdown: [Components] [Admin]
```

Ada di semua halaman: homepage, component detail, admin pages.
Style: rounded (ikut `--radius` tema), border, bg-muted.

---

## Auth Service (`src/backend/auth/auth.service.ts`)

| Function | Description |
|---|---|
| `login(username, password)` | Verify bcrypt → create JWT (24h) → update last_login |
| `getSessionByToken(token)` | Verify JWT → return actor |
| `loadAccessPayload(userId)` | Load group's visibleModules |
| `logout()` | No-op (JWT stateless) |

**JWT Config:**
- Algorithm: HS256
- Secret: `JWT_SECRET` dari `.env`
- Payload: `{ sub, actor: { id, name, username, groupId, visibleModules } }`
- Cookie: httpOnly, secure in production, sameSite lax

---

## Audit Log System (`src/lib/server/system-action-logger.ts`)

SQLite database terpisah di `logs/system-action.db`:

```sql
CREATE TABLE system_action_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  request_id TEXT NOT NULL,
  action_name TEXT NOT NULL,
  module TEXT NOT NULL,
  operation TEXT NOT NULL,
  actor_id TEXT, actor_name TEXT, session_id TEXT,
  status TEXT NOT NULL CHECK(status IN ('SUCCESS','ERROR')),
  duration_ms INTEGER NOT NULL,
  error_code TEXT, error_message_safe TEXT, payload_json TEXT
) STRICT
```

Auto-created saat pertama kali `getDb()` dipanggil.
Data diakses via `getAuditLogPage` server fn dengan server-side pagination + sorting.
