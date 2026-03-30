import { useState, useMemo, useRef } from 'react';
import { AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp, Settings, Eye, Copy, Download } from 'lucide-react';
import { SearchFilterBar } from '../../common/SearchFilterBar';
import { TableFilterPanel, useTableFilters, FilterGroup } from '../../common/TableFilterPanel';
import { OverflowMenu } from '../../common/OverflowMenu';
import { ColumnVisibilityPopover, ColumnDefinition } from '../../common/ColumnVisibilityPopover';
import { useColumnVisibility } from '../../../hooks/useColumnVisibility';

interface Log {
  id: string;
  logId: number;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'security' | 'performance' | 'user';
  message: string;
  details?: string;
  source: string;
  user?: string;
}

interface ConnectionLogsProps {
  connectionId: string | null;
}

const TABLE_ID = 'connection-logs';

const ALL_COLUMNS: ColumnDefinition[] = [
  { id: 'logId', label: 'Log ID' },
  { id: 'timestamp', label: 'Timestamp' },
  { id: 'type', label: 'Type' },
  { id: 'category', label: 'Category' },
  { id: 'message', label: 'Message' },
  { id: 'source', label: 'Source' },
];

const SORTABLE_COLUMNS = ['logId', 'timestamp', 'type', 'category', 'source'];

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'type',
    label: 'Type',
    type: 'toggle',
    options: [
      { value: 'error', label: 'Error', color: 'error' },
      { value: 'warning', label: 'Warning', color: 'warning' },
      { value: 'info', label: 'Info', color: 'info' },
      { value: 'success', label: 'Success', color: 'success' },
    ],
  },
  {
    id: 'category',
    label: 'Category',
    type: 'toggle',
    options: [
      { value: 'system', label: 'System' },
      { value: 'security', label: 'Security' },
      { value: 'performance', label: 'Performance' },
      { value: 'user', label: 'User' },
    ],
  },
];

