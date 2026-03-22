import { useState } from 'react';
import { Check, X, Shield, Crown, ChevronDown, ChevronUp, Info, Layers, Eye, Building2 } from 'lucide-react';
import { UserIcon } from './UserIcon';
import { Role, ROLE_PERMISSIONS, PERMISSION_LABELS, ResourceType, RESOURCE_LABELS, ROLE_DEFAULT_FILTER, ROLE_MAX_FILTER } from '../../types/permissions';
import { RESOURCE_FILTER_LABELS, RESOURCE_FILTER_DESCRIPTIONS } from '../../types/scope';
import { Modal } from './Modal';
import { ResourceFilterBadge } from './ResourceFilterBadge';

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
        return <UserIcon size="sm" />;
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
        <div className="bg-fw-accent border border-fw-active rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-fw-link mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-figma-base font-semibold text-fw-heading mb-1 tracking-[-0.03em]">Understanding Roles & Permissions</h4>
              <p className="text-figma-sm text-fw-link">
                This matrix shows what each role can do in the system. Your current role is <span className="font-semibold">{currentRole}</span>.
                Permissions are cumulative - higher roles inherit all permissions from lower roles.
              </p>
            </div>
          </div>
        </div>

        {/* Role Headers */}
        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-fw-secondary">
          <div className="text-[14px] font-medium text-fw-heading">Permission</div>
          {roles.map((role) => {
            const isCurrentRole = role === currentRole;

            return (
              <div
                key={role}
                className={`text-center rounded-lg p-2 ${
                  isCurrentRole ? 'bg-fw-wash border border-fw-secondary' : ''
                }`}
              >
                <div className={`inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.03em] ${
                  isCurrentRole ? 'text-fw-link' : 'text-fw-heading'
                }`}>
                  {getRoleIcon(role)}
                  <span className="capitalize">{role.replace('-', ' ')}</span>
                </div>
                {isCurrentRole && (
                  <div className="text-[12px] text-fw-link font-medium mt-1">Your Role</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Permission Categories */}
        {Object.entries(permissionsByCategory).map(([categoryKey, category]) => (
          <div key={categoryKey} className="rounded-lg border border-fw-secondary overflow-hidden">
            <button
              onClick={() => toggleSection(categoryKey)}
              className="tab-button w-full flex items-center justify-between px-4 py-3 hover:bg-fw-wash transition-colors"
            >
              <div className="text-left">
                <h3 className="text-[14px] font-medium text-fw-heading">{category.label}</h3>
                <p className="text-[12px] text-fw-bodyLight mt-0.5">{category.description}</p>
              </div>
              {expandedSection === categoryKey ? (
                <ChevronUp className="h-4 w-4 text-fw-bodyLight" />
              ) : (
                <ChevronDown className="h-4 w-4 text-fw-bodyLight" />
              )}
            </button>

            {expandedSection === categoryKey && (
              <div className="divide-y divide-fw-secondary">
                {category.permissions.map((permission) => (
                  <div key={permission} className="grid grid-cols-4 gap-4 items-center px-4 py-3">
                    <div className="text-[14px] text-fw-body font-medium">
                      {PERMISSION_LABELS[permission]}
                    </div>
                    {roles.map((role) => {
                      const hasPermission = ROLE_PERMISSIONS[role].includes(permission);

                      return (
                        <div key={role} className="flex items-center justify-center">
                          {hasPermission ? (
                            <div className="flex items-center gap-1.5 text-fw-success">
                              <Check className="h-4 w-4" />
                              <span className="text-[12px] font-medium">Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-fw-bodyLight">
                              <X className="h-4 w-4" />
                              <span className="text-[12px] font-medium">No</span>
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
        <div className="bg-fw-wash border border-fw-secondary rounded-lg p-4">
          <h4 className="text-figma-base font-semibold text-fw-heading mb-3 tracking-[-0.03em]">Permission Inheritance</h4>
          <div className="flex items-center justify-center gap-0">
            {/* User */}
            <div className="flex flex-col items-center" style={{ width: '80px' }}>
              <div className="w-14 h-14 bg-fw-accent rounded-full flex items-center justify-center">
                <UserIcon size="lg" variant="primary" />
              </div>
              <div className="text-[12px] font-medium text-fw-body mt-2">User</div>
              <div className="text-[11px] text-fw-bodyLight">1 permission</div>
            </div>
            {/* Arrow */}
            <div className="flex items-center self-start" style={{ marginTop: '24px' }}>
              <div className="h-0.5 w-4 bg-fw-secondary" />
              <span className="text-fw-bodyLight text-xs mx-0.5">&#8594;</span>
              <div className="h-0.5 w-4 bg-fw-secondary" />
            </div>
            {/* Admin */}
            <div className="flex flex-col items-center" style={{ width: '80px' }}>
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center">
                <Shield className="h-7 w-7 text-fw-purple" />
              </div>
              <div className="text-[12px] font-medium text-fw-body mt-2">Admin</div>
              <div className="text-[11px] text-fw-bodyLight">7 permissions</div>
            </div>
            {/* Arrow */}
            <div className="flex items-center self-start" style={{ marginTop: '24px' }}>
              <div className="h-0.5 w-4 bg-fw-secondary" />
              <span className="text-fw-bodyLight text-xs mx-0.5">&#8594;</span>
              <div className="h-0.5 w-4 bg-fw-secondary" />
            </div>
            {/* Super Admin */}
            <div className="flex flex-col items-center" style={{ width: '80px' }}>
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                <Crown className="h-7 w-7 text-fw-error" />
              </div>
              <div className="text-[12px] font-medium text-fw-body mt-2">Super Admin</div>
              <div className="text-[11px] text-fw-bodyLight">11 permissions</div>
            </div>
          </div>
          <p className="text-figma-sm text-fw-bodyLight text-center mt-4">
            Each role inherits all permissions from roles below it, plus additional capabilities
          </p>
        </div>

        {/* Resource Filter Scope by Role */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-4">
            <Layers className="h-5 w-5 text-fw-purple mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-figma-base font-semibold text-fw-purple mb-1 tracking-[-0.03em]">Resource Filter Scope by Role</h4>
              <p className="text-figma-sm text-fw-body">
                Resource filters control <em>which</em> resources you can access. Each role has default and maximum filter levels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {roles.map((role) => {
              const defaultFilter = ROLE_DEFAULT_FILTER[role];
              const maxFilter = ROLE_MAX_FILTER[role];
              const isCurrentRole = role === currentRole;

              return (
                <div
                  key={role}
                  className={`bg-fw-base border-2 rounded-lg p-3 ${
                    isCurrentRole
                      ? 'border-green-500 shadow-sm'
                      : 'border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {getRoleIcon(role)}
                    <span className="text-figma-base font-semibold text-fw-heading capitalize">
                      {role.replace('-', ' ')}
                    </span>
                    {isCurrentRole && (
                      <span className="ml-auto text-figma-sm font-medium text-fw-success bg-green-100 px-2 py-0.5 rounded">You</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-figma-sm text-fw-bodyLight mb-1">Default Filter:</p>
                      <ResourceFilterBadge filter={defaultFilter} showIcon={false} />
                    </div>
                    <div>
                      <p className="text-figma-sm text-fw-bodyLight mb-1">Max Filter:</p>
                      <ResourceFilterBadge filter={maxFilter} showIcon={false} />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-fw-secondary">
                    <p className="text-figma-sm text-fw-bodyLight">
                      {RESOURCE_FILTER_DESCRIPTIONS[defaultFilter]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scope Path Examples */}
        <div className="bg-fw-accent border border-fw-active rounded-lg p-4">
          <div className="flex items-start gap-3 mb-4">
            <Building2 className="h-5 w-5 text-fw-link mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-figma-base font-semibold text-fw-heading mb-1 tracking-[-0.03em]">Understanding Scope Paths</h4>
              <p className="text-figma-sm text-fw-link">
                Scope paths define <em>where</em> in the resource hierarchy your permissions apply. Permissions inherit down the tree.
              </p>
            </div>
          </div>

          <div className="bg-fw-base border border-fw-active rounded-lg p-3">
            <p className="text-figma-sm font-medium text-fw-heading mb-2">Hierarchical Scope Example:</p>
            <div className="space-y-1 text-figma-sm font-mono text-fw-body">
              <div className="flex items-center gap-2">
                <span className="text-fw-bodyLight">├─</span>
                <code className="bg-fw-neutral px-2 py-0.5 rounded">/platform</code>
                <span className="text-fw-bodyLight">(entire platform)</span>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <span className="text-fw-bodyLight">├─</span>
                <code className="bg-fw-neutral px-2 py-0.5 rounded">/tenants/acme-corp</code>
                <span className="text-fw-bodyLight">(tenant scope)</span>
              </div>
              <div className="flex items-center gap-2 ml-6">
                <span className="text-fw-bodyLight">├─</span>
                <code className="bg-fw-neutral px-2 py-0.5 rounded">/tenants/acme-corp/departments/engineering</code>
              </div>
              <div className="flex items-center gap-2 ml-9">
                <span className="text-fw-bodyLight">└─</span>
                <code className="bg-fw-neutral px-2 py-0.5 rounded">/tenants/acme-corp/departments/engineering/pools/prod</code>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-fw-secondary text-figma-sm text-fw-bodyLight">
              <Eye className="h-3.5 w-3.5 inline mr-1" />
              <span className="font-medium">Example:</span> Admin role assigned at <code className="bg-fw-neutral px-1 py-0.5 rounded text-fw-heading">/tenants/acme-corp/departments/engineering</code> can access all resources in engineering dept and child scopes (like prod pool).
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
