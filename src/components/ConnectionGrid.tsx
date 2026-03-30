import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridView } from './connection/views/GridView';
import { ListView } from './connection/views/ListView';
import { TopologyView } from './connection/views/TopologyView';
import { MobileConnectionGrid } from './connection/MobileConnectionGrid';
import { Search, LayoutGrid, List, Network, Download, Minimize2, Maximize2, Group as GroupIcon, PlusCircle } from 'lucide-react';
import { Connection, ViewMode } from '../types';
import { Button } from './common/Button';
import { SearchFilterBar } from './common/SearchFilterBar';
import { TableFilterPanel, useTableFilters, FilterGroup } from './common/TableFilterPanel';
import { useStore } from '../store/useStore';
import { getGroupsForConnection } from '../utils/groups';
import { useIsMobile } from '../hooks/useMobileDetection';

interface ConnectionGridProps {
  connections: Connection[];
}

export function ConnectionGrid({ connections }: ConnectionGridProps) {
  const groups = useStore(state => state.groups);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [areAllMinimized, setAreAllMinimized] = useState(false);

  // Build dynamic filter groups from connection data
  const connectionFilterGroups = useMemo<FilterGroup[]>(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox' as const,
      options: [
        { value: 'Active', label: 'Active', color: 'success' as const },
        { value: 'Inactive', label: 'Inactive', color: 'warning' as const },
      ],
    },
    {
      id: 'type',
      label: 'Connection Type',
      type: 'checkbox' as const,
      options: Array.from(new Set(connections.map(c => c.type))).map(t => ({ value: t, label: t })),
    },
    {
      id: 'location',
      label: 'Location',
      type: 'checkbox' as const,
      options: Array.from(new Set(connections.map(c => c.location))).map(l => ({ value: l, label: l })),
    },
    {
      id: 'groups',
      label: 'Groups',
      type: 'checkbox' as const,
      options: groups.map(g => ({ value: g.id, label: g.name })),
    },
  ], [connections, groups]);

  const { filters, setFilters, isOpen, toggle, activeCount } = useTableFilters({
    groups: connectionFilterGroups,
  });

  const filteredConnections = useMemo(() => {
    if (!Array.isArray(connections)) return [];

    return connections.filter(connection => {
      if (!connection || typeof connection !== 'object') return false;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchLower ||
        Object.values(connection)
          .filter(val => typeof val === 'string')
          .some(val => val.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      const connectionGroups = getGroupsForConnection(groups, connection.id);
      const connectionGroupIds = connectionGroups.map(g => g.id);

      const statusFilters = filters.status || [];
      const typeFilters = filters.type || [];
      const locationFilters = filters.location || [];
      const groupFilters = filters.groups || [];

      if (statusFilters.length > 0 && !statusFilters.includes(connection.status)) return false;
      if (typeFilters.length > 0 && !typeFilters.includes(connection.type)) return false;
      if (locationFilters.length > 0 && !locationFilters.includes(connection.location)) return false;
      if (groupFilters.length > 0 && !groupFilters.some(gId => connectionGroupIds.includes(gId))) return false;

      return true;
    });
  }, [connections, searchQuery, filters, groups]);

  // Log information about the filtered connections for debugging
  console.log('ConnectionGrid: filtered connections', {
    total: connections.length,
    filtered: filteredConnections.length,
    searchQuery,
    filters
  });

  // Use mobile view if on mobile device
  if (isMobile) {
    return <MobileConnectionGrid connections={connections} />;
  }

  return (
    <div className="space-y-6 min-h-[calc(100vh-16rem)] pb-12">
      <div className="flex items-center space-x-4 max-w-full">
        <div className="flex-1">
          <SearchFilterBar
            searchPlaceholder="Search connections ..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onFilter={toggle}
            activeFilterCount={activeCount}
            isFilterOpen={isOpen}
            filterPanel={
              <TableFilterPanel
                groups={connectionFilterGroups}
                activeFilters={filters}
                onFiltersChange={setFilters}
                isOpen={isOpen}
                onToggle={toggle}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />
            }
            onExport={() => {
              const csv = [
                ['Name', 'Type', 'Status', 'Bandwidth', 'Location'].join(','),
                ...filteredConnections.map(c =>
                  [c.name, c.type, c.status, c.bandwidth, c.location].join(',')
                )
              ].join('\n');

              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'connections.csv';
              link.click();
              URL.revokeObjectURL(url);

              window.addToast({
                type: 'success',
                title: 'Export Complete',
                message: 'Connections exported successfully',
                duration: 3000
              });
            }}
            actions={
              <>
                {/* Minimize All */}
                {viewMode === 'grid' && (
                  <Button
                    variant="ghost"
                    icon={areAllMinimized ? Maximize2 : Minimize2}
                    onClick={() => setAreAllMinimized(!areAllMinimized)}
                    size="md"
                  >
                    {areAllMinimized ? 'Expand All' : 'Minimize All'}
                  </Button>
                )}
              </>
            }
          />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-fw-secondary" />

        {/* View toggles - Figma: grouped icon buttons */}
        <div className="flex items-center bg-fw-base rounded-lg border border-fw-secondary p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`quick-action-btn p-2 transition-colors ${
              viewMode === 'grid'
                ? 'text-white bg-fw-primary'
                : 'text-fw-disabled hover:text-fw-bodyLight'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`quick-action-btn p-2 transition-colors ${
              viewMode === 'list'
                ? 'text-white bg-fw-primary'
                : 'text-fw-disabled hover:text-fw-bodyLight'
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('topology')}
            className={`quick-action-btn p-2 transition-colors ${
              viewMode === 'topology'
                ? 'text-white bg-fw-primary'
                : 'text-fw-disabled hover:text-fw-bodyLight'
            }`}
            title="Topology View"
          >
            <Network className="h-4 w-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-fw-secondary" />

        {/* Create Connection - Figma: primary blue pill button */}
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate('/create')}
          size="md"
          className="px-6"
        >
          Create Connection
        </Button>
      </div>

      <div>
        {filteredConnections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-fw-disabled">No connections match your search criteria</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-fw-base rounded-2xl border border-fw-secondary overflow-hidden">
            <ListView
              connections={filteredConnections}
              groups={groups}
            />
          </div>
        ) : viewMode === 'topology' ? (
          <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
            <TopologyView
              connections={filteredConnections}
              groups={groups}
            />
          </div>
        ) : (
          <GridView
            connections={filteredConnections}
            groups={groups}
            isMinimized={areAllMinimized}
          />
        )}
      </div>
    </div>
  );
}