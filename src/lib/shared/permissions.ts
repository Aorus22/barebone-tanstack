export const MODULE_ACTIONS = ["create", "update", "delete"] as const
export type ModuleAction = (typeof MODULE_ACTIONS)[number]

export type ModuleId = string
export type ModuleActionPermission = string

export const MODULE_AVAILABLE_ACTIONS: Record<string, ReadonlyArray<ModuleAction>> = {}

export function getModuleAvailableActions(moduleId: string): ReadonlyArray<ModuleAction> {
  return MODULE_AVAILABLE_ACTIONS[moduleId] ?? []
}

export function getModuleActionPermission(moduleId: string, action: ModuleAction): string {
  return `${moduleId}.${action}`
}
