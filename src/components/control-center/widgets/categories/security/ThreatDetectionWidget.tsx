import { Activity, Shield, AlertTriangle } from 'lucide-react';
import { Connection } from '../../../../../types';
import { LineChart } from '../../../../monitoring/charts/LineChart';
import { chartColors } from '../../../../../utils/chartColors';

interface ThreatDetectionWidgetProps {
  connections: Connection[];
}

export function ThreatDetectionWidget({ connections }: ThreatDetectionWidgetProps) {
  const threatData = {
    labels: ['5m ago', '4m ago', '3m ago', '2m ago', '1m ago', 'now'],
    datasets: [
      {
        label: 'Threat Level',
        data: [2, 3, 4, 2, 1, 2],
        borderColor: chartColors.error,
        fill: false
      }
    ]
  };

  const activeThreats = [
    {
      id: '1',
      type: 'DDoS',
      severity: 'high',
      target: 'AWS Direct Connect',
      status: 'mitigating'
    },
    {
      id: '2',
      type: 'Brute Force',
      severity: 'medium',
      target: 'Azure ExpressRoute',
      status: 'monitoring'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Threat Level Chart */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">Threat Level</h3>
          <select className="text-figma-base border-fw-secondary rounded-md">
            <option>Last Hour</option>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
          </select>
        </div>
        <div className="h-32">
          <LineChart data={threatData} />
        </div>
      </div>

      {/* Active Threats */}
      <div>
        <h4 className="text-figma-base font-medium text-fw-heading mb-3 tracking-[-0.03em]">Active Threats</h4>
        <div className="space-y-3">
          {activeThreats.map((threat) => (
            <div key={threat.id} className="p-3 bg-fw-errorLight rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-fw-error mr-2" />
                  <span className="text-figma-base font-medium text-fw-error">{threat.type} Attack</span>
                </div>
                <span className={`px-2 py-1 text-figma-sm font-medium rounded-full ${
                  threat.severity === 'high' ? 'bg-fw-errorLight text-fw-error' : 'bg-fw-warn/10 text-fw-warn'
                }`}>
                  {threat.severity.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-figma-base">
                <span className="text-fw-error">{threat.target}</span>
                <span className="text-fw-error">{threat.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-fw-wash rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <Activity className="h-4 w-4 text-fw-bodyLight" />
            <span className="text-figma-sm text-fw-bodyLight">24h Threats</span>
          </div>
          <div className="text-xl font-bold text-fw-heading">24</div>
        </div>
        <div className="p-3 bg-fw-wash rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <Shield className="h-4 w-4 text-fw-bodyLight" />
            <span className="text-figma-sm text-fw-bodyLight">Blocked</span>
          </div>
          <div className="text-xl font-bold text-fw-heading">98%</div>
        </div>
        <div className="p-3 bg-fw-wash rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <AlertTriangle className="h-4 w-4 text-fw-bodyLight" />
            <span className="text-figma-sm text-fw-bodyLight">Risk Level</span>
          </div>
          <div className="text-xl font-bold text-fw-heading">Low</div>
        </div>
      </div>
    </div>
  );
}
