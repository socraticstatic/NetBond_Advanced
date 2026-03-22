import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Activity, Network, Globe, Group as GroupIcon, Settings } from 'lucide-react';
import type { Connection } from '../../../types';
import type { Group } from '../../../types/group';
import { ConnectionOverflowMenu } from '../ConnectionOverflowMenu';
import { ColumnVisibilityPopover, ColumnDefinition } from '../../common/ColumnVisibilityPopover';
import { useColumnVisibility } from '../../../hooks/useColumnVisibility';
import { useStore } from '../../../store/useStore';
import { getGroupsForConnection } from '../../../utils/groups';

interface ListViewProps {
  connections: Connection[];
  groups: Group[];
}

const TABLE_ID = 'connections-list';

const ALL_COLUMNS: ColumnDefinition[] = [
  { id: 'name', label: 'Name' },
  { id: 'groups', label: 'Pools' },
  { id: 'type', label: 'Type' },
  { id: 'status', label: 'Status' },
  { id: 'performance', label: 'Performance' },
  { id: 'bandwidth', label: 'Bandwidth' },
  { id: 'location', label: 'Location' },
  { id: 'provider', label: 'Provider' }
];

const SORTABLE_COLUMNS = ['name', 'type', 'status', 'bandwidth', 'location', 'provider'];

