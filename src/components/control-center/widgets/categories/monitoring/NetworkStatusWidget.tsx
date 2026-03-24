import { Activity, Network, Globe } from 'lucide-react';
import { Connection } from '../../../../../types';
import { LineChart } from '../../../../monitoring/charts/LineChart';
import { chartColors } from '../../../../../utils/chartColors';

interface NetworkStatusWidgetProps {
  connections: Connection[];
}

export function NetworkStatusWidget({ connections }: NetworkStatusWidgetProps) {
  const activeConnections = connections.filter(c => c.status === 'Active');
  const avgLatency = activeConnections.reduce((sum, conn) => {
    const latency = parseFloat(conn.performance?.latency || '0');
    return sum + latency;
  }, 0) / activeConnections.length || 0;

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Network Performance',
      data: [98, 99, 97, 99],
      borderColor: chartColors.primary,
      fill: false
    }]
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-fw-accent rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <Activity className="h-4 w-4 text-fw-link" />
            <span className="text-figma-sm text-fw-link">Active</span>
          </div>
          <div className="text-xl font-semibold text-fw-linkHover">
            {activeConnections.length}
          </div>
          <div className="text-figma-sm text-fw-link">Connections</div>
        </div>

        <div className="bg-fw-successLight rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <Network className="h-4 w-4 text-fw-success" />
            <span className="text-figma-sm text-fw-success">Avg</span>
          </div>
          <div className="text-xl font-semibold text-fw-success">
            {avgLatency.toFixed(1)}ms
          </div>
          <div className="text-figma-sm text-fw-success">Latency</div>
        </div>

        <div className="bg-fw-purpleLight rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <Globe className="h-4 w-4 text-fw-purple" />
            <span className="text-figma-sm text-fw-purple">Total</span>
          </div>
          <div className="text-xl font-semibold text-fw-purple">
            {connections.length}
          </div>
          <div className="text-figma-sm text-fw-purple">Networks</div>
        </div>
      </div>

      <div className="h-32">
        <LineChart data={performanceData} />
      </div>
    </div>
  );
}
