import { useState } from 'react';
import { Check, X, Shield, User, Crown, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Role, ROLE_PERMISSIONS, PERMISSION_LABELS, ResourceType, RESOURCE_LABELS } from '../../types/permissions';
import { Modal } from './Modal';

interface RoleCapabilityMatrixProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
  highlightRole?: Role;
}

export function RoleCapabilityMatrix({ isOpen, onClose, currentRole, highlightRole }: RoleCapabilityMatrixProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('general');

  const roles: Role[] = ['user', 'admin', 'super-admin'];

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'super-admin':
        return <Crown className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'user':
        return 'blue';
      case 'admin':
        return 'purple';
      case 'super-admin':
        return 'red';
    }
  };

  const permissionsByCategory = {
    'general': {
      label: 'General Access',
      permissions: ['view'] as const,
      description: 'Basic viewing and navigation permissions'
    },
    'content': {
      label: 'Content Management',
      permissions: ['create', 'edit', 'delete'] as const,
      description: 'Create, modify, and remove resources'
    },
    'administration': {
      label: 'Administration',
      permissions: ['manage_users', 'manage_billing', 'view_audit'] as const,
      description: 'Manage users, billing, and view logs'
    },
    'system': {
      label: 'System & Platform',
      permissions: ['manage_system', 'manage_security', 'manage_tenants', 'impersonate'] as const,
      description: 'System-wide configuration and tenant management'
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Role Capability Matrix" size="large">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Understanding Roles & Permissions</h4>
              <p className="text-xs text-blue-700">
                This matrix shows what each role can do in the system. Your current role is <span className="font-semibold">{currentRole}</span>.
                Permissions are cumulative - higher roles inherit all permissions from lower roles.
              </p>
            </div>
          </div>
        </div>

        {/* Role Headers */}
        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200">
          <div className="font-semibold text-sm text-gray-700">Permission</div>
          {roles.map((role) => {
            const color = getRoleColor(role);
            const isCurrentRole = role === currentRole;
            const isHighlighted = role === highlightRole;

            return (
              <div
                key={role}
                className={`text-center transition-all ${
                  isCurrentRole
                    ? 'bg-green-50 border-2 border-green-500 rounded-lg p-2 -m-2'
                    : isHighlighted
                    ? 'bg-blue-50 border-2 border-blue-400 rounded-lg p-2 -m-2'
                    : ''
                }`}
              >
                <div className={`inline-flex items-center gap-2 text-${color}-700 font-semibold text-sm`}>
                  {getRoleIcon(role)}
                  <span className="capitalize">{role.replace('-', ' ')}</span>
                </div>
                {isCurrentRole && (
                  <div className="text-xs text-green-700 font-medium mt-1">Your Role</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Permission Categories */}
        {Object.entries(permissionsByCategory).map(([categoryKey, category]) => (
          <div key={categoryKey} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(categoryKey)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900">{category.label}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{category.description}</p>
              </div>
              {expandedSection === categoryKey ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedSection === categoryKey && (
              <div className="p-4 space-y-2">
                {category.permissions.map((permission) => (
                  <div key={permission} className="grid grid-cols-4 gap-4 items-center py-2">
                    <div className="text-sm text-gray-700 font-medium">
                      {PERMISSION_LABELS[permission]}
                    </div>
                    {roles.map((role) => {
                      const hasPermission = ROLE_PERMISSIONS[role].includes(permission);
                      const isCurrentRole = role === currentRole;

                      return (
                        <div
                          key={role}
                          className={`flex items-center justify-center ${
                            isCurrentRole ? 'bg-green-50 rounded p-2' : ''
                          }`}
                        >
                          {hasPermission ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <Check className="h-5 w-5" />
                              <span className="text-xs font-medium">Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-400">
                              <X className="h-5 w-5" />
                              <span className="text-xs font-medium">No</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Permission Inheritance Visualization */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Permission Inheritance</h4>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-xs font-medium text-gray-700">User</div>
              <div className="text-xs text-gray-500">1 permission</div>
            </div>

            <div className="flex items-center">
              <div className="h-0.5 w-8 bg-gray-300"></div>
              <div className="text-gray-400">→</div>
              <div className="h-0.5 w-8 bg-gray-300"></div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-xs font-medium text-gray-700">Admin</div>
              <div className="text-xs text-gray-500">7 permissions</div>
            </div>

            <div className="flex items-center">
              <div className="h-0.5 w-8 bg-gray-300"></div>
              <div className="text-gray-400">→</div>
              <div className="h-0.5 w-8 bg-gray-300"></div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <Crown className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-xs font-medium text-gray-700">Super Admin</div>
              <div className="text-xs text-gray-500">11 permissions</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center mt-4">
            Each role inherits all permissions from roles below it, plus additional capabilities
          </p>
        </div>
      </div>
    </Modal>
  );
}
