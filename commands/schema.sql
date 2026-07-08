CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS group_accesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS app_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL UNIQUE,
  label VARCHAR(255) NOT NULL,
  path VARCHAR(255),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL UNIQUE,
  label VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_module_visibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES group_accesses(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES app_modules(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES group_accesses(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  barcode VARCHAR(255),
  display_name VARCHAR(255),
  group_id UUID REFERENCES group_accesses(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  session_token_hash VARCHAR(255) NOT NULL,
  refresh_token_hash VARCHAR(255),
  impersonator_user_id UUID REFERENCES user_accounts(id),
  original_session_id UUID REFERENCES user_sessions(id),
  impersonation_started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_module_visibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES app_modules(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth_impersonation_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(255) NOT NULL,
  actor_user_id UUID NOT NULL REFERENCES user_accounts(id),
  target_user_id UUID NOT NULL REFERENCES user_accounts(id),
  session_id UUID NOT NULL REFERENCES user_sessions(id),
  original_session_id UUID REFERENCES user_sessions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default modules (component showcase + admin)
INSERT INTO app_modules (id, key, label, path, description, is_active) VALUES
  (gen_random_uuid(), 'component-showcase', 'Component Showcase', '/', 'Browse UI components', true),
  (gen_random_uuid(), 'admin-user-management', 'User Management', '/admin/user-management', 'Manage users, roles, and permissions', true),
  (gen_random_uuid(), 'admin-audit-log', 'Audit Log', '/admin/audit-log', 'View system audit logs', true)
ON CONFLICT (key) DO NOTHING;

-- Seed default permissions
INSERT INTO permissions (id, key, label, description, is_active) VALUES
  (gen_random_uuid(), 'users.create', 'Create Users', 'Can create new user accounts', true),
  (gen_random_uuid(), 'users.read', 'Read Users', 'Can view user accounts', true),
  (gen_random_uuid(), 'users.update', 'Update Users', 'Can edit user accounts', true),
  (gen_random_uuid(), 'users.delete', 'Delete Users', 'Can delete user accounts', true),
  (gen_random_uuid(), 'roles.create', 'Create Roles', 'Can create roles/groups', true),
  (gen_random_uuid(), 'roles.read', 'Read Roles', 'Can view roles/groups', true),
  (gen_random_uuid(), 'roles.update', 'Update Roles', 'Can edit roles/groups', true),
  (gen_random_uuid(), 'roles.delete', 'Delete Roles', 'Can delete roles/groups', true),
  (gen_random_uuid(), 'audit.read', 'Read Audit Log', 'Can view audit logs', true)
ON CONFLICT (key) DO NOTHING;
