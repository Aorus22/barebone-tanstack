let draining = false
let changedAt = new Date().toISOString()

export function setDraining(next: boolean) {
  draining = next
  changedAt = new Date().toISOString()
}

export function getDeploymentState() {
  return {
    draining,
    changedAt,
    slot: process.env.APP_SLOT || "unknown",
    version: process.env.APP_VERSION || "dev",
    pid: process.pid,
  }
}
