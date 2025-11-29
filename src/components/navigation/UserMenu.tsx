import { useState, useRef, useEffect } from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { PermissionBadge } from '../common/PermissionBadge';
import { ResourceFilterBadge } from '../common/ResourceFilterBadge';
import { permissionChecker } from '../../utils/permissionChecker';
import { UserIcon } from '../common/UserIcon';

interface UserMenuProps {
  name: string;
  role: string;
  account: string;
  avatar?: string;
  onClick: () => void;
}

export function UserMenu({ name, role, account, avatar, onClick }: UserMenuProps) {
  const [showRBACDropdown, setShowRBACDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentRole = useStore(state => state.currentRole);
  const userScope = permissionChecker.getDefaultScope(currentRole);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRBACDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center pl-6 border-l border-fw-secondary" ref={dropdownRef}>
      <div className="flex items-center">
        <div className="hidden md:block mr-4 text-right">
          <div className="text-sm font-medium text-fw-heading">{name}</div>
          <div className="text-xs text-fw-bodyLight leading-relaxed">{role}</div>
          <div className="text-xs text-fw-bodyLight">{account}</div>
        </div>
        <div className="flex items-center gap-2">
          {/* RBAC Indicator Button */}
          <button
            onClick={() => setShowRBACDropdown(!showRBACDropdown)}
            className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fw-active"
            title="View RBAC Info"
          >
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          </button>

          {/* User Avatar */}
          <button
            onClick={onClick}
            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fw-active"
          >
            <span className="sr-only">Open user menu</span>
            {avatar ? (
              <img
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                src={avatar}
                alt={name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-fw-ctaPrimary flex items-center justify-center text-fw-linkPrimary">
                <span className="font-medium">{name.charAt(0)}</span>
              </div>
            )}
          </button>
        </div>

        {/* RBAC Dropdown */}
        {showRBACDropdown && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">RBAC Information</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Current Role */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Role</label>
                <div className="mt-1 px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
                  <span className="text-sm font-semibold text-blue-900 capitalize">
                    {currentRole.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Resource Scope */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resource Scope</label>
                <div className="mt-1">
                  <ResourceFilterBadge filter={userScope} showIcon={true} />
                </div>
              </div>

              {/* Key Permissions */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Key Permissions</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Connections</span>
                    <div className="flex gap-1">
                      <PermissionBadge
                        requirement={{ permission: 'view', resource: 'connection' }}
                        variant="compact"
                        showTooltip={false}
                      />
                      <PermissionBadge
                        requirement={{ permission: 'edit', resource: 'connection' }}
                        variant="compact"
                        showTooltip={false}
                      />
                      <PermissionBadge
                        requirement={{ permission: 'delete', resource: 'connection' }}
                        variant="compact"
                        showTooltip={false}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Pools</span>
                    <div className="flex gap-1">
                      <PermissionBadge
                        requirement={{ permission: 'view', resource: 'pool' }}
                        variant="compact"
                        showTooltip={false}
                      />
                      <PermissionBadge
                        requirement={{ permission: 'create', resource: 'pool' }}
                        variant="compact"
                        showTooltip={false}
                      />
                      <PermissionBadge
                        requirement={{ permission: 'edit', resource: 'pool' }}
                        variant="compact"
                        showTooltip={false}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Billing</span>
                    <div className="flex gap-1">
                      <PermissionBadge
                        requirement={{ permission: 'view', resource: 'billing' }}
                        variant="compact"
                        showTooltip={false}
                      />
                      <PermissionBadge
                        requirement={{ permission: 'edit', resource: 'billing' }}
                        variant="compact"
                        showTooltip={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* View Full Matrix Link */}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowRBACDropdown(false);
                    onClick();
                  }}
                  className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium text-center py-2 rounded hover:bg-blue-50 transition-colors"
                >
                  View Full Capability Matrix →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}