import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import { usePermission } from '../hooks/usePermission';
import { LMCCKickoffModal } from './connection/lmcc/LMCCKickoffModal';
import { LMCCOnboardingDrawer } from './connection/lmcc/LMCCOnboardingDrawer';
import { MOCK_LMCC_CONNECTIONS } from '../data/lmccService';
import { LMCCOnboardingConfig } from '../types/lmcc';

interface ConnectionGridProps {
  connections: Connection[];
}

export function ConnectionGrid({ connections }: ConnectionGridProps) {
  const groups = useStore(state => state.groups);
  const updateConnection = useStore(state => state.updateConnection);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const canCreate = usePermission('create');

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [areAllMinimized, setAreAllMinimized] = useState(false);

  // Auto-detect pending AWS Max connections and prompt "Did you initiate?"
  const [awsMaxPromptConn, setAwsMaxPromptConn] = useState<Connection | null>(null);
  const [awsMaxPromptDismissed, _setAwsMaxPromptDismissed] = useState(
    () => sessionStorage.getItem('lmcc-prompt-dismissed') === 'true'
  );
  const setAwsMaxPromptDismissed = (v: boolean) => {
    _setAwsMaxPromptDismissed(v);
    if (v) sessionStorage.setItem('lmcc-prompt-dismissed', 'true');
  };
  const [showKickoff, setShowKickoff] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (awsMaxPromptDismissed) return;
    const pendingAwsMax = connections.find(c =>
      c.status === 'Pending' && c.configuration?.isLmcc && c.configuration?.lmccPending
    );
    if (pendingAwsMax && !awsMaxPromptConn) {
      // Delay slightly so the page renders first
      const timer = setTimeout(() => setAwsMaxPromptConn(pendingAwsMax), 1500);
      return () => clearTimeout(timer);
    }
  }, [connections, awsMaxPromptDismissed]);

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
        {canCreate && (
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => navigate('/create')}
            size="md"
            className="px-6"
          >
            Create Connection
          </Button>
        )}
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

      {/* "Did you initiate?" confirmation for pending AWS Max connections */}
      {awsMaxPromptConn && !showKickoff && !showOnboarding && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => { setAwsMaxPromptConn(null); setAwsMaxPromptDismissed(true); }}>
          <div className="bg-fw-base rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 bg-fw-wash border-b border-fw-secondary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-lg bg-fw-base border border-fw-secondary flex items-center justify-center p-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em]">New AWS Max Connection</h2>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-figma-base text-fw-body mb-3">
                Did you initiate an AWS Max connection?
              </p>
              <p className="text-figma-sm text-fw-bodyLight mb-4">
                We detected a new pending Maximum Resiliency connection in <strong>{awsMaxPromptConn.configuration?.lmccMetro || awsMaxPromptConn.location}</strong> from AWS Account <strong>{awsMaxPromptConn.origin?.externalAccountId || 'unknown'}</strong>.
              </p>
              <div className="p-3 rounded-lg bg-fw-wash border border-fw-secondary mb-4">
                <div className="flex items-center gap-2 text-figma-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[10px] font-medium" style={{ color: '#0057b8', backgroundColor: 'rgba(0,87,184,0.16)' }}>AWS Max</span>
                  <span className="text-fw-heading font-medium">{awsMaxPromptConn.name}</span>
                </div>
                <p className="text-figma-xs text-fw-bodyLight mt-1">4 hosted connections awaiting acceptance and configuration</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-fw-secondary bg-fw-wash flex items-center justify-between">
              <button
                onClick={() => { setAwsMaxPromptConn(null); setAwsMaxPromptDismissed(true); }}
                className="text-figma-sm font-medium text-fw-bodyLight hover:text-fw-body"
              >
                No, dismiss
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowKickoff(true)}
              >
                Yes, set it up
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Kickoff modal after "Yes" confirmation */}
      {awsMaxPromptConn && showKickoff && !showOnboarding && createPortal(
        <LMCCKickoffModal
          connection={MOCK_LMCC_CONNECTIONS.find(c => c.status === 'pending-acceptance') || MOCK_LMCC_CONNECTIONS[0]}
          isOpen={true}
          onClose={() => { setShowKickoff(false); setAwsMaxPromptConn(null); setAwsMaxPromptDismissed(true); }}
          onStartSetup={() => { setShowKickoff(false); setShowOnboarding(true); }}
        />,
        document.body
      )}

      {/* Onboarding drawer after kickoff */}
      {awsMaxPromptConn && showOnboarding && createPortal(
        <LMCCOnboardingDrawer
          connection={MOCK_LMCC_CONNECTIONS.find(c => c.status === 'pending-acceptance') || MOCK_LMCC_CONNECTIONS[0]}
          isOpen={true}
          onClose={() => { setShowOnboarding(false); setAwsMaxPromptConn(null); setAwsMaxPromptDismissed(true); }}
          onActivate={(config: LMCCOnboardingConfig) => {
            setShowOnboarding(false);
            setAwsMaxPromptDismissed(true);
            if (awsMaxPromptConn) {
              updateConnection(awsMaxPromptConn.id, {
                status: 'Active',
                name: config.cloudRouterName || awsMaxPromptConn.name,
                configuration: { ...awsMaxPromptConn.configuration, lmccPending: false, lmccActivePaths: 4 },
              });
            }
            setAwsMaxPromptConn(null);
            window.addToast?.({
              type: 'success',
              title: 'AWS Max Connection Activated',
              message: `${config.cloudRouterName} is now active with 4 paths.`,
              duration: 5000,
            });
          }}
        />,
        document.body
      )}
    </div>
  );
}