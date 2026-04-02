import { useState, useRef } from 'react';
import { Activity, Shield, Settings, Globe, Calendar, Eye, Copy, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { SearchFilterBar } from '../../common/SearchFilterBar';
import { TableFilterPanel, useTableFilters, FilterGroup } from '../../common/TableFilterPanel';
import { OverflowMenu } from '../../common/OverflowMenu';
import { ColumnVisibilityPopover, ColumnDefinition } from '../../common/ColumnVisibilityPopover';
import { useColumnVisibility } from '../../../hooks/useColumnVisibility';

interface LogsContentProps {
  selectedConnection: string;
  connections: any[];
}

const TABLE_ID = 'monitor-logs';

const ALL_COLUMNS: ColumnDefinition[] = [
  { id: 'time', label: 'Time' },
  { id: 'type', label: 'Type' },
  { id: 'severity', label: 'Severity' },
  { id: 'message', label: 'Message' },
  { id: 'source', label: 'Source' },
  { id: 'user', label: 'User' },
];

const SORTABLE_COLUMNS = ['time', 'type', 'severity', 'source', 'user'];

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'type',
    label: 'Log Types',
    type: 'checkbox',
    options: [
      { value: 'system', label: 'System' },
      { value: 'security', label: 'Security' },
      { value: 'user', label: 'User' },
      { value: 'performance', label: 'Performance' },
    ],
  },
  {
    id: 'severity',
    label: 'Severity',
    type: 'checkbox',
    options: [
      { value: 'info', label: 'Info', color: 'info' },
      { value: 'warning', label: 'Warning', color: 'warning' },
      { value: 'error', label: 'Error', color: 'error' },
    ],
  },
  {
    id: 'timeRange',
    label: 'Time Range',
    type: 'select',
    options: [
      { value: '1h', label: 'Last Hour' },
      { value: '6h', label: 'Last 6 Hours' },
      { value: '24h', label: 'Last 24 Hours' },
      { value: '7d', label: 'Last 7 Days' },
      { value: '30d', label: 'Last 30 Days' },
    ],
  },
];

