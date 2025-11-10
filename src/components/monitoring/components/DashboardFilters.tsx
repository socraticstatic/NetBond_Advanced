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
    selectedLink,
    selectedRouter,
    resourceType,
    timeRange,
    isRefreshing,
    lastRefreshed,
    allVNFs,
    allLinks,
    allRouters,
    setSelectedConnection,
    setSelectedGroup,
    setSelectedVNF,
    setSelectedLink,
    setSelectedRouter,
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

  const getResourceList = () => {
    switch (resourceType) {
      case 'vnf':
        return allVNFs || [];
      case 'link':
        return allLinks || [];
      case 'router':
        return allRouters || [];
      default:
        return [];
    }
  };

  const getResourceName = (resource: any) => {
    switch (resourceType) {
      case 'vnf':
        return `${resource.name} (${resource.type})`;
      case 'link':
        return `${resource.name} (VLAN ${resource.vlanId})`;
      case 'router':
        return `${resource.name} (${resource.vendor})`;
      default:
        return resource.name;
    }
  };

  const getSelectedResource = () => {
    switch (resourceType) {
      case 'vnf':
        return selectedVNF;
      case 'link':
        return selectedLink;
      case 'router':
        return selectedRouter;
      default:
        return null;
    }
  };

  const setSelectedResource = (value: string) => {
    switch (resourceType) {
      case 'vnf':
        setSelectedVNF?.(value);
        break;
      case 'link':
        setSelectedLink?.(value);
        break;
      case 'router':
        setSelectedRouter?.(value);
        break;
    }
  };

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(resourceTypeConfig) as [ResourceType, typeof resourceTypeConfig[ResourceType]][]).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setResourceType?.(type)}
                      className={`
                        flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${resourceType === type
                          ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="connection-select-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Scope
              </label>
              <select
                id="connection-select-mobile"
                value={selectedConnection}
                onChange={(e) => setSelectedConnection?.(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Connections</option>
                {connections.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="time-range-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <select
                id="time-range-mobile"
                value={timeRange}
                onChange={(e) => setTimeRange?.(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="5m">Last 5 Minutes</option>
                <option value="15m">Last 15 Minutes</option>
                <option value="1h">Last Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>

          {children && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }

  const resources = getResourceList();
  const selectedResource = getSelectedResource();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="space-y-6">
          {/* LEVEL 1: Resource Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              1. What would you like to monitor?
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(resourceTypeConfig) as [ResourceType, typeof resourceTypeConfig[ResourceType]][]).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setResourceType?.(type)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${resourceType === type
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {resourceTypeConfig[resourceType].description}
            </p>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* LEVEL 2: Scope Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              2. Select scope
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Connection Filter - Always visible for context */}
              <div>
                <label htmlFor="connection-select" className="block text-xs font-medium text-gray-600 mb-1.5">
                  {resourceType === 'connection' ? 'View' : 'Within Connection'}
                </label>
                <select
                  id="connection-select"
                  value={selectedConnection}
                  onChange={(e) => setSelectedConnection?.(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">
                    {resourceType === 'connection' ? 'All Connections (Aggregated)' : 'All Connections'}
                  </option>
                  {connections.map((conn) => (
                    <option key={conn.id} value={conn.id}>
                      {conn.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {resourceType === 'connection'
                    ? 'Select a specific connection or view all'
                    : 'Filter resources by parent connection'}
                </p>
              </div>

              {/* Pool Filter - Show for all resource types */}
              <div>
                <label htmlFor="group-select" className="block text-xs font-medium text-gray-600 mb-1.5">
                  {resourceType === 'pool' ? 'View' : 'Within Pool'}
                </label>
                <select
                  id="group-select"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup?.(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">
                    {resourceType === 'pool' ? 'All Pools (Aggregated)' : 'All Pools'}
                  </option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {resourceType === 'pool'
                    ? 'Select a specific pool or view all'
                    : 'Filter resources by pool membership'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* LEVEL 3: Specific Resource Selection (VNF/Link/Router only) */}
          {['vnf', 'link', 'router'].includes(resourceType) && resources.length > 0 && (
            <div>
              <label htmlFor="resource-select" className="block text-sm font-medium text-gray-700 mb-3">
                3. Select specific {resourceTypeConfig[resourceType].label.toLowerCase().slice(0, -1)} (optional)
              </label>
              <select
                id="resource-select"
                value={selectedResource || 'all'}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All {resourceTypeConfig[resourceType].label} (Aggregated)</option>
                {resources.map((resource: any) => (
                  <option key={resource.id} value={resource.id}>
                    {getResourceName(resource)}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                View aggregated metrics for all {resourceTypeConfig[resourceType].label.toLowerCase()}, or select one for detailed individual performance
              </p>
            </div>
          )}

          {/* Time Range and Refresh */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 mb-2">
                  Time Range
                </label>
                <select
                  id="time-range"
                  value={timeRange}
                  onChange={(e) => setTimeRange?.(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="5m">Last 5 Minutes</option>
                  <option value="15m">Last 15 Minutes</option>
                  <option value="1h">Last Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Last refreshed: {formattedLastRefreshed || 'Never'}
                </p>
              </div>

              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="primary"
                className="flex-shrink-0"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </div>

          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
