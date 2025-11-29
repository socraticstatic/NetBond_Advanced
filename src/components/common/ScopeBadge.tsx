import { Building2, Users, Database, Globe, Lock, Eye } from 'lucide-react';

type ScopeLevel = 'own' | 'department' | 'pool' | 'tenant' | 'platform';

interface ScopeBadgeProps {
  scope: ScopeLevel;
  label?: string;
  showIcon?: boolean;
  variant?: 'default' | 'detailed';
}

export function ScopeBadge({ scope, label, showIcon = true, variant = 'default' }: ScopeBadgeProps) {
  const scopeConfig = {
    'own': {
      icon: Eye,
      color: 'blue',
      label: 'Own Resources',
      description: 'You can only view and manage your own resources'
    },
    'department': {
      icon: Users,
      color: 'green',
      label: 'Department',
      description: 'Access to all resources within your department'
    },
    'pool': {
      icon: Database,
      color: 'purple',
      label: 'Pool',
      description: 'Access to all resources in assigned pools'
    },
    'tenant': {
      icon: Building2,
      color: 'orange',
      label: 'Tenant',
      description: 'Full access to all tenant resources'
    },
    'platform': {
      icon: Globe,
      color: 'red',
      label: 'Platform',
      description: 'Cross-tenant access to all platform resources'
    }
  };

  const config = scopeConfig[scope];
  const Icon = config.icon;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    red: 'bg-red-100 text-red-800 border-red-300',
  }[config.color];

  return (
    <div className="relative inline-flex group">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${colorClasses}`}>
        {showIcon && <Icon className="h-3.5 w-3.5" />}
        <span>{label || config.label}</span>
      </span>

      {variant === 'detailed' && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          {config.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TenantBadgeProps {
  tenantName: string;
  tenantId?: string;
  isCrossTenant?: boolean;
}

export function TenantBadge({ tenantName, tenantId, isCrossTenant }: TenantBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
      <Building2 className="h-4 w-4 text-gray-600" />
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-900">{tenantName}</span>
        {tenantId && <span className="text-xs text-gray-500">{tenantId}</span>}
      </div>
      {isCrossTenant && (
        <div className="relative group">
          <Lock className="h-3.5 w-3.5 text-orange-500" />
          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
            Cross-tenant access
          </div>
        </div>
      )}
    </div>
  );
}

interface AccessPathProps {
  path: Array<{ type: string; name: string }>;
  className?: string;
}

export function AccessPath({ path, className = '' }: AccessPathProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {path.map((item, index) => (
        <div key={index} className="inline-flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-300">
            {item.name}
          </span>
          {index < path.length - 1 && (
            <span className="text-gray-400">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

interface ScopeFilterPillProps {
  activeScope: ScopeLevel;
  availableScopes: ScopeLevel[];
  onScopeChange: (scope: ScopeLevel) => void;
}

export function ScopeFilterPills({ activeScope, availableScopes, onScopeChange }: ScopeFilterPillProps) {
  return (
    <div className="inline-flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
      {availableScopes.map((scope) => {
        const isActive = scope === activeScope;
        return (
          <button
            key={scope}
            onClick={() => onScopeChange(scope)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ScopeBadge scope={scope} showIcon={false} variant="default" />
          </button>
        );
      })}
    </div>
  );
}
