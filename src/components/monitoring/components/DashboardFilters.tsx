import { ReactNode } from 'react';
import { Button } from '../../common/Button';
import { Group } from '../../../types';
import { RefreshCw, Network, Radio, Link as LinkIcon, Box } from 'lucide-react';
import { useMonitoring } from '../context/MonitoringContext';
import { ResourceType } from '../../../types/metric';

interface DashboardFiltersProps {
  connections: Array<{ id: string; name: string }>;
  groups?: Array<Group>;
  isMobile?: boolean;
  children?: ReactNode;
}

export function DashboardFilters({
  connections,
  groups = [],
  isMobile = false,
  children
}: DashboardFiltersProps) {
  const {
    selectedConnection,
    selectedGroup,
    selectedVNF,
    resourceType,
    timeRange,
    isRefreshing,
    lastRefreshed,
    allVNFs,
    setSelectedConnection,
    setSelectedGroup,
    setSelectedVNF,
    setResourceType,
    setTimeRange,
    handleRefresh
  } = useMonitoring();

  const resourceTypeConfig: Record<ResourceType, { icon: typeof Network; label: string; description: string }> = {
    connection: { icon: Network, label: 'Connections', description: 'View connection-level metrics' },
    pool: { icon: Box, label: 'Pools', description: 'View pool-aggregated metrics' },
    router: { icon: Radio, label: 'Cloud Routers', description: 'View cloud router performance' },
    link: { icon: LinkIcon, label: 'Links', description: 'View link utilization and traffic' },
    vnf: { icon: Box, label: 'VNFs', description: 'View VNF throughput and sessions' }
  };

  const formattedLastRefreshed = lastRefreshed 
    ? lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
    : '';

  if (isMobile) {
    // Mobile optimized version
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4">
          {/* Connection Selector */}
          <div className="mb-4">
            <label htmlFor="connection-select-mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Connection
            </label>
            <select
              id="connection-select-mobile"
              value={selectedConnection}
              onChange={(e) => setSelectedConnection(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
            >
              <option value="all">All Connections</option>
              {connections.map((conn) => (
                <option key={conn.id} value={conn.id}>
                  {conn.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Time Range Selector */}
          <div className="mb-4">
            <label htmlFor="time-range-mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select
              id="time-range-mobile"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
            >
              <option value="15m">Last 15 Minutes</option>
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          
          {/* Refresh Button */}
          <Button
            variant="primary"
            icon={RefreshCw}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`w-full justify-center ${isRefreshing ? 'cursor-not-allowed' : ''}`}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          
          {lastRefreshed && (
            <div className="mt-2 text-xs text-center text-gray-500">
              Last refreshed: {formattedLastRefreshed}
            </div>
          )}
          
          {children && (
            <div className="mt-4">{children}</div>
          )}
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Resource Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Resource Type
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(resourceTypeConfig) as ResourceType[]).map((type) => {
            const config = resourceTypeConfig[type];
            const Icon = config.icon;
            const isActive = resourceType === type;

            return (
              <button
                key={type}
                onClick={() => setResourceType(type)}
                className={`
                  flex items-center space-x-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200
                  ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                title={config.description}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{config.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {resourceTypeConfig[resourceType].description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label htmlFor="connection-select" className="block text-sm font-medium text-gray-700 mb-2">
            View Statistics For
          </label>
          <select
            id="connection-select"
            value={selectedConnection}
            onChange={(e) => setSelectedConnection(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Connections (Cumulative)</option>
            {connections.map((conn) => (
              <option key={conn.id} value={conn.id}>
                {conn.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Select 'All Connections' to view aggregated statistics across all connections
          </p>
        </div>
        
        <div>
          <label htmlFor="group-select" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Pool
          </label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup?.(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Pools</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Select a pool to view statistics for connections in that pool
          </p>
        </div>
        
        <div>
          <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <div className="flex space-x-2">
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="15m">Last 15 Minutes</option>
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          
          {lastRefreshed && (
            <p className="mt-1 text-xs text-gray-500">
              Last refreshed: {formattedLastRefreshed}
            </p>
          )}
          
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`w-full justify-center mt-4 ${isRefreshing ? 'cursor-not-allowed' : ''}`}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* VNF Selector - shown only when VNF resource type is selected */}
      {resourceType === 'vnf' && allVNFs && allVNFs.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <label htmlFor="vnf-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Specific VNF
          </label>
          <select
            id="vnf-select"
            value={selectedVNF || 'all'}
            onChange={(e) => setSelectedVNF?.(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All VNFs (Aggregated)</option>
            {allVNFs.map((vnf) => (
              <option key={vnf.id} value={vnf.id}>
                {vnf.name} ({vnf.type})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Select a specific VNF to view its individual performance metrics and type-specific data
          </p>
        </div>
      )}
    </div>
  );
}