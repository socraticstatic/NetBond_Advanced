import { useState } from 'react';
import { Terminal, Search, Filter, Download, RefreshCw } from 'lucide-react';

export function LogStreamWidget() {
  const [filter, setFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const logs = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'info',
      service: 'connection-manager',
      message: 'Connection status updated successfully'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      level: 'warning',
      service: 'security',
      message: 'High latency detected on AWS Direct Connect'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      level: 'error',
      service: 'monitoring',
      message: 'Failed to collect metrics from endpoint'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 90000).toISOString(),
      level: 'info',
      service: 'auth',
      message: 'User session authenticated'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fw-bodyLight h-4 w-4" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter logs..."
            className="w-full pl-9 pr-4 py-2 text-figma-base border border-fw-secondary rounded-lg focus:ring-2 focus:ring-fw-active focus:border-fw-active"
          />
        </div>
        <button className="p-2 text-fw-bodyLight hover:text-fw-body rounded-lg hover:bg-fw-neutral">
          <Filter className="h-4 w-4" />
        </button>
        <button className="p-2 text-fw-bodyLight hover:text-fw-body rounded-lg hover:bg-fw-neutral">
          <Download className="h-4 w-4" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            autoRefresh
              ? 'text-fw-link bg-fw-accent hover:bg-fw-accent'
              : 'text-fw-bodyLight hover:text-fw-body hover:bg-fw-neutral'
          }`}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Log Stream */}
      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`p-2 rounded-lg font-mono text-figma-sm ${
              log.level === 'error' ? 'bg-red-50 text-fw-error' :
              log.level === 'warning' ? 'bg-fw-warn/10 text-fw-warn' :
              'bg-fw-wash text-fw-body'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-fw-bodyLight">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-figma-sm font-medium ${
                log.level === 'error' ? 'bg-red-50 text-fw-error' :
                log.level === 'warning' ? 'bg-fw-warn/10 text-fw-warn' :
                'bg-fw-accent text-fw-linkHover'
              }`}>
                {log.level.toUpperCase()}
              </span>
              <span className="font-medium">{log.service}</span>
            </div>
            <div className="mt-1">{log.message}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="text-figma-base text-fw-link hover:text-fw-linkHover">
          Load More Logs
        </button>
      </div>
    </div>
  );
}
