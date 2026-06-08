import type { ModuleVisibilityRule } from "@/router/module-config"
import { getModuleActionPermission, type ModuleAction, type ModuleId } from "@/lib/shared/permissions"

import { AppError } from "@/lib/server/errors"

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

export function assertModuleVisible(actor: ActorWithAccess | undefined, moduleId: ModuleVisibilityRule) {
  if (!canViewModule(actor, moduleId)) {
    throw new AppError("MODULE_NOT_VISIBLE", "Kamu tidak punya akses ke halaman ini.", {
      statusCode: 403,
    })
  }
}

export function assertPermission(actor: ActorWithAccess | undefined, permission: ModulePermission) {
  if (!canUsePermission(actor, permission)) {
    throw new AppError("PERMISSION_DENIED", "Kamu tidak punya akses untuk melakukan aksi ini.", {
      statusCode: 403,
    })
  }
}

export function canUseModuleAction(actor: ActorWithAccess | undefined, moduleId: ModuleId, action: ModuleAction) {
  return canUsePermission(actor, getModuleActionPermission(moduleId, action))
}

export function assertModuleActionPermission(
  actor: ActorWithAccess | undefined,
  moduleId: ModuleId,
  action: ModuleAction
) {
  assertPermission(actor, getModuleActionPermission(moduleId, action))
}
