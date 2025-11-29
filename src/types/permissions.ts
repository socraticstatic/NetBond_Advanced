export type Role = 'user' | 'admin' | 'super-admin';

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
  scope?: 'own' | 'department' | 'tenant' | 'platform';
}

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
  requirement?: PermissionRequirement;
  needsMFA?: boolean;
  needsApproval?: boolean;
  canRequest?: boolean;
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  'user': ['view'],
  'admin': ['view', 'create', 'edit', 'delete', 'manage_users', 'manage_billing', 'view_audit'],
  'super-admin': ['view', 'create', 'edit', 'delete', 'manage_users', 'manage_billing', 'manage_system', 'manage_tenants', 'impersonate', 'view_audit', 'manage_security']
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
