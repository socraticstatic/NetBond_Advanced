/*
  # RBAC with Proper Scope Implementation

  This migration creates the proper RBAC structure with scope hierarchy.

  ## New Tables

  ### `scope_nodes`
  - Represents nodes in the resource hierarchy (platform → tenant → department → pool)
  - Each node has a unique path (e.g., "/tenants/acme-corp/departments/engineering")
  - Hierarchical structure with parent-child relationships

  ### `role_assignments`
  - Maps principals (users/groups) to roles at specific scopes
  - A role assignment grants permissions at a scope and all child scopes
  - Supports conditions like resource filters, MFA requirements, time bounds

  ### `resource_ownership`
  - Tracks which resources belong to which scope paths
  - Enables resource filtering (my resources, department resources, etc.)
  - Links resources to owners, departments, pools, tenants

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only see role assignments relevant to them
  - Admins can see assignments within their scope
  - Platform admins can see everything

  ## Important Notes
  - Scope is the hierarchical location (WHERE permissions apply)
  - Resource filters determine WHICH resources at that location
  - This follows Azure RBAC, AWS IAM, and Kubernetes RBAC patterns
*/

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS resource_ownership CASCADE;
DROP TABLE IF EXISTS role_assignments CASCADE;
DROP TABLE IF EXISTS scope_nodes CASCADE;

-- =============================================================================
-- Scope Nodes Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS scope_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('platform', 'tenant', 'department', 'pool', 'resource')),
  path TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  parent_path TEXT REFERENCES scope_nodes(path) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,

  -- Ensure valid hierarchy
  CONSTRAINT valid_path_format CHECK (
    path = '/platform' OR
    path ~ '^/tenants/[^/]+(/(departments|pools)/[^/]+)*$'
  ),

  -- Platform node has no parent
  CONSTRAINT platform_no_parent CHECK (
    (type = 'platform' AND parent_path IS NULL) OR
    (type != 'platform' AND parent_path IS NOT NULL)
  )
);

-- Indexes for efficient scope lookups
CREATE INDEX idx_scope_nodes_path ON scope_nodes(path);
CREATE INDEX idx_scope_nodes_parent ON scope_nodes(parent_path);
CREATE INDEX idx_scope_nodes_type ON scope_nodes(type);
CREATE INDEX idx_scope_nodes_path_prefix ON scope_nodes(path text_pattern_ops);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scope_nodes_updated_at
  BEFORE UPDATE ON scope_nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Role Assignments Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Principal (who gets the role)
  principal_id UUID NOT NULL,
  principal_type TEXT NOT NULL CHECK (principal_type IN ('user', 'group', 'service')),
  principal_name TEXT,

  -- Role (what permissions they get)
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'super-admin')),

  -- Scope (where the permissions apply)
  scope_path TEXT NOT NULL REFERENCES scope_nodes(path) ON DELETE CASCADE,

  -- Optional conditions
  conditions JSONB DEFAULT '{}',

  -- Assignment metadata
  assigned_by UUID,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),

  -- Revocation info
  revoked_by UUID,
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,

  -- Prevent duplicate assignments
  CONSTRAINT unique_assignment UNIQUE (principal_id, principal_type, role, scope_path),

  -- Ensure valid expiration
  CONSTRAINT valid_expiration CHECK (
    expires_at IS NULL OR expires_at > assigned_at
  )
);

-- Indexes for efficient permission checks
CREATE INDEX idx_role_assignments_principal ON role_assignments(principal_id, principal_type);
CREATE INDEX idx_role_assignments_scope ON role_assignments(scope_path);
CREATE INDEX idx_role_assignments_status ON role_assignments(status);
CREATE INDEX idx_role_assignments_principal_active ON role_assignments(principal_id, status)
  WHERE status = 'active';

-- Function to automatically expire assignments
CREATE OR REPLACE FUNCTION expire_role_assignments()
RETURNS void AS $$
BEGIN
  UPDATE role_assignments
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Resource Ownership Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS resource_ownership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Resource identification
  resource_id UUID NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN (
    'connection', 'pool', 'user', 'billing', 'system', 'tenant', 'security'
  )),

  -- Ownership
  owner_id UUID NOT NULL,

  -- Scope location
  scope_path TEXT NOT NULL REFERENCES scope_nodes(path) ON DELETE CASCADE,

  -- Hierarchical membership
  tenant_id UUID NOT NULL,
  department_id UUID,
  pool_id UUID,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',

  -- Unique resource tracking
  CONSTRAINT unique_resource UNIQUE (resource_type, resource_id)
);