export function ListView({ connections, groups }: ListViewProps) {
  const navigate = useNavigate();
  const { visibleColumns, isVisible } = useColumnVisibility(TABLE_ID);
  const [sortField, setSortField] = useState<keyof Connection>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeOverflowMenu, setActiveOverflowMenu] = useState<string | null>(null);
  const [showColumnPopover, setShowColumnPopover] = useState(false);
  const columnButtonRef = useRef<HTMLButtonElement>(null);
  const removeConnection = useStore(state => state.removeConnection);

  const handleSort = (field: keyof Connection) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: string) => {
    removeConnection(id);
    window.addToast({
      type: 'success',
      title: 'Connection Deleted',
      message: 'Connection has been removed successfully',
      duration: 3000
    });
  };

  const sortedConnections = [...connections].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    return aValue < bValue ? -1 * modifier : aValue > bValue ? 1 * modifier : 0;
  });

  const renderColumnHeader = (columnId: string, columnLabel: string) => {
    const isSortable = SORTABLE_COLUMNS.includes(columnId);

    if (!isSortable) {
      return <span>{columnLabel}</span>;
    }

    const isSorted = sortField === columnId;
    const buttonId = `sort-${columnId}`;

    return (
      <button
        id={buttonId}
        onClick={() => handleSort(columnId as keyof Connection)}
        className="group inline-flex items-center space-x-1 text-left"
        aria-sort={isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <span>{columnLabel}</span>
        <span className="flex flex-col">
          <ChevronUp
            className={`h-3 w-3 ${
              isSorted && sortDirection === 'asc'
                ? 'text-fw-body'
                : 'text-fw-bodyLight group-hover:text-fw-bodyLight'
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 -mt-1 ${
              isSorted && sortDirection === 'desc'
                ? 'text-fw-body'
                : 'text-fw-bodyLight group-hover:text-fw-bodyLight'
            }`}
          />
        </span>
      </button>
    );
  };

  const renderColumnContent = (connection: Connection, columnId: string) => {
    switch (columnId) {
      case 'name':
        return (
          <div className="flex items-center">
            {connection.type.toLowerCase().includes('internet') ? (
              <Globe className="h-5 w-5 text-fw-link mr-3" aria-hidden="true" />
            ) : (
              <Network className="h-5 w-5 text-fw-link mr-3" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1">
              <div className="text-figma-base font-medium text-fw-heading truncate">{connection.name}</div>
              <div className="text-figma-base text-fw-bodyLight truncate">{connection.type}</div>
            </div>
          </div>
        );
      case 'groups':
        const connectionGroups = getGroupsForConnection(groups, connection.id);
        return (
          <div className="flex flex-col space-y-1">
            {connectionGroups.length > 0 ? (
              connectionGroups.slice(0, 2).map(group => (
                <div key={group.id} className="flex items-center">
                  <GroupIcon className="h-4 w-4 text-fw-bodyLight mr-1.5 flex-shrink-0" />
                  <span className="text-figma-base text-fw-bodyLight truncate">{group.name}</span>
                </div>
              ))
            ) : (
              <span className="text-figma-base text-fw-bodyLight">No groups</span>
            )}
            {connectionGroups.length > 2 && (
              <span className="text-figma-sm text-fw-bodyLight">
                +{connectionGroups.length - 2} more
              </span>
            )}
          </div>
        );
      case 'type':
        return <span className="text-figma-base text-fw-heading truncate">{connection.type}</span>;
      case 'status':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-figma-sm font-medium ${
              connection.status === 'Active'
                ? 'bg-green-50 text-fw-success'
                : 'bg-fw-secondary text-fw-disabled'
            }`}
            role="status"
          >
            {connection.status === 'Active' ? 'Active' : 'Inactive'}
          </span>
        );
      case 'performance':
        return connection.performance && (
          <div className="flex items-center space-x-4 overflow-hidden">
            <div className="flex items-center" title="Latency">
              <Activity className="h-4 w-4 text-fw-bodyLight mr-1" aria-hidden="true" />
              <span className="text-figma-base text-fw-heading">{connection.performance.latency}</span>
            </div>
            <div className="flex items-center" title="Packet Loss">
              <Network className="h-4 w-4 text-fw-bodyLight mr-1" aria-hidden="true" />
              <span className="text-figma-base text-fw-heading">{connection.performance.packetLoss}</span>
            </div>
          </div>
        );
      case 'bandwidth':
        return <span className="text-figma-base text-fw-heading truncate">{connection.bandwidth}</span>;
      case 'location':
        return <span className="text-figma-base text-fw-heading truncate">{connection.location}</span>;
      case 'provider':
        return <span className="text-figma-base text-fw-heading truncate">{connection.provider || 'N/A'}</span>;
      default:
        return null;
    }
  };

  // Filter columns based on visibility
  const displayColumns = ALL_COLUMNS.filter(col => isVisible(col.id));

  return (
    <div className="overflow-hidden">
      <table className="w-full table-fixed divide-y divide-fw-secondary">
        <caption className="sr-only">
          List of network connections showing details like name, type, status, performance metrics,
          bandwidth, location, and provider. Click column headers to sort, and use row actions for management.
        </caption>
        <thead className="bg-fw-wash">
          <tr>
            {displayColumns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading whitespace-nowrap overflow-hidden text-ellipsis"
                role="columnheader"
                aria-sort={sortField === column.id ? sortDirection : 'none'}
              >
                {renderColumnHeader(column.id, column.label)}
              </th>
            ))}
            <th
              scope="col"
              className="relative px-6 h-12 w-16"
              role="columnheader"
            >
              <div className="flex justify-end">
                <button
                  ref={columnButtonRef}
                  onClick={() => setShowColumnPopover(true)}
                  className="p-2 text-fw-bodyLight hover:text-fw-bodyLight rounded-full hover:bg-fw-neutral transition-colors"
                  title="Manage Columns"
                  aria-label="Manage table columns"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">{visibleColumns.length}/{ALL_COLUMNS.length} visible</span>
                </button>
                {showColumnPopover && (
                  <ColumnVisibilityPopover
                    tableId={TABLE_ID}
                    allColumns={ALL_COLUMNS}
                    onClose={() => setShowColumnPopover(false)}
                    anchorEl={columnButtonRef.current}
                  />
                )}
              </div>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-fw-base divide-y divide-fw-secondary">
          {sortedConnections.length === 0 ? (
            <tr>
              <td
                colSpan={displayColumns.length + 1}
                className="px-6 py-4 text-center text-figma-base text-fw-bodyLight"
              >
                No connections found
              </td>
            </tr>
          ) : (
            sortedConnections.map((connection, rowIndex) => (
              <tr
                key={connection.id}
                onClick={() => navigate(`/connections/${connection.id}`)}
                className="hover:bg-fw-wash transition-colors cursor-pointer"
                role="row"
                aria-rowindex={rowIndex + 1}
              >
                {displayColumns.map((column) => (
                  <td
                    key={column.id}
                    className="px-6 py-4 text-[14px] text-fw-body whitespace-nowrap overflow-hidden text-ellipsis"
                    role="gridcell"
                  >
                    {renderColumnContent(connection, column.id)}
                  </td>
                ))}
                <td 
                  className="px-6 py-4 whitespace-nowrap text-right text-figma-base font-medium w-16"
                  role="gridcell"
                >
                  <div 
                    onClick={e => e.stopPropagation()}
                    className="inline-block"
                  >
                    <ConnectionOverflowMenu
                      connection={connection}
                      onDelete={() => handleDelete(connection.id.toString())}
                      isActive={activeOverflowMenu === connection.id.toString()}
                      onOpenChange={(isOpen) => {
                        if (!showColumnPopover) {
                          setActiveOverflowMenu(isOpen ? connection.id.toString() : null);
                        }
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}