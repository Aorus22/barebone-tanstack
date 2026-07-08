import type { ComponentType } from "react"
import { RbacPlayground } from "./playgrounds/rbac-playground"
import { UsersPlayground } from "./playgrounds/users-playground"
import { AuditLogPlayground } from "./playgrounds/audit-log-playground"

export type CrudExample = {
  id: string
  label: string
  description: string
  icon: string
  component: ComponentType
}

export const crudExamples: CrudExample[] = [
  {
    id: "rbac",
    label: "RBAC Management",
    description: "Full CRUD Role-Based Access Control — tambah/edit/hapus roles, permissions, dan user-role assignments. Masing-masing tabel independen dengan dialog form.",
    icon: "Shield",
    component: RbacPlayground,
  },
  {
    id: "users",
    label: "User Management",
    description: "Full CRUD user management — tambah, edit, hapus user dengan dialog form. Status bisa toggle inline. Data disimpan di state lokal.",
    icon: "Users",
    component: UsersPlayground,
  },
  {
    id: "audit-log",
    label: "Audit Log",
    description: "Real-time audit trail dengan server-side pagination, sorting, dan refresh. Simulasi API call dengan loading states & error handling.",
    icon: "ScrollText",
    component: AuditLogPlayground,
  },
]
