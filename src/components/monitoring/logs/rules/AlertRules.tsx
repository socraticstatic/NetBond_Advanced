import { useState } from 'react';
import { Plus, Edit, Trash2, Bell, Mail, MessageSquare, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../../common/Button';

interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: {
    type: 'severity' | 'keyword' | 'pattern' | 'frequency';
    value: string;
    operator: 'equals' | 'contains' | 'matches' | 'exceeds';
  };
  actions: {
    email?: boolean;
    slack?: boolean;
    webhook?: boolean;
  };
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastTriggered?: string;
  triggerCount: number;
}

interface AlertRulesProps {
  selectedConnection: string;
}

export function AlertRules({ selectedConnection }: AlertRulesProps) {
  const [rules, setRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'Critical Error Detection',
      description: 'Alert when critical errors are logged',
      condition: {
        type: 'severity',
        value: 'error',
        operator: 'equals'
      },
      actions: {
        email: true,
        slack: true,
        webhook: false
      },
      enabled: true,
      priority: 'critical',
      lastTriggered: '2024-03-11 15:30',
      triggerCount: 12
    },
    {
      id: '2',
      name: 'Authentication Failure',
      description: 'Alert on multiple failed authentication attempts',
      condition: {
        type: 'keyword',
        value: 'authentication failed',
        operator: 'contains'
      },
      actions: {
        email: true,
        slack: false,
        webhook: true
      },
      enabled: true,
      priority: 'high',
      lastTriggered: '2024-03-11 14:15',
      triggerCount: 5
    },
    {
      id: '3',
      name: 'High Latency Warning',
      description: 'Alert when latency exceeds threshold',
      condition: {
        type: 'pattern',
        value: 'latency.*[0-9]{3,}ms',
        operator: 'matches'
      },
      actions: {
        email: false,
        slack: true,
        webhook: false
      },
      enabled: false,
      priority: 'medium',
      triggerCount: 0
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));

    const rule = rules.find(r => r.id === ruleId);
    window.addToast({
      type: 'success',
      title: 'Rule Updated',
      message: `Rule "${rule?.name}" ${rule?.enabled ? 'disabled' : 'enabled'}`,
      duration: 3000
    });
  };

  const deleteRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    setRules(rules.filter(r => r.id !== ruleId));

    window.addToast({
      type: 'success',
      title: 'Rule Deleted',
      message: `Rule "${rule?.name}" has been deleted`,
      duration: 3000
    });
  };

  const getPriorityColor = (priority: AlertRule['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Alert Rules</h3>
          <p className="text-sm text-gray-500 mt-1">
            Create rules to automatically generate alerts based on log patterns
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          Create Alert Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`card p-6 hover:shadow-md transition-shadow ${
              !rule.enabled ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Bell className={`h-5 w-5 ${rule.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h4 className="text-base font-semibold text-gray-900">{rule.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rule.priority)}`}>
                    {rule.priority.toUpperCase()}
                  </span>
                  {rule.enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">{rule.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Condition:</span>
                    <span className="ml-2 text-gray-900 font-medium">
                      {rule.condition.type} {rule.condition.operator} "{rule.condition.value}"
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500">Actions:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {rule.actions.email && <Mail className="h-4 w-4 text-gray-600" />}
                      {rule.actions.slack && <MessageSquare className="h-4 w-4 text-gray-600" />}
                      {rule.actions.webhook && <AlertTriangle className="h-4 w-4 text-gray-600" />}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                  <span>Triggered: {rule.triggerCount} times</span>
                  {rule.lastTriggered && (
                    <span>Last: {rule.lastTriggered}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>

                <button
                  onClick={() => {
                    window.addToast({
                      type: 'info',
                      title: 'Edit Rule',
                      message: 'Rule editor coming soon',
                      duration: 3000
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <Edit className="h-5 w-5" />
                </button>

                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Create Alert Rule</h3>
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Alert rule builder coming soon</p>
              <p className="text-sm mt-2">Configure conditions, actions, and priorities</p>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
