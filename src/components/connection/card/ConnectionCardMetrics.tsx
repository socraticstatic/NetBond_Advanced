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

  const hasMultipleResources = providers.length > 1 || locations.length > 1 || datacenters.length > 0;

  const getResourceSummary = () => {
    const parts = [];

    if (cloudRouterCount > 0) {
      parts.push(`${cloudRouterCount} Router${cloudRouterCount !== 1 ? 's' : ''}`);
    }

    if (linkCount > 0) {
      parts.push(`${linkCount} Link${linkCount !== 1 ? 's' : ''}`);
    }

    if (providers.length > 1) {
      parts.push(`${providers.length} Providers`);
    } else if (providers.length === 1) {
      parts.push(providers[0]);
    }

    if (locations.length > 1) {
      parts.push(`${locations.length} Locations`);
    } else if (locations.length === 1 && !hasMultipleResources) {
      parts.push(locations[0]);
    }

    if (datacenters.length > 1) {
      parts.push(`${datacenters.length} Datacenters`);
    } else if (datacenters.length === 1) {
      parts.push(datacenters[0]);
    }

    return parts;
  };

  const resourceParts = getResourceSummary();

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Network Resources - Show routers and links */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Router className="h-4 w-4 text-blue-600" />
        <div className="min-w-0">
          <span className="text-xs text-gray-500">Network</span>
          <p className="text-sm font-medium text-gray-900 truncate">
            {cloudRouterCount > 0 || linkCount > 0 ? (
              <>
                {cloudRouterCount > 0 && `${cloudRouterCount} Router${cloudRouterCount !== 1 ? 's' : ''}`}
                {cloudRouterCount > 0 && linkCount > 0 && ', '}
                {linkCount > 0 && `${linkCount} Link${linkCount !== 1 ? 's' : ''}`}
              </>
            ) : (
              'Not configured'
            )}
          </p>
        </div>
      </div>

      {/* Infrastructure - Show providers, locations, datacenters */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        {providers.length > 1 || locations.length > 1 || datacenters.length > 0 ? (
          <Building2 className="h-4 w-4 text-green-600" />
        ) : providers.length === 1 ? (
          <Cloud className="h-4 w-4 text-gray-600" />
        ) : (
          <MapPin className="h-4 w-4 text-gray-600" />
        )}
        <div className="min-w-0">
          <span className="text-xs text-gray-500">Infrastructure</span>
          <p className="text-sm font-medium text-gray-900 truncate" title={resourceParts.join(' • ')}>
            {resourceParts.length > 0 ? (
              resourceParts.length > 2 ? (
                `${resourceParts.slice(0, 2).join(', ')}...`
              ) : (
                resourceParts.join(', ')
              )
            ) : (
              'Not configured'
            )}
          </p>
        </div>
      </div>

      {/* Billing - Keep as is */}
      <div className={`flex flex-col p-3 ${billingInfo.bgColor} rounded-lg border border-${billingInfo.color}-200`}>
        <div className="text-xs text-gray-500 mb-1">Utilization</div>
        <div className="text-sm font-semibold text-gray-900">
          {performance?.bandwidthUtilization ? `${performance.bandwidthUtilization}%` : '-'}
        </div>
        <div className={`text-xs font-medium ${billingInfo.textColor}`}>
          {billingInfo.cost ? formatCurrency(billingInfo.cost) : billingInfo.label}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
