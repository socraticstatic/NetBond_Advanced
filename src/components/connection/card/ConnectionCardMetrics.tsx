import { Activity, ArrowRightLeft, Network } from 'lucide-react';

interface ConnectionCardMetricsProps {
  bandwidth: string;
  location: string;
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

/**
 * Metrics component for the connection card
 * Displays bandwidth, location, and billing information
 */
export function ConnectionCardMetrics({
  bandwidth,
  location,
  billingInfo,
  performance
}: ConnectionCardMetricsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Activity className="h-4 w-4 text-gray-400" />
        <div>
          <span className="text-xs text-gray-500">Bandwidth</span>
          <p className="text-sm font-medium text-gray-900">{bandwidth}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <ArrowRightLeft className="h-4 w-4 text-gray-400" />
        <div>
          <span className="text-xs text-gray-500">Location</span>
          <p className="text-sm font-medium text-gray-900">{location}</p>
        </div>
      </div>
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

// Utility function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}