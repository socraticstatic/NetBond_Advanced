import { Search, Activity, Wifi, Signal, CheckCircle, XCircle } from 'lucide-react';

export function DiagnosticsWidget() {
  const diagnostics = [
    {
      id: 'network',
      name: 'Network Connectivity',
      status: 'healthy',
      metric: '99.99%',
      lastCheck: new Date(Date.now() - 1000 * 60).toISOString()
    },
    {
      id: 'latency',
      name: 'Response Time',
      status: 'healthy',
      metric: '4.2ms',
      lastCheck: new Date(Date.now() - 1000 * 60 * 2).toISOString()
    },
    {
      id: 'dns',
      name: 'DNS Resolution',
      status: 'degraded',
      metric: '85%',
      lastCheck: new Date(Date.now() - 1000 * 60 * 3).toISOString()
    },
    {
      id: 'ssl',
      name: 'SSL Certificates',
      status: 'healthy',
      metric: 'Valid',
      lastCheck: new Date(Date.now() - 1000 * 60 * 4).toISOString()
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Search className="h-5 w-5 text-fw-link mr-2" />
          <span className="text-figma-base font-medium text-fw-heading">System Health</span>
        </div>
        <button className="text-figma-base text-fw-link hover:text-fw-linkHover">
          Run Tests
        </button>
      </div>

      <div className="space-y-2">
        {diagnostics.map((diagnostic) => (
          <div key={diagnostic.id} className="p-2 bg-fw-wash rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                {diagnostic.status === 'healthy' ? (
                  <CheckCircle className="h-4 w-4 text-fw-success mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-fw-warn mr-2" />
                )}
                <span className="text-figma-base text-fw-heading">{diagnostic.name}</span>
              </div>
              <span className={`text-figma-base font-medium ${
                diagnostic.status === 'healthy' ? 'text-fw-success' : 'text-fw-warn'
              }`}>
                {diagnostic.metric}
              </span>
            </div>
            <div className="text-figma-sm text-fw-bodyLight ml-6">
              Last checked: {new Date(diagnostic.lastCheck).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 px-3 py-2 text-figma-base text-fw-link hover:bg-fw-accent rounded-lg transition-colors">
          View Details
        </button>
        <button className="flex-1 px-3 py-2 text-figma-base text-fw-link hover:bg-fw-accent rounded-lg transition-colors">
          Configure Tests
        </button>
      </div>
    </div>
  );
}