-- Indexes for resource filtering
CREATE INDEX idx_resource_ownership_owner ON resource_ownership(owner_id);
CREATE INDEX idx_resource_ownership_tenant ON resource_ownership(tenant_id);
CREATE INDEX idx_resource_ownership_department ON resource_ownership(department_id);
CREATE INDEX idx_resource_ownership_pool ON resource_ownership(pool_id);
CREATE INDEX idx_resource_ownership_scope ON resource_ownership(scope_path);
CREATE INDEX idx_resource_ownership_type ON resource_ownership(resource_type);

CREATE TRIGGER update_resource_ownership_updated_at
  BEFORE UPDATE ON resource_ownership
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE scope_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_ownership ENABLE ROW LEVEL SECURITY;

-- Scope Nodes Policies
CREATE POLICY "Users can view scope nodes within their tenant"
  ON scope_nodes FOR SELECT
  TO authenticated
  USING (
    path = '/platform' OR
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.principal_id = auth.uid()
        AND ra.status = 'active'
        AND (ra.scope_path = path OR path LIKE ra.scope_path || '/%')
    )
  );

CREATE POLICY "Admins can create scope nodes in their scope"
  ON scope_nodes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.principal_id = auth.uid()
        AND ra.status = 'active'
        AND ra.role IN ('admin', 'super-admin')
        AND (ra.scope_path = parent_path OR parent_path LIKE ra.scope_path || '/%')
    )
  );

-- Role Assignments Policies
CREATE POLICY "Users can view their own role assignments"
  ON role_assignments FOR SELECT
  TO authenticated
  USING (
    principal_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.principal_id = auth.uid()
        AND ra.status = 'active'
        AND ra.role IN ('admin', 'super-admin')
        AND (ra.scope_path = scope_path OR scope_path LIKE ra.scope_path || '/%')
    )
  );

CREATE POLICY "Admins can create role assignments in their scope"
  ON role_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.principal_id = auth.uid()
        AND ra.status = 'active'
        AND ra.role IN ('admin', 'super-admin')
        AND (ra.scope_path = scope_path OR scope_path LIKE ra.scope_path || '/%')
    )
  );

-- Resource Ownership Policies
CREATE POLICY "Users can view resources they own or have access to"
  ON resource_ownership FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.principal_id = auth.uid()
        AND ra.status = 'active'
        AND (
          ra.scope_path = scope_path OR
          scope_path LIKE ra.scope_path || '/%'
        )
    )
  );

-- =============================================================================
-- Helper Functions
-- =============================================================================

-- Check if a user has a permission at a specific scope
CREATE OR REPLACE FUNCTION check_permission(
  p_user_id UUID,
  p_permission TEXT,
  p_scope_path TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_permission BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM role_assignments ra
    WHERE ra.principal_id = p_user_id
      AND ra.status = 'active'
      AND (ra.expires_at IS NULL OR ra.expires_at > NOW())
      AND (
        ra.scope_path = p_scope_path OR
        p_scope_path LIKE ra.scope_path || '/%'
      )
      AND (
        (ra.role = 'user' AND p_permission = 'view') OR
        (ra.role = 'admin' AND p_permission IN ('view', 'create', 'edit', 'delete', 'manage_users', 'manage_billing', 'view_audit')) OR
        (ra.role = 'super-admin')
      )
  ) INTO v_has_permission;

  RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get all role assignments for a user
CREATE OR REPLACE FUNCTION get_user_role_assignments(p_user_id UUID)
RETURNS TABLE (
  assignment_id UUID,
  role TEXT,
  scope_path TEXT,
  scope_name TEXT,
  assigned_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ra.id,
    ra.role,
    ra.scope_path,
    sn.name,
    ra.assigned_at,
    ra.expires_at
  FROM role_assignments ra
  JOIN scope_nodes sn ON sn.path = ra.scope_path
  WHERE ra.principal_id = p_user_id
    AND ra.status = 'active'
    AND (ra.expires_at IS NULL OR ra.expires_at > NOW())
  ORDER BY ra.assigned_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Sample Data (Platform Root)
-- =============================================================================

-- Insert the platform root node
INSERT INTO scope_nodes (type, path, name, parent_path)
VALUES ('platform', '/platform', 'Platform', NULL)
ON CONFLICT (path) DO NOTHING;

-- Insert sample tenant
INSERT INTO scope_nodes (type, path, name, parent_path)
VALUES ('tenant', '/tenants/demo-tenant', 'Demo Tenant', '/platform')
ON CONFLICT (path) DO NOTHING;

-- Insert sample department
INSERT INTO scope_nodes (type, path, name, parent_path)
VALUES (
  'department',
  '/tenants/demo-tenant/departments/engineering',
  'Engineering',
  '/tenants/demo-tenant'
)
ON CONFLICT (path) DO NOTHING;