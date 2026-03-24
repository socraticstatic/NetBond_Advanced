import { useState } from 'react';
import { Shield, Eye, Users, Lock, FileText, Settings, DollarSign, X, ChevronRight, Info, Layers } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from './Button';
import { RoleCapabilityMatrix } from './RoleCapabilityMatrix';
import { AuditLogPanel } from './AuditLogPanel';
import { PermissionBadge } from './PermissionBadge';
import { ResourceFilterBadge } from './ResourceFilterBadge';
import { Role } from '../../types/permissions';
import { permissionChecker } from '../../utils/permissionChecker';

interface RBACDemoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RBACDemoPanel({ isOpen, onClose }: RBACDemoPanelProps) {
  const { currentRole, setRole } = useStore();
  const [showPermissionMatrix, setShowPermissionMatrix] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  if (!isOpen) return null;

  const demoScenarios = [
    {
      id: 'billing-user',
      title: 'Limited Billing Access',
      role: 'user' as Role,
      description: 'Experience restricted access to billing settings',
      steps: [
        'Switch to User role',
        'Navigate to Configure → Billing',
        'Observe warning banner and disabled controls',
        'Try to click "Request Access" button'
      ],
      icon: DollarSign,
      color: 'blue'
    },
    {
      id: 'billing-admin',
      title: 'Full Billing Access',
      role: 'admin' as Role,
      description: 'See how admins can manage billing',
      steps: [
        'Switch to Admin role',
        'Navigate to Configure → Billing',
        'Notice no warnings - full access granted',
        'All save buttons are enabled'
      ],
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'security-locked',
      title: 'Security Settings Lockdown',
      role: 'admin' as Role,
      description: 'See tiered security permissions',
      steps: [
        'Switch to Admin role',
        'Navigate to Configure → System Settings',
        'Click on "Security" tab',
        'See lock overlay - requires Security Admin'
      ],
      icon: Lock,
      color: 'red'
    },
    {
      id: 'security-unlocked',
      title: 'Platform Administrator',
      role: 'super-admin' as Role,
      description: 'Full platform access demonstration',
      steps: [
        'Switch to Super Admin role',
        'Navigate to Configure → System Settings → Security',
        'Full access to all security controls',
        'Notice permission badge at top'
      ],
      icon: Shield,
      color: 'purple'
    }
  ];

  const quickActions = [
    {
      id: 'matrix',
      label: 'View Permission Matrix',
      icon: Eye,
      action: () => setShowPermissionMatrix(true),
      description: 'Compare permissions across all roles'
    },
    {
      id: 'audit',
      label: 'View Audit Log',
      icon: FileText,
      action: () => setShowAuditLog(true),
      description: 'See activity tracking in action'
    },
    {
      id: 'billing',
      label: 'Test Billing Access',
      icon: DollarSign,
      action: () => {
        window.location.hash = '#/configure/billing';
        onClose();
      },
      description: 'Navigate to billing configuration'
    },
    {
      id: 'system',
      label: 'Test System Settings',
      icon: Settings,
      action: () => {
        window.location.hash = '#/configure/system';
        onClose();
      },
      description: 'Navigate to system settings'
    }
  ];

