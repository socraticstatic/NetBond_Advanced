import { Role, Permission, PermissionRequirement, PermissionCheck, ROLE_PERMISSIONS } from '../types/permissions';

export class PermissionChecker {
  private static instance: PermissionChecker;

  private constructor() {}

  static getInstance(): PermissionChecker {
    if (!PermissionChecker.instance) {
      PermissionChecker.instance = new PermissionChecker();
    }
    return PermissionChecker.instance;
  }

  hasPermission(userRole: Role, requirement: PermissionRequirement): PermissionCheck {
    const rolePermissions = ROLE_PERMISSIONS[userRole];

    // Check if user's role has the required permission
    const hasRequiredPermission = rolePermissions.includes(requirement.permission);

    // Check if specific role is required
    if (requirement.role && userRole !== requirement.role && userRole !== 'super-admin') {
      return {
        allowed: false,
        reason: `Requires ${requirement.role} role or higher`,
        requirement,
        canRequest: true
      };
    }

    if (!hasRequiredPermission) {
      return {
        allowed: false,
        reason: `Requires ${requirement.permission} permission`,
        requirement,
        canRequest: true
      };
    }

    // Check if MFA is required for this action
    if (requirement.requiresMFA) {
      return {
        allowed: true,
        needsMFA: true,
        requirement
      };
    }

    // Check if approval is required
    if (requirement.requiresApproval) {
      return {
        allowed: true,
        needsApproval: true,
        requirement
      };
    }

    return {
      allowed: true,
      requirement
    };
  }

  canViewResource(userRole: Role, resourceType: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    return rolePermissions.includes('view');
  }

  canEditResource(userRole: Role, resourceType: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    return rolePermissions.includes('edit');
  }

  canDeleteResource(userRole: Role, resourceType: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    return rolePermissions.includes('delete');
  }

  getRoleDisplayName(role: Role): string {
    const displayNames: Record<Role, string> = {
      'user': 'User',
      'admin': 'Admin',
      'super-admin': 'Super Admin'
    };
    return displayNames[role];
  }

  getPermissionColor(permission: Permission): string {
    const colors: Record<Permission, string> = {
      'view': 'blue',
      'create': 'green',
      'edit': 'yellow',
      'delete': 'red',
      'manage_users': 'purple',
      'manage_billing': 'orange',
      'manage_system': 'red',
      'manage_tenants': 'purple',
      'impersonate': 'pink',
      'view_audit': 'gray',
      'manage_security': 'red'
    };
    return colors[permission] || 'gray';
  }
}

export const permissionChecker = PermissionChecker.getInstance();
