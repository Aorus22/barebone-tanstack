export const MODULE_ACTIONS = ["create", "read", "update", "delete"] as const
export type ModuleAction = (typeof MODULE_ACTIONS)[number]

export const MODULE_IDS = [] as const

export type ModuleId = (typeof MODULE_IDS)[number]
export type ModuleActionPermission = `${ModuleId}.${ModuleAction}`

export const MODULE_AVAILABLE_ACTIONS: Record<
  ModuleId,
  ReadonlyArray<ModuleAction>
> = {}

export function getModuleAvailableActions(
  moduleId: ModuleId
): ReadonlyArray<ModuleAction> {
  return MODULE_AVAILABLE_ACTIONS[moduleId]
}

export function getModuleActionPermission(
  moduleId: ModuleId,
  action: ModuleAction
): ModuleActionPermission {
  return `${moduleId}.${action}`
}