  const handleRunDemo = (scenario: typeof demoScenarios[0]) => {
    setRole(scenario.role);
    setSelectedDemo(scenario.id);

    window.addToast({
      type: 'info',
      title: `Demo: ${scenario.title}`,
      message: `Switched to ${scenario.role} role. ${scenario.description}`,
      duration: 5000
    });

    // Navigate based on scenario
    if (scenario.id.includes('billing')) {
      setTimeout(() => {
        window.location.hash = '#/configure/billing';
        onClose();
      }, 1000);
    } else if (scenario.id.includes('security')) {
      setTimeout(() => {
        window.location.hash = '#/configure/system';
        onClose();
      }, 1000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-fw-base rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 tracking-[-0.03em]">RBAC Demo Control Panel</h2>
                <p className="text-white text-figma-base">
                  Interactive demonstrations of role-based access control best practices
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Current Role Status */}
            <div className="bg-fw-accent border-2 border-fw-active rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-fw-cobalt-600 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-figma-base text-fw-link font-medium">Current Role</p>
                    <p className="text-lg font-bold text-fw-heading capitalize tracking-[-0.03em]">{currentRole.replace('-', ' ')}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPermissionMatrix(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View My Permissions
                </Button>
              </div>

              {/* Scope & Filter Information */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-fw-active">
                <div>
                  <p className="text-figma-sm text-fw-link font-medium mb-1">Default Resource Filter</p>
                  <ResourceFilterBadge
                    filter={permissionChecker.getDefaultScope(currentRole)}
                    showIcon={true}
                  />
                </div>
                <div>
                  <p className="text-figma-sm text-fw-link font-medium mb-1">Maximum Filter Scope</p>
                  <ResourceFilterBadge
                    filter={permissionChecker.getMaxScope(currentRole)}
                    showIcon={true}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-fw-active">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-fw-link mt-0.5 flex-shrink-0" />
                  <p className="text-figma-sm text-fw-link">
                    <span className="font-semibold">Resource Filters</span> control <em>which</em> resources you can access within your scope.
                    <span className="font-semibold"> Scope paths</span> define <em>where</em> in the hierarchy your permissions apply.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-figma-base font-semibold text-fw-heading mb-3 flex items-center gap-2 tracking-[-0.03em]">
                <Info className="h-4 w-4" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="flex items-center gap-3 p-4 bg-fw-base border-2 border-fw-secondary hover:border-fw-active hover:bg-fw-accent rounded-lg transition-all text-left group"
                    >
                      <div className="w-10 h-10 bg-fw-neutral group-hover:bg-fw-accent rounded-lg flex items-center justify-center transition-colors">
                        <Icon className="h-5 w-5 text-fw-bodyLight group-hover:text-fw-link" />
                      </div>
                      <div className="flex-1">
                        <p className="text-figma-base font-semibold text-fw-heading">{action.label}</p>
                        <p className="text-figma-sm text-fw-bodyLight">{action.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-fw-bodyLight group-hover:text-fw-link" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Demo Scenarios */}
            <div>
              <h3 className="text-figma-base font-semibold text-fw-heading mb-3 flex items-center gap-2 tracking-[-0.03em]">
                <Users className="h-4 w-4" />
                Guided Demo Scenarios
              </h3>
              <div className="space-y-3">
                {demoScenarios.map((scenario) => {
                  const Icon = scenario.icon;
                  const isActive = selectedDemo === scenario.id;
                  const colorClasses = {
                    blue: 'bg-fw-accent border-fw-active text-fw-link',
                    green: 'bg-fw-successLight border-fw-success text-fw-success',
                    red: 'bg-fw-errorLight border-fw-error text-fw-error',
                    purple: 'bg-fw-purpleLight border-fw-purple text-fw-purple'
                  }[scenario.color];

                  return (
                    <div
                      key={scenario.id}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        isActive
                          ? 'border-fw-active bg-fw-accent shadow-md'
                          : 'border-fw-secondary bg-fw-base hover:border-fw-secondary'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-figma-base font-semibold text-fw-heading">{scenario.title}</h4>
                              <p className="text-figma-sm text-fw-bodyLight mt-1">{scenario.description}</p>
                            </div>
                            <Button
                              variant={isActive ? 'primary' : 'outline'}
                              size="sm"
                              onClick={() => handleRunDemo(scenario)}
                            >
                              {isActive ? 'Running' : 'Run Demo'}
                            </Button>
                          </div>
                          <div className="mt-3">
                            <p className="text-figma-sm font-medium text-fw-body mb-2">Steps:</p>
                            <ol className="text-figma-sm text-fw-bodyLight space-y-1 list-decimal list-inside">
                              {scenario.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Role Switcher */}
            <div className="mt-6 p-4 bg-fw-wash rounded-lg border border-fw-secondary">
              <h4 className="text-figma-base font-semibold text-fw-heading mb-3 tracking-[-0.03em]">Manual Role Switch</h4>
              <div className="grid grid-cols-3 gap-3">
                {(['user', 'admin', 'super-admin'] as Role[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => setRole(role)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currentRole === role
                        ? 'border-fw-active bg-fw-accent shadow-sm'
                        : 'border-fw-secondary bg-fw-base hover:border-fw-active'
                    }`}
                  >
                    <p className={`text-figma-base font-semibold capitalize ${
                      currentRole === role ? 'text-fw-heading' : 'text-fw-body'
                    }`}>
                      {role.replace('-', ' ')}
                    </p>
                    <PermissionBadge
                      requirement={{ permission: 'view', role }}
                      variant="compact"
                      showTooltip={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-fw-secondary p-4 bg-fw-wash">
            <div className="flex items-center justify-between">
              <p className="text-figma-sm text-fw-bodyLight">
                Tip: Run a demo scenario to see RBAC in action
              </p>
              <Button variant="outline" onClick={onClose}>
                Close Panel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Matrix Modal */}
      <RoleCapabilityMatrix
        isOpen={showPermissionMatrix}
        onClose={() => setShowPermissionMatrix(false)}
        currentRole={currentRole}
      />

      {/* Audit Log Panel */}
      <AuditLogPanel
        isOpen={showAuditLog}
        onClose={() => setShowAuditLog(false)}
      />
    </>
  );
}
