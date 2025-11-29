export type Role = 'user' | 'admin' | 'super-admin';

export type Scope = 'own' | 'department' | 'pool' | 'tenant' | 'platform';

export type Permission =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'manage_users'
  | 'manage_billing'
  | 'manage_system'
  | 'manage_tenants'
  | 'impersonate'
  | 'view_audit'
  | 'manage_security';

export type ResourceType =
  | 'connection'
  | 'pool'
  | 'user'
  | 'billing'
  | 'system'
  | 'tenant'
  | 'security';

export interface PermissionRequirement {
  permission: Permission;
  role?: Role;
  resource?: ResourceType;
  requiresMFA?: boolean;
  requiresApproval?: boolean;
  scope?: Scope;
}

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
  requirement?: PermissionRequirement;
  needsMFA?: boolean;
  needsApproval?: boolean;
  canRequest?: boolean;
  actualScope?: Scope;
  limitedBy?: 'role' | 'scope' | 'department' | 'pool';
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  'user': ['view'],
  'admin': ['view', 'create', 'edit', 'delete', 'manage_users', 'manage_billing', 'view_audit'],
  'super-admin': ['view', 'create', 'edit', 'delete', 'manage_users', 'manage_billing', 'manage_system', 'manage_tenants', 'impersonate', 'view_audit', 'manage_security']
};

// Default scope for each role
export const ROLE_DEFAULT_SCOPE: Record<Role, Scope> = {
  'user': 'own',
  'admin': 'tenant',
  'super-admin': 'platform'
};

// Maximum scope each role can access
export const ROLE_MAX_SCOPE: Record<Role, Scope> = {
  'user': 'department',
  'admin': 'tenant',
  'super-admin': 'platform'
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  'view': 'View',
  'create': 'Create',
  'edit': 'Edit',
  'delete': 'Delete',
  'manage_users': 'Manage Users',
  'manage_billing': 'Manage Billing',
  'manage_system': 'Manage System',
  'manage_tenants': 'Manage Tenants',
  'impersonate': 'Impersonate Users',
  'view_audit': 'View Audit Logs',
  'manage_security': 'Manage Security'
};

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  'connection': 'Connections',
  'pool': 'Pools',
  'user': 'Users',
  'billing': 'Billing',
  'system': 'System Settings',
  'tenant': 'Tenants',
  'security': 'Security Settings'
};

export const SCOPE_LABELS: Record<Scope, string> = {
  'own': 'Own Resources Only',
  'department': 'Department Resources',
  'pool': 'Pool Resources',
  'tenant': 'All Tenant Resources',
  'platform': 'All Platform Resources'
};

export const SCOPE_DESCRIPTIONS: Record<Scope, string> = {
  'own': 'Can only access resources you own or created',
  'department': 'Can access all resources within your department',
  'pool': 'Can access all resources in assigned pools',
  'tenant': 'Can access all resources across the entire tenant/organization',
  'platform': 'Can access resources across all tenants (cross-tenant access)'
};

// Scope hierarchy (higher index = broader access)
export const SCOPE_HIERARCHY: Scope[] = ['own', 'department', 'pool', 'tenant', 'platform'];
