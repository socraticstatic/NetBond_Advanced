import { Network, Activity } from 'lucide-react';
import { Connection } from '../../../../../types';

interface ConnectionsWidgetProps {
  connections: Connection[];
}

export function ConnectionsWidget({ connections }: ConnectionsWidgetProps) {
  const activeConnections = connections.filter(c => c.status === 'Active');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-figma-base text-fw-bodyLight">Active Connections</span>
        <span className="text-figma-base font-medium text-fw-heading">{activeConnections.length}/{connections.length}</span>
      </div>

      <div className="space-y-2">
        {activeConnections.slice(0, 3).map((connection) => (
          <div key={connection.id} className="flex items-center justify-between p-2 bg-fw-wash rounded-lg">
            <div className="flex items-center">
              <Network className="h-4 w-4 text-fw-bodyLight mr-2" />
              <div>
                <div className="text-figma-base font-medium text-fw-heading">{connection.name}</div>
                <div className="text-figma-sm text-fw-bodyLight">{connection.type}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-fw-success mr-1" />
              <span className="text-figma-sm text-fw-success">{connection.performance?.latency}</span>
            </div>
          </div>
        ))}
      </div>

      {activeConnections.length > 3 && (
        <div className="text-center">
          <button className="text-figma-base text-fw-link hover:text-fw-linkHover">
            View {activeConnections.length - 3} more
          </button>
        </div>
      )}
    </div>
  );
}
