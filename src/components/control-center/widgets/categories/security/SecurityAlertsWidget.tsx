import { AlertTriangle, Shield, Clock } from 'lucide-react';
import { Connection } from '../../../../../types';

interface SecurityAlertsWidgetProps {
  connections: Connection[];
}

export function SecurityAlertsWidget({ connections }: SecurityAlertsWidgetProps) {
  const alerts = [
    {
      id: '1',
      severity: 'high',
      message: 'Unusual traffic pattern detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      connection: 'AWS Direct Connect'
    },
    {
      id: '2',
      severity: 'medium',
      message: 'Multiple failed authentication attempts',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      connection: 'Azure ExpressRoute'
    },
    {
      id: '3',
      severity: 'low',
      message: 'SSL certificate expiring soon',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      connection: 'Google Cloud Interconnect'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-fw-error mr-2" />
          <span className="text-figma-base font-medium text-fw-heading">Active Alerts</span>
        </div>
        <span className="text-figma-base text-fw-bodyLight">{alerts.length} alerts</span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg ${
              alert.severity === 'high' ? 'bg-red-50' :
              alert.severity === 'medium' ? 'bg-fw-warn/10' :
              'bg-fw-accent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <AlertTriangle className={`h-4 w-4 mr-2 ${
                  alert.severity === 'high' ? 'text-fw-error' :
                  alert.severity === 'medium' ? 'text-fw-warn' :
                  'text-fw-link'
                }`} />
                <span className={`text-figma-base font-medium ${
                  alert.severity === 'high' ? 'text-fw-error' :
                  alert.severity === 'medium' ? 'text-fw-warn' :
                  'text-fw-linkHover'
                }`}>
                  {alert.message}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-figma-sm">
              <span className={`${
                alert.severity === 'high' ? 'text-fw-error' :
                alert.severity === 'medium' ? 'text-fw-warn' :
                'text-fw-link'
              }`}>
                {alert.connection}
              </span>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-fw-bodyLight">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full px-4 py-2 text-figma-base text-fw-link hover:bg-fw-accent rounded-lg transition-colors">
        View All Alerts
      </button>
    </div>
  );
}
