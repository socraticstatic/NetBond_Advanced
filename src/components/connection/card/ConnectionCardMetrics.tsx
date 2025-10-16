import { Activity, Router, Network, Building2, MapPin, Cloud } from 'lucide-react';
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
  const providers = connection.providers || (connection.provider ? [connection.provider] : []);
  const locations = connection.locations || (connection.location ? [connection.location] : []);
  const datacenters = connection.datacenters || [];
  const cloudRouterCount = connection.cloudRouterCount || 0;
  const linkCount = connection.linkCount || 0;

  const getLocationDisplay = () => {
    if (locations.length === 0) return 'No locations';
    if (locations.length === 1) return locations[0];
    if (locations.length === 2) return locations.join(', ');
    return `${locations[0]}, ${locations[1]}, +${locations.length - 2}`;
  };

  const getInfrastructureSummary = () => {
    const parts = [];

    if (providers.length > 1) {
      parts.push(`${providers.length} Providers`);
    } else if (providers.length === 1) {
      parts.push(providers[0]);
    }

    if (cloudRouterCount > 0) {
      parts.push(`${cloudRouterCount} Router${cloudRouterCount !== 1 ? 's' : ''}`);
    }

    if (linkCount > 0) {
      parts.push(`${linkCount} Link${linkCount !== 1 ? 's' : ''}`);
    }

    if (datacenters.length > 0) {
      if (datacenters.length === 1) {
        parts.push(datacenters[0]);
      } else {
        parts.push(`${datacenters.length} Datacenters`);
      }
    }

    return parts;
  };

  const infrastructureParts = getInfrastructureSummary();
  const fullInfraText = infrastructureParts.join(' • ');
  const displayInfraText = infrastructureParts.length > 2
    ? `${infrastructureParts.slice(0, 2).join(', ')}...`
    : infrastructureParts.join(', ');

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Locations */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <MapPin className="h-4 w-4 text-gray-600" />
        <div className="min-w-0">
          <span className="text-xs text-gray-500">Locations</span>
          <p className="text-sm font-medium text-gray-900 truncate" title={locations.join(', ')}>
            {getLocationDisplay()}
          </p>
        </div>
      </div>

      {/* Infrastructure - Show providers, routers, links, datacenters */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        {providers.length > 1 || cloudRouterCount > 0 || datacenters.length > 0 ? (
          <Building2 className="h-4 w-4 text-blue-600" />
        ) : providers.length === 1 ? (
          <Cloud className="h-4 w-4 text-gray-600" />
        ) : (
          <Router className="h-4 w-4 text-gray-600" />
        )}
        <div className="min-w-0">
          <span className="text-xs text-gray-500">Infrastructure</span>
          <p className="text-sm font-medium text-gray-900 truncate" title={fullInfraText}>
            {infrastructureParts.length > 0 ? displayInfraText : 'Not configured'}
          </p>
        </div>
      </div>

      {/* Billing */}
      <div className={`flex flex-col p-3 ${billingInfo.bgColor} rounded-lg border border-${billingInfo.color}-200`}>
        <div className="text-xs text-gray-500 mb-1">{billingInfo.type}</div>
        <div className="text-sm font-semibold text-gray-900">
          {billingInfo.cost ? formatCurrency(billingInfo.cost) : '-'}
        </div>
        <div className={`text-xs font-medium ${billingInfo.textColor}`}>
          {billingInfo.label}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
