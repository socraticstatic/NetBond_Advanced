import { BarChart3, ArrowLeftRight } from 'lucide-react';
import { Connection } from '../../../types';

interface ConnectionCardMetricsProps {
  connection: Connection;
  billingInfo: {
    type: string;
    cost: number | undefined;
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
  };
  performance?: {
    bandwidthUtilization: number;
  };
}

export function ConnectionCardMetrics({
  connection,
  billingInfo,
  performance
}: ConnectionCardMetricsProps) {
  const locations = connection.locations || (connection.location ? [connection.location] : []);
  const primaryLocation = locations[0] || 'Not configured';

  // Derive region from location
  const getRegion = (location: string) => {
    if (location.includes('New York') || location.includes('Ashburn') || location.includes('Boston')) return 'US East';
    if (location.includes('San Jose') || location.includes('Los Angeles') || location.includes('Seattle')) return 'US West';
    if (location.includes('Chicago') || location.includes('Dallas')) return 'US Central';
    if (location.includes('London') || location.includes('Frankfurt') || location.includes('Paris')) return 'Europe';
    if (location.includes('Tokyo') || location.includes('Singapore') || location.includes('Sydney')) return 'Asia Pacific';
    return 'Global';
  };

  const region = getRegion(primaryLocation);

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Bandwidth */}
      <div className="flex items-start space-x-3 p-4 bg-fw-wash rounded-lg">
        <BarChart3 className="h-4 w-4 text-fw-bodyLight mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-figma-base font-medium text-fw-body block">Bandwidth</span>
          <p className="text-figma-lg font-medium text-fw-heading">{connection.bandwidth}</p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start space-x-3 p-4 bg-fw-wash rounded-lg">
        <ArrowLeftRight className="h-4 w-4 text-fw-bodyLight mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-figma-base font-medium text-fw-body block">{region}</span>
          <p className="text-figma-base font-medium text-fw-heading truncate">{primaryLocation}</p>
        </div>
      </div>
    </div>
  );
}
