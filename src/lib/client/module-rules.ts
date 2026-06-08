import type { ModuleVisibilityRule } from "@/router/module-config"

export type ModulePermission = string

export type ActorWithAccess = {
  visibleModules?: ReadonlyArray<ModuleVisibilityRule | string>
  permissions?: ReadonlyArray<ModulePermission>
}

export function canViewModule(actor: ActorWithAccess | undefined, moduleId: ModuleVisibilityRule) {
  if (!actor?.visibleModules) return false

  return actor.visibleModules.includes(moduleId)
}

export function canUsePermission(actor: ActorWithAccess | undefined, permission: ModulePermission) {
  if (!actor?.permissions) return false

  return actor.permissions.includes(permission)
}