export function ConnectionLogs({ connectionId }: ConnectionLogsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Log>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showColumnPopover, setShowColumnPopover] = useState(false);
  const columnButtonRef = useRef<HTMLButtonElement>(null);
  const { isVisible, visibleColumns } = useColumnVisibility(TABLE_ID);

  const { filters, setFilters, isOpen, toggle, activeCount } = useTableFilters({
    groups: FILTER_GROUPS,
  });

  const logs: Log[] = [
    {
      id: '1',
      logId: 10001,
      timestamp: '2024-03-10T15:30:00Z',
      type: 'error',
      category: 'system',
      message: 'Connection timeout detected',
      details: 'Failed to establish connection after 30s',
      source: 'System Monitor',
      user: 'system'
    },
    {
      id: '2',
      logId: 10002,
      timestamp: '2024-03-10T15:29:00Z',
      type: 'warning',
      category: 'performance',
      message: 'High latency detected',
      details: 'Latency spike to 150ms',
      source: 'Performance Monitor',
      user: 'system'
    },
    {
      id: '3',
      logId: 10003,
      timestamp: '2024-03-10T15:28:00Z',
      type: 'success',
      category: 'system',
      message: 'Connection established',
      details: 'Successfully established connection',
      source: 'Connection Manager',
      user: 'system'
    },
    {
      id: '4',
      logId: 10004,
      timestamp: '2024-03-10T15:27:00Z',
      type: 'info',
      category: 'security',
      message: 'Security scan completed',
      details: 'No vulnerabilities detected',
      source: 'Security Scanner',
      user: 'system'
    },
    {
      id: '5',
      logId: 10005,
      timestamp: '2024-03-10T15:26:00Z',
      type: 'warning',
      category: 'security',
      message: 'Multiple failed login attempts',
      details: '3 failed attempts from IP 192.168.1.100',
      source: 'Security Monitor',
      user: 'system'
    }
  ];

  const handleSort = (field: keyof Log) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredLogs = useMemo(() => {
    const typeFilters = filters.type || [];
    const categoryFilters = filters.category || [];

    return logs
      .filter(log => {
        if (typeFilters.length > 0 && !typeFilters.includes(log.type)) return false;
        if (categoryFilters.length > 0 && !categoryFilters.includes(log.category)) return false;
        if (searchQuery.trim()) {
          const searchTerms = searchQuery.toLowerCase().split(' ');
          const searchableText = [
            log.logId.toString(),
            log.message,
            log.details,
            log.source,
            log.type,
            log.category
          ].filter(Boolean).join(' ').toLowerCase();
          return searchTerms.every(term => searchableText.includes(term));
        }
        return true;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        if (sortField === 'timestamp') {
          return (new Date(aValue as string).getTime() - new Date(bValue as string).getTime()) * modifier;
        }
        if (sortField === 'logId') {
          return (a.logId - b.logId) * modifier;
        }
        return String(aValue).localeCompare(String(bValue)) * modifier;
      });
  }, [searchQuery, filters, sortField, sortDirection]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-fw-error" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-fw-warn" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-fw-success" />;
      default: return <Info className="h-4 w-4 text-fw-link" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'error': return 'bg-fw-errorLight text-fw-error';
      case 'warning': return 'bg-fw-warnLight text-fw-warn';
      case 'success': return 'bg-fw-successLight text-fw-success';
      default: return 'bg-fw-accent text-fw-link';
    }
  };

  const getOverflowItems = (log: Log) => [
    {
      id: 'view',
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => {
        window.addToast({
          type: 'info',
          title: 'Log Details',
          message: `${log.message} - ${log.source} at ${new Date(log.timestamp).toLocaleString()}`,
          duration: 5000
        });
      }
    },
    {
      id: 'copy',
      label: 'Copy Log',
      icon: <Copy className="h-4 w-4" />,
      onClick: () => {
        const logText = `[${new Date(log.timestamp).toLocaleString()}] [${log.type.toUpperCase()}] ${log.message} (${log.source})`;
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

  if (!connectionId) {
    return (
      <div className="text-center py-12 text-[14px] text-fw-bodyLight">
        Select a connection to view logs
      </div>
    );
  }

  const displayColumns = visibleColumns.length === 0
    ? ALL_COLUMNS
    : ALL_COLUMNS.filter(col => isVisible(col.id));

  const renderCellContent = (log: Log, columnId: string) => {
    switch (columnId) {
      case 'logId':
        return <span className="font-medium text-fw-heading">#{log.logId}</span>;
      case 'timestamp':
        return <span>{new Date(log.timestamp).toLocaleString()}</span>;
      case 'type':
        return (
          <div className="flex items-center">
            {getTypeIcon(log.type)}
            <span className={`ml-2 px-2.5 py-0.5 inline-flex text-[12px] font-medium rounded-lg ${getTypeStyles(log.type)}`}>
              {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
            </span>
          </div>
        );
      case 'category':
        return (
          <span className="px-2.5 py-0.5 text-[12px] font-medium bg-fw-neutral text-fw-body rounded-lg">
            {log.category}
          </span>
        );
      case 'message':
        return (
          <div>
            <div className="text-fw-heading">{log.message}</div>
            {log.details && (
              <div className="mt-1 text-[12px] text-fw-bodyLight">{log.details}</div>
            )}
          </div>
        );
      case 'source':
        return <span>{log.source}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-fw-secondary overflow-hidden">
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
            window.addToast?.({
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
                <th
                  key={col.id}
                  scope="col"
                  className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading whitespace-nowrap overflow-hidden text-ellipsis align-middle"
                >
                  {isSortable ? (
                    <button
                      onClick={() => handleSort(col.id as keyof Log)}
                      className="group inline-flex items-center space-x-1"
                    >
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
              <td colSpan={displayColumns.length + 1} className="px-6 py-4 text-center text-[14px] text-fw-bodyLight">
                No logs match the current filters
              </td>
            </tr>
          ) : (
            filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-fw-wash transition-colors">
                {displayColumns.map((col) => (
                  <td
                    key={col.id}
                    className="px-6 py-4 text-[14px] text-fw-body whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {renderCellContent(log, col.id)}
                  </td>
                ))}
                <td className="w-16 px-6 py-4">
                  <div className="flex justify-end">
                    <OverflowMenu items={getOverflowItems(log)} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
