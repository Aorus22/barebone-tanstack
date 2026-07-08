export type Role = {
  id: string
  name: string
  description: string
  userCount: number
  createdAt: string
}

export type Permission = {
  id: string
  resource: string
  action: "create" | "read" | "update" | "delete" | "manage"
  description: string
}

export type RoleAssignment = {
  userId: string
  userName: string
  roleId: string
  roleName: string
  assignedAt: string
}

export const RESOURCES = [
  "Users",
  "Roles",
  "Permissions",
  "Reports",
  "Settings",
  "Audit Log",
] as const

export const ACTIONS = ["create", "read", "update", "delete", "manage"] as const
