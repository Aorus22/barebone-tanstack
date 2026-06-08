import type { ModuleVisibilityRule } from "@/router/module-config"

import { canUsePermission, canViewModule, type ActorWithAccess, type ModulePermission } from "@/lib/client/module-rules"

export type ClientAuthUser = ActorWithAccess & {
  id: string
  name?: string
}

export type ClientAuthState = {
  user?: ClientAuthUser
}

export function canViewClientModule(user: ClientAuthUser | undefined, moduleId: ModuleVisibilityRule) {
  return canViewModule(user, moduleId)
}

export function canUseClientPermission(
  user: ClientAuthUser | undefined,
  permission: ModulePermission
) {
  return canUsePermission(user, permission)
}
