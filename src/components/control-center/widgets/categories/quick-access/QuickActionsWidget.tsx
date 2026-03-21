import { Plus, Network, Shield, Bell, Settings, ChevronRight } from 'lucide-react';

export function QuickActionsWidget() {
  const actions = [
    {
      id: 'create-connection',
      label: 'Create Connection',
      icon: Plus,
      color: 'blue'
    },
    {
      id: 'network-test',
      label: 'Network Test',
      icon: Network,
      color: 'green'
    },
    {
      id: 'security-scan',
      label: 'Security Scan',
      icon: Shield,
      color: 'purple'
    },
    {
      id: 'view-alerts',
      label: 'View Alerts',
      icon: Bell,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`
              quick-action-btn p-3 text-left transition-colors
              ${action.color === 'blue' ? 'bg-fw-accent hover:bg-fw-accent' :
                action.color === 'green' ? 'bg-green-50 hover:bg-green-50' :
                action.color === 'purple' ? 'bg-purple-50 hover:bg-purple-50' :
                'bg-fw-warn/10 hover:bg-fw-warn/15'}
            `}
          >
            <action.icon className={`
              h-5 w-5 mb-2
              ${action.color === 'blue' ? 'text-fw-link' :
                action.color === 'green' ? 'text-fw-success' :
                action.color === 'purple' ? 'text-fw-purple' :
                'text-fw-warn'}
            `} />
            <div className={`
              text-figma-base font-medium
              ${action.color === 'blue' ? 'text-fw-linkHover' :
                action.color === 'green' ? 'text-fw-success' :
                action.color === 'purple' ? 'text-fw-purple' :
                'text-fw-warn'}
            `}>
              {action.label}
            </div>
          </button>
        ))}
      </div>

      <button className="quick-action-btn w-full flex items-center justify-between px-4 py-2 text-figma-base text-fw-body hover:bg-fw-wash transition-colors">
        <div className="flex items-center">
          <Settings className="h-4 w-4 text-fw-bodyLight mr-2" />
          <span>Configure Quick Actions</span>
        </div>
        <ChevronRight className="h-4 w-4 text-fw-bodyLight" />
      </button>
    </div>
  );
}
