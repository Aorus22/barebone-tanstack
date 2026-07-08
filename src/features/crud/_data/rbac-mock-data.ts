import type { Role, Permission, RoleAssignment } from "./rbac-types"

export const mockRoles: Role[] = [
  { id: "role-1", name: "Super Admin", description: "Full system access with all permissions", userCount: 2, createdAt: "2024-01-15" },
  { id: "role-2", name: "Admin", description: "Administrative access to most modules", userCount: 5, createdAt: "2024-01-20" },
  { id: "role-3", name: "Editor", description: "Can create and edit content", userCount: 12, createdAt: "2024-02-01" },
  { id: "role-4", name: "Viewer", description: "Read-only access to assigned modules", userCount: 28, createdAt: "2024-02-15" },
  { id: "role-5", name: "Auditor", description: "View logs and reports only", userCount: 4, createdAt: "2024-03-01" },
]

export const mockPermissions: Permission[] = [
  { id: "perm-1", resource: "Users", action: "manage", description: "Full control over user accounts" },
  { id: "perm-2", resource: "Roles", action: "manage", description: "Create and assign roles" },
  { id: "perm-3", resource: "Permissions", action: "read", description: "View permission configurations" },
  { id: "perm-4", resource: "Reports", action: "create", description: "Generate new reports" },
  { id: "perm-5", resource: "Reports", action: "read", description: "View existing reports" },
  { id: "perm-6", resource: "Reports", action: "delete", description: "Remove reports" },
  { id: "perm-7", resource: "Settings", action: "update", description: "Modify system settings" },
  { id: "perm-8", resource: "Settings", action: "read", description: "View system settings" },
  { id: "perm-9", resource: "Audit Log", action: "read", description: "View audit trail" },
  { id: "perm-10", resource: "Users", action: "create", description: "Invite new users" },
  { id: "perm-11", resource: "Users", action: "read", description: "View user profiles" },
  { id: "perm-12", resource: "Roles", action: "read", description: "View role definitions" },
]

export const mockAssignments: RoleAssignment[] = [
  { userId: "usr-001", userName: "Alice Wijaya", roleId: "role-1", roleName: "Super Admin", assignedAt: "2024-01-15" },
  { userId: "usr-002", userName: "Bob Santoso", roleId: "role-1", roleName: "Super Admin", assignedAt: "2024-01-16" },
  { userId: "usr-003", userName: "Charlie Lim", roleId: "role-2", roleName: "Admin", assignedAt: "2024-01-20" },
  { userId: "usr-004", userName: "Dewi Putri", roleId: "role-2", roleName: "Admin", assignedAt: "2024-02-01" },
  { userId: "usr-005", userName: "Eko Prasetyo", roleId: "role-3", roleName: "Editor", assignedAt: "2024-02-05" },
  { userId: "usr-006", userName: "Fitri Handayani", roleId: "role-3", roleName: "Editor", assignedAt: "2024-02-10" },
  { userId: "usr-007", userName: "Gunawan Saputra", roleId: "role-4", roleName: "Viewer", assignedAt: "2024-02-20" },
  { userId: "usr-008", userName: "Hana Susanti", roleId: "role-4", roleName: "Viewer", assignedAt: "2024-03-01" },
  { userId: "usr-009", userName: "Indra Wijaya", roleId: "role-5", roleName: "Auditor", assignedAt: "2024-03-05" },
]

export const rolePermissionMap: Record<string, string[]> = {
  "role-1": ["perm-1", "perm-2", "perm-3", "perm-4", "perm-5", "perm-6", "perm-7", "perm-8", "perm-9", "perm-10", "perm-11", "perm-12"],
  "role-2": ["perm-3", "perm-4", "perm-5", "perm-7", "perm-8", "perm-9", "perm-10", "perm-11", "perm-12"],
  "role-3": ["perm-4", "perm-5", "perm-10", "perm-11", "perm-12"],
  "role-4": ["perm-5", "perm-8", "perm-11", "perm-12"],
  "role-5": ["perm-5", "perm-9"],
}
