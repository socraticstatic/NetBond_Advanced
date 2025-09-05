import { useState } from 'react';
import { Plus, Bell, Mail, MessageSquare, Settings } from 'lucide-react';
import { MetricSelector } from '../../monitoring/reporting/reports/components/MetricSelector';
import { ThresholdModal } from '../../monitoring/reporting/reports/components/ThresholdModal';
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

        <MetricSelector
          metricGroups={metricGroups}
          selectedMetrics={selectedMetrics}
          thresholds={thresholds}
          onMetricToggle={handleMetricToggle}
          onAddThreshold={handleAddThreshold}
          onRemoveThreshold={handleRemoveThreshold}
        />
      </div>

      <ThresholdModal
        isOpen={showThresholdModal}
        onClose={() => setShowThresholdModal(false)}
        onSave={handleSaveThreshold}
        metricId={activeMetricId || ''}
      />
    </div>
  );
}