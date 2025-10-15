import { useState } from 'react';
import { Plus, Bell, Mail, MessageSquare, Settings, AlertTriangle, X } from 'lucide-react';
import { ThresholdRule, MetricGroup } from '../../../types/metric';
import { Button } from '../../common/Button';

interface NotificationRulesProps {
  selectedConnection: string;
}

export function NotificationRules({ selectedConnection }: NotificationRulesProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [thresholds, setThresholds] = useState<Record<string, ThresholdRule[]>>({});
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [activeMetricId, setActiveMetricId] = useState<string | null>(null);
  const [notificationChannels, setNotificationChannels] = useState({
    email: true,
    slack: false,
    webhook: false
  });

  // Define metric groups for notifications
  const metricGroups: MetricGroup[] = [
    {
      id: 'performance',
      name: 'Performance Metrics',
      metrics: [
        {
          id: 'latency',
          name: 'Network Latency',
          description: 'Alert when latency exceeds threshold',
          category: 'performance',
          dataType: 'number',
          unit: 'ms',
          aggregation: 'avg'
        },
        {
          id: 'packetLoss',
          name: 'Packet Loss',
          description: 'Alert when packet loss exceeds threshold',
          category: 'performance',
          dataType: 'percentage',
          aggregation: 'avg'
        },
        {
          id: 'bandwidth',
          name: 'Bandwidth Utilization',
          description: 'Alert when bandwidth utilization exceeds threshold',
          category: 'performance',
          dataType: 'percentage',
          aggregation: 'avg'
        }
      ]
    },
    {
      id: 'status',
      name: 'Status Metrics',
      metrics: [
        {
          id: 'uptime',
          name: 'Uptime',
          description: 'Alert when uptime falls below threshold',
          category: 'status',
          dataType: 'percentage'
        },
        {
          id: 'errors',
          name: 'Error Rate',
          description: 'Alert when error rate exceeds threshold',
          category: 'status',
          dataType: 'number'
        }
      ]
    },
    {
      id: 'security',
      name: 'Security Metrics',
      metrics: [
        {
          id: 'failedLogins',
          name: 'Failed Login Attempts',
          description: 'Alert on multiple failed login attempts',
          category: 'security',
          dataType: 'number'
        },
        {
          id: 'ddosActivity',
          name: 'DDoS Activity',
          description: 'Alert on potential DDoS activity',
          category: 'security',
          dataType: 'number'
        }
      ]
    }
  ];

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleAddThreshold = (metricId: string) => {
    setActiveMetricId(metricId);
    setShowThresholdModal(true);
  };

  const handleRemoveThreshold = (metricId: string, ruleId: string) => {
    setThresholds(prev => ({
      ...prev,
      [metricId]: prev[metricId].filter(rule => rule.id !== ruleId)
    }));

    window.addToast({
      type: 'success',
      title: 'Rule Removed',
      message: 'Notification rule has been removed successfully',
      duration: 3000
    });
  };

  const handleSaveThreshold = (rule: ThresholdRule) => {
    if (!activeMetricId) return;

    setThresholds(prev => ({
      ...prev,
      [activeMetricId]: [...(prev[activeMetricId] || []), rule]
    }));

    setShowThresholdModal(false);
    setActiveMetricId(null);

    window.addToast({
      type: 'success',
      title: 'Rule Added',
      message: 'New notification rule has been added successfully',
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notificationChannels.email}
              onChange={(e) => setNotificationChannels(prev => ({
                ...prev,
                email: e.target.checked
              }))}
              className="h-4 w-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
            />
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">Email Notifications</span>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notificationChannels.slack}
              onChange={(e) => setNotificationChannels(prev => ({
                ...prev,
                slack: e.target.checked
              }))}
              className="h-4 w-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
            />
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">Slack Notifications</span>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notificationChannels.webhook}
              onChange={(e) => setNotificationChannels(prev => ({
                ...prev,
                webhook: e.target.checked
              }))}
              className="h-4 w-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
            />
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">Webhook Notifications</span>
            </div>
          </label>
        </div>
      </div>

      {/* Notification Rules */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-brand-blue mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Notification Rules</h3>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowThresholdModal(true)}
          >
            Add Rule
          </Button>
        </div>

        <div className="space-y-4">
          {metricGroups.map(group => (
            <div key={group.id}>
              <h4 className="text-sm font-medium text-gray-900 mb-2">{group.name}</h4>
              <div className="space-y-2">
                {group.metrics.map(metric => (
                  <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={() => handleMetricToggle(metric.id)}
                        className="h-4 w-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                        <p className="text-xs text-gray-500">{metric.description}</p>
                      </div>
                    </div>
                    {selectedMetrics.includes(metric.id) && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddThreshold(metric.id)}
                      >
                        Set Threshold
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showThresholdModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Add Threshold Rule</h3>
              <button onClick={() => setShowThresholdModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Threshold configuration coming soon</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}