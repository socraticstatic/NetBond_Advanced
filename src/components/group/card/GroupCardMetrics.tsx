import { User, Network, DollarSign } from 'lucide-react';
import { Group } from '../../../types/group';

interface GroupCardMetricsProps {
  group: Group;
}

export function GroupCardMetrics({ group }: GroupCardMetricsProps) {
  return (
    <div className="space-y-3">
      {/* Top Row: Members & Connections */}
      <div className="grid grid-cols-2 gap-3">
        {/* Members */}
        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <User className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-blue-900 block mb-0.5">Members</span>
            <p className="text-sm font-semibold text-blue-700">
              {group.userIds.length} {group.userIds.length === 1 ? 'User' : 'Users'}
            </p>
          </div>
        </div>

        {/* Connections */}
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <Network className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-gray-700 block mb-0.5">Connections</span>
            <p className="text-sm font-semibold text-gray-900">
              {group.connectionIds.length} Active
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Monthly Cost */}
      <div>
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-700 flex-shrink-0" />
            <span className="text-xs font-medium text-green-900">Monthly Cost</span>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(group.billing?.monthlyRate || 0)}
            </p>
          </div>
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
