import { useStore } from '../store/useStore';
import { Permission, ROLE_PERMISSIONS } from '../types/permissions';

/**
 * Returns true if the current role has the given permission.
 * Usage: const canCreate = usePermission('create');
 */
export function usePermission(permission: Permission): boolean {
  const currentRole = useStore(state => state.currentRole);
  const perms = ROLE_PERMISSIONS[currentRole] || [];
  return perms.includes(permission);
}

/**
 * Returns an object with all permission checks at once.
 * Usage: const { canCreate, canDelete, canManageTenants } = usePermissions();
 */
export function usePermissions() {
  const currentRole = useStore(state => state.currentRole);
  const perms = ROLE_PERMISSIONS[currentRole] || [];
  return {
    canView: perms.includes('view'),
    canCreate: perms.includes('create'),
    canEdit: perms.includes('edit'),
    canDelete: perms.includes('delete'),
    canManageUsers: perms.includes('manage_users'),
    canManageBilling: perms.includes('manage_billing'),
    canManageSystem: perms.includes('manage_system'),
    canManageTenants: perms.includes('manage_tenants'),
    canImpersonate: perms.includes('impersonate'),
    canViewAudit: perms.includes('view_audit'),
    canManageSecurity: perms.includes('manage_security'),
  };
}
