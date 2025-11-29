import {
  Role,
  Permission,
  PermissionRequirement,
  PermissionCheck,
  ROLE_PERMISSIONS,
  Scope,
  ROLE_DEFAULT_SCOPE,
  ROLE_MAX_SCOPE,
  SCOPE_HIERARCHY
} from '../types/permissions';

export class PermissionChecker {
  private static instance: PermissionChecker;

  private constructor() {}

  static getInstance(): PermissionChecker {
    if (!PermissionChecker.instance) {
      PermissionChecker.instance = new PermissionChecker();
    }
    return PermissionChecker.instance;
  }

  /**
   * Get the default scope for a role
   */
  getDefaultScope(role: Role): Scope {
    return ROLE_DEFAULT_SCOPE[role];
  }

  /**
   * Get the maximum scope a role can access
   */
  getMaxScope(role: Role): Scope {
    return ROLE_MAX_SCOPE[role];
  }

  /**
   * Check if a scope is valid for a role
   */
  canAccessScope(role: Role, targetScope: Scope): boolean {
    const maxScope = this.getMaxScope(role);
    const maxScopeLevel = SCOPE_HIERARCHY.indexOf(maxScope);
    const targetScopeLevel = SCOPE_HIERARCHY.indexOf(targetScope);
    return targetScopeLevel <= maxScopeLevel;
  }

  /**
   * Get the actual scope that will be applied (limited by role)
   */
  getEffectiveScope(role: Role, requestedScope?: Scope): Scope {
    if (!requestedScope) {
      return this.getDefaultScope(role);
    }

    const maxScope = this.getMaxScope(role);
    const maxScopeLevel = SCOPE_HIERARCHY.indexOf(maxScope);
    const requestedScopeLevel = SCOPE_HIERARCHY.indexOf(requestedScope);

    // If requested scope is too broad, limit to max scope
    if (requestedScopeLevel > maxScopeLevel) {
      return maxScope;
    }

    return requestedScope;
  }

  hasPermission(userRole: Role, requirement: PermissionRequirement, userDepartment?: string, userPools?: string[]): PermissionCheck {
    const rolePermissions = ROLE_PERMISSIONS[userRole];

    // Check if user's role has the required permission
    const hasRequiredPermission = rolePermissions.includes(requirement.permission);

    // Check if specific role is required
    if (requirement.role && userRole !== requirement.role && userRole !== 'super-admin') {
      return {
        allowed: false,
        reason: `Requires ${requirement.role} role or higher`,
        requirement,
        canRequest: true,
        limitedBy: 'role'
      };
    }

    if (!hasRequiredPermission) {
      return {
        allowed: false,
        reason: `Requires ${requirement.permission} permission`,
        requirement,
        canRequest: true,
        limitedBy: 'role'
      };
    }

    // Check scope restrictions
    if (requirement.scope) {
      const canAccess = this.canAccessScope(userRole, requirement.scope);
      if (!canAccess) {
        const maxScope = this.getMaxScope(userRole);
        return {
          allowed: false,
          reason: `Your role is limited to ${maxScope} scope, but this action requires ${requirement.scope} scope`,
          requirement,
          canRequest: true,
          actualScope: maxScope,
          limitedBy: 'scope'
        };
      }

      // Check if user has required department/pool membership
      if (requirement.scope === 'department' && !userDepartment) {
        return {
          allowed: false,
          reason: 'You must be assigned to a department to access department resources',
          requirement,
          canRequest: true,
          limitedBy: 'department'
        };
      }

      if (requirement.scope === 'pool' && (!userPools || userPools.length === 0)) {
        return {
          allowed: false,
          reason: 'You must be assigned to at least one pool to access pool resources',
          requirement,
          canRequest: true,
          limitedBy: 'pool'
        };
      }
    }

    // Determine the actual scope that will be applied
    const effectiveScope = this.getEffectiveScope(userRole, requirement.scope);

    // Check if MFA is required for this action
    if (requirement.requiresMFA) {
      return {
        allowed: true,
        needsMFA: true,
        requirement,
        actualScope: effectiveScope
      };
    }

    // Check if approval is required
    if (requirement.requiresApproval) {
      return {
        allowed: true,
        needsApproval: true,
        requirement,
        actualScope: effectiveScope
      };
    }

    return {
      allowed: true,
      requirement,
      actualScope: effectiveScope
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