function LogsContent({ selectedConnection, connections }: LogsContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showColumnPopover, setShowColumnPopover] = useState(false);
  const columnButtonRef = useRef<HTMLButtonElement>(null);
  const { isVisible, visibleColumns } = useColumnVisibility(TABLE_ID);

  const { filters, setFilters, isOpen, toggle, activeCount } = useTableFilters({
    groups: FILTER_GROUPS,
    initialFilters: { timeRange: ['24h'] },
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const displayColumns = visibleColumns.length === 0
    ? ALL_COLUMNS
    : ALL_COLUMNS.filter(col => isVisible(col.id));

  // Sample log data
  const logs = [
    {
      id: '1',
      timestamp: '2024-03-11 15:30',
      type: 'system',
      severity: 'info',
      message: 'Connection status updated to Active',
      source: 'Connection Manager',
      user: 'system',
      connectionId: 'conn-1',
      metadata: {
        status: 'Active',
        previousStatus: 'Inactive'
      }
    },
    {
      id: '2',
      timestamp: '2024-03-11 15:25',
      type: 'security',
      severity: 'warning',
      message: 'Multiple failed authentication attempts detected',
      source: 'Security Monitor',
      user: 'system',
      connectionId: 'conn-2',
      metadata: {
        attempts: 3,
        ipAddress: '192.168.1.100'
      }
    },
    {
      id: '3',
      timestamp: '2024-03-11 15:15',
      type: 'user',
      severity: 'info',
      message: 'Modified connection bandwidth settings',
      source: 'User Action',
      user: 'sarah.chen@example.com',
      connectionId: 'conn-1',
      metadata: {
        oldValue: '1 Gbps',
        newValue: '10 Gbps'
      }
    },
    {
      id: '4',
      timestamp: '2024-03-11 15:00',
      type: 'performance',
      severity: 'error',
      message: 'High latency detected on connection',
      source: 'Performance Monitor',
      user: 'system',
      connectionId: 'conn-3',
      metadata: {
        latency: '150ms',
        threshold: '100ms'
      }
    },
    // LMCC-specific log entries
    {
      id: 'lmcc-1',
      timestamp: '2026-07-01 14:00',
      type: 'system',
      severity: 'info',
      message: 'LMCC provisioning initiated - 4 hosted connections across MX304-SV1-A, MX304-SV1-B, MX304-SV5-A, MX304-SV5-B',
      source: 'LMCC Orchestrator',
      user: 'system',
      connectionId: 'conn-lmcc-1',
      metadata: { metro: 'San Jose, CA', paths: 4 }
    },
    {
      id: 'lmcc-2',
      timestamp: '2026-07-01 14:05',
      type: 'system',
      severity: 'info',
      message: 'AWS hosted connection dxcon-abc001 accepted by customer in AWS Console',
      source: 'AWS Partner API',
      user: 'customer@company.com',
      connectionId: 'conn-lmcc-1',
      metadata: { awsConnectionId: 'dxcon-abc001', vlan: 1001 }
    },
    {
      id: 'lmcc-3',
      timestamp: '2026-07-01 14:12',
      type: 'system',
      severity: 'info',
      message: 'Path 1 BGP state transition: idle > connect > active > open-sent > open-confirm > established',
      source: 'BGP Monitor',
      user: 'system',
      connectionId: 'conn-lmcc-1',
      metadata: { ipeId: 'MX304-SV1-A', bgpState: 'established' }
    },
    {
      id: 'lmcc-4',
      timestamp: '2026-07-01 14:15',
      type: 'system',
      severity: 'info',
      message: 'BFD session established on all 4 paths - failover detection active (3x300ms = 900ms)',
      source: 'BFD Monitor',
      user: 'system',
      connectionId: 'conn-lmcc-1',
      metadata: { bfdInterval: 300, bfdMultiplier: 3 }
    },
    {
      id: 'lmcc-5',
      timestamp: '2026-07-01 14:15',
      type: 'system',
      severity: 'info',
      message: 'LMCC billing started - BGP Established on all 4 paths. Trial contract, fixed-rate billing.',
      source: 'Billing Engine',
      user: 'system',
      connectionId: 'conn-lmcc-1',
      metadata: { billingTrigger: 'bgp-established', contractType: 'trial' }
    },
    {
      id: 'lmcc-6',
      timestamp: '2026-07-01 14:15',
      type: 'performance',
      severity: 'info',
      message: '802.1Q VLAN tag verification passed - all 4 IPE sub-interfaces match AWS Console IDs (1001, 1002, 1003, 1004)',
      source: 'LMCC Orchestrator',
      user: 'system',
      connectionId: 'conn-lmcc-1',
      metadata: { vlans: [1001, 1002, 1003, 1004] }
    }
  ];

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    if (selectedConnection !== 'all' && log.connectionId !== selectedConnection) {
      return false;
    }

    const typeFilters = filters.type || [];
    if (typeFilters.length > 0 && !typeFilters.includes(log.type)) {
      return false;
    }

    const severityFilters = filters.severity || [];
    if (severityFilters.length > 0 && !severityFilters.includes(log.severity)) {
      return false;
    }

    if (searchQuery) {
      const searchTerms = searchQuery.toLowerCase().split(' ');
      const searchableText = [
        log.message,
        log.source,
        log.user,
        log.type,
        log.severity
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    }

    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Settings className="h-4 w-4 text-fw-bodyLight" />;
      case 'security':
        return <Shield className="h-4 w-4 text-fw-error" />;
      case 'user':
        return <Activity className="h-4 w-4 text-brand-blue" />;
      case 'performance':
        return <Activity className="h-4 w-4 text-fw-purple" />;
      default:
        return <Globe className="h-4 w-4 text-fw-bodyLight" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-fw-errorLight text-fw-error';
      case 'warning':
        return 'bg-fw-warnLight text-fw-warn';
      case 'info':
        return 'bg-fw-accent text-fw-link';
      default:
        return 'bg-fw-neutral text-fw-body';
    }
  };

  const getOverflowItems = (log: typeof logs[0]) => [
    {
      id: 'view',
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => {
        window.addToast({
          type: 'info',
          title: 'Log Details',
          message: `${log.message} - ${log.source} at ${log.timestamp}`,
          duration: 5000
        });
      }
    },
    {
      id: 'copy',
      label: 'Copy Log',
      icon: <Copy className="h-4 w-4" />,
      onClick: () => {
        const logText = `[${log.timestamp}] [${log.severity.toUpperCase()}] ${log.message} (${log.source})`;
        navigator.clipboard.writeText(logText);
        window.addToast({
          type: 'success',
          title: 'Copied',
          message: 'Log entry copied to clipboard',
          duration: 2000
        });
      }
    },
    {
      id: 'export',
      label: 'Export Entry',
      icon: <Download className="h-4 w-4" />,
      onClick: () => {
        window.addToast({
          type: 'success',
          title: 'Exported',
          message: 'Log entry exported successfully',
          duration: 2000
        });
      }
    }
  ];

  return (
    <div>
      {/* Logs Table */}
      <div className="border border-fw-secondary rounded-lg overflow-hidden">
        {/* Search/Filter bar inside table border */}
        <div className="px-6 py-4 border-b border-fw-secondary">
          <SearchFilterBar
            searchPlaceholder="Search logs..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onFilter={toggle}
            activeFilterCount={activeCount}
            isFilterOpen={isOpen}
            filterPanel={
              <TableFilterPanel
                groups={FILTER_GROUPS}
                activeFilters={filters}
                onFiltersChange={setFilters}
                isOpen={isOpen}
                onToggle={toggle}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />
            }
            onExport={() => {
              window.addToast({
                type: 'success',
                title: 'Logs Exported',
                message: 'Log data has been exported successfully',
                duration: 3000
              });
            }}
          />
        </div>
        <table className="w-full table-fixed">
          <thead className="bg-fw-wash border-b border-fw-secondary">
            <tr>
              {displayColumns.map((col) => {
                const isSortable = SORTABLE_COLUMNS.includes(col.id);
                const isSorted = sortField === col.id;
                return (
                  <th key={col.id} scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading whitespace-nowrap overflow-hidden text-ellipsis align-middle">
                    {isSortable ? (
                      <button onClick={() => handleSort(col.id)} className="group inline-flex items-center space-x-1">
                        <span>{col.label}</span>
                        <span className="flex flex-col">
                          <ChevronUp className={`h-3 w-3 ${isSorted && sortDirection === 'asc' ? 'text-fw-body' : 'text-fw-bodyLight group-hover:text-fw-body'}`} />
                          <ChevronDown className={`h-3 w-3 -mt-1 ${isSorted && sortDirection === 'desc' ? 'text-fw-body' : 'text-fw-bodyLight group-hover:text-fw-body'}`} />
                        </span>
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
              <th scope="col" className="w-16 px-6 h-12 align-middle">
                <div className="flex justify-end">
                  <button
                    ref={columnButtonRef}
                    onClick={() => setShowColumnPopover(!showColumnPopover)}
                    className="p-2 text-fw-bodyLight hover:text-fw-body rounded-full hover:bg-fw-neutral transition-colors"
                    title="Manage Columns"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-fw-base divide-y divide-fw-secondary">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={displayColumns.length + 1} className="px-6 py-4 text-center text-fw-bodyLight">
                  No logs match the current filters
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const cellContent: Record<string, React.ReactNode> = {
                  time: (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-fw-bodyLight mr-2" />
                      <span className="font-mono">{log.timestamp}</span>
                    </div>
                  ),
                  type: (
                    <div className="flex items-center">
                      {getTypeIcon(log.type)}
                      <span className="ml-2 capitalize">{log.type}</span>
                    </div>
                  ),
                  severity: (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-figma-sm font-medium ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  ),
                  message: (
                    <>
                      <div className="text-fw-heading">{log.message}</div>
                      {log.metadata && (
                        <div className="mt-1 text-figma-sm text-fw-bodyLight">
                          {Object.entries(log.metadata).map(([key, value]) => (
                            <span key={key} className="mr-3">{key}: {value}</span>
                          ))}
                        </div>
                      )}
                    </>
                  ),
                  source: log.source,
                  user: log.user,
                };
                return (
                  <tr key={log.id} className="hover:bg-fw-wash transition-colors">
                    {displayColumns.map((col) => (
                      <td key={col.id} className="px-6 py-4 text-[14px] text-fw-body whitespace-nowrap overflow-hidden text-ellipsis">
                        {cellContent[col.id]}
                      </td>
                    ))}
                    <td className="w-16 px-6 py-4">
                      <div className="flex justify-end">
                        <OverflowMenu items={getOverflowItems(log)} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showColumnPopover && (
        <ColumnVisibilityPopover
          tableId={TABLE_ID}
          allColumns={ALL_COLUMNS}
          onClose={() => setShowColumnPopover(false)}
          anchorEl={columnButtonRef.current}
        />
      )}
    </div>
  );
}

export default LogsContent;
