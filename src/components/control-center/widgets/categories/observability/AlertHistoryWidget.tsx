import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';

export function AlertHistoryWidget() {
  const alerts = [
    {
      id: '1',
      type: 'error',
      message: 'High latency detected on AWS Direct Connect',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'active'
    },
    {
      id: '2',
      type: 'warning',
      message: 'Bandwidth utilization above 80%',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'resolved'
    },
    {
      id: '3',
      type: 'info',
      message: 'Automatic failover completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'resolved'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-fw-warn mr-2" />
          <span className="text-figma-base font-medium text-fw-heading">Alert History</span>
        </div>
        <button className="p-1 text-fw-bodyLight hover:text-fw-body rounded-lg hover:bg-fw-neutral">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-2 rounded-lg ${
              alert.type === 'error' ? 'bg-red-50' :
              alert.type === 'warning' ? 'bg-fw-warn/10' :
              'bg-fw-accent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                {alert.status === 'active' ? (
                  <AlertTriangle className={`h-4 w-4 mr-2 ${
                    alert.type === 'error' ? 'text-fw-error' :
                    alert.type === 'warning' ? 'text-fw-warn' :
                    'text-fw-link'
                  }`} />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2 text-fw-success" />
                )}
                <span className={`text-figma-base ${
                  alert.type === 'error' ? 'text-fw-error' :
                  alert.type === 'warning' ? 'text-fw-warn' :
                  'text-fw-linkHover'
                }`}>
                  {alert.message}
                </span>
              </div>
            </div>
            <div className="flex items-center text-figma-sm text-fw-bodyLight ml-6">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(alert.timestamp).toLocaleString()}
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
