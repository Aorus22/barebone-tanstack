import type { Generated } from "kysely"

export type Timestamp = Date
export type Numeric = string

export type UserAccountsTable = {
  id: string
  username: string
  password_hash: string | null
  barcode: string | null
  display_name: string | null
  group_id: string | null
  is_active: boolean
  last_login_at: Timestamp | null
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp | null
}

export type UserSessionsTable = {
  id: string
  user_id: string
  session_token_hash: string
  refresh_token_hash: string | null
  impersonator_user_id: string | null
  original_session_id: string | null
  impersonation_started_at: Timestamp | null
  expires_at: Timestamp
  last_seen_at: Timestamp | null
  revoked_at: Timestamp | null
  ip_address: string | null
  user_agent: string | null
  created_at: Timestamp
  updated_at: Timestamp
}

export type AppModulesTable = {
  id: string
  key: string
  label: string
  path: string | null
  description: string | null
  is_active: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export type PermissionsTable = {
  id: string
  key: string
  label: string
  description: string | null
  is_active: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export type UserModuleVisibilitiesTable = {
  id: string
  user_id: string
  module_id: string
  created_at: Timestamp
}

export type UserPermissionsTable = {
  id: string
  user_id: string
  permission_id: string
  created_at: Timestamp
}

export type GroupAccessesTable = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  is_default: boolean
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp | null
}

export type GroupModuleVisibilitiesTable = {
  id: string
  group_id: string
  module_id: string
  created_at: Timestamp
}

export type GroupPermissionsTable = {
  id: string
  group_id: string
  permission_id: string
  created_at: Timestamp
}

export type AuthImpersonationAuditsTable = {
  id: string
  event_type: string
  actor_user_id: string
  target_user_id: string
  session_id: string
  original_session_id: string | null
  created_at: Timestamp
}

export type Database = {
  user_accounts: UserAccountsTable
  user_sessions: UserSessionsTable
  app_modules: AppModulesTable
  permissions: PermissionsTable
  user_module_visibilities: UserModuleVisibilitiesTable
  user_permissions: UserPermissionsTable
  group_accesses: GroupAccessesTable
  group_module_visibilities: GroupModuleVisibilitiesTable
  group_permissions: GroupPermissionsTable
  auth_impersonation_audits: AuthImpersonationAuditsTable
}
