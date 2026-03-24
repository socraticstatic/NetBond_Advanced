import { Server, Activity, Thermometer, Power } from 'lucide-react';
import { Card } from '../../../../common/Card';

export function DataCenterWidget() {
  const dataCenters = [
    {
      name: 'US East',
      status: 'Operational',
      capacity: 85,
      temperature: '22°C',
      power: '3.2 MW'
    },
    {
      name: 'US West',
      status: 'Operational',
      capacity: 72,
      temperature: '21°C',
      power: '2.8 MW'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {dataCenters.map((dc) => (
          <Card key={dc.name}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-fw-link mr-2" />
                <h3 className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{dc.name}</h3>
              </div>
              <span className="px-2 py-1 text-figma-sm font-medium rounded-full bg-fw-successLight text-fw-success">
                {dc.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-figma-base">
                <div className="flex items-center text-fw-bodyLight">
                  <Activity className="h-4 w-4 mr-1" />
                  <span>Capacity</span>
                </div>
                <span className="font-medium text-fw-heading">{dc.capacity}%</span>
              </div>
              <div className="flex items-center justify-between text-figma-base">
                <div className="flex items-center text-fw-bodyLight">
                  <Thermometer className="h-4 w-4 mr-1" />
                  <span>Temperature</span>
                </div>
                <span className="font-medium text-fw-heading">{dc.temperature}</span>
              </div>
              <div className="flex items-center justify-between text-figma-base">
                <div className="flex items-center text-fw-bodyLight">
                  <Power className="h-4 w-4 mr-1" />
                  <span>Power Usage</span>
                </div>
                <span className="font-medium text-fw-heading">{dc.power}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
