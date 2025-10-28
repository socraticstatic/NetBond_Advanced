import { Filter, X } from 'lucide-react';
import { AnomalyFilter, AnomalySeverity, AnomalyStatus } from '../../../types/anomaly';

interface AnomalyFiltersProps {
  filter: AnomalyFilter;
  onFilterChange: (filter: AnomalyFilter) => void;
  connectionNames: { id: string; name: string }[];
}

export function AnomalyFilters({ filter, onFilterChange, connectionNames }: AnomalyFiltersProps) {
  const toggleSeverity = (severity: AnomalySeverity) => {
    const current = filter.severity || [];
    const updated = current.includes(severity)
      ? current.filter(s => s !== severity)
      : [...current, severity];
    onFilterChange({ ...filter, severity: updated.length > 0 ? updated : undefined });
  };

  const toggleStatus = (status: AnomalyStatus) => {
    const current = filter.status || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    onFilterChange({ ...filter, status: updated.length > 0 ? updated : undefined });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    (filter.severity && filter.severity.length > 0) ||
    (filter.status && filter.status.length > 0) ||
    (filter.connectionIds && filter.connectionIds.length > 0);

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
          <div className="space-y-2">
            {(['critical', 'warning', 'info'] as AnomalySeverity[]).map((severity) => (
              <label key={severity} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.severity?.includes(severity) || false}
                  onChange={() => toggleSeverity(severity)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{severity}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2">
            {(['active', 'acknowledged', 'resolved'] as AnomalyStatus[]).map((status) => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.status?.includes(status) || false}
                  onChange={() => toggleStatus(status)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="connection-select" className="block text-sm font-medium text-gray-700 mb-2">
            Connection
          </label>
          <select
            id="connection-select"
            value={filter.connectionIds?.[0] || ''}
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange({
                ...filter,
                connectionIds: value ? [value] : undefined
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Connections</option>
            {connectionNames.map((conn) => (
              <option key={conn.id} value={conn.id}>
                {conn.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
