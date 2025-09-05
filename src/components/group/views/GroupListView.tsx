import { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, Network, Users, Settings, CreditCard, MoreVertical, X, SlidersHorizontal } from 'lucide-react';
import { Group } from '../../../types/group';
import { BaseTable } from '../../common/BaseTable';
import { OverflowMenu } from '../../common/OverflowMenu';

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  width?: string;
}

interface GroupListViewProps {
  groups: Group[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function GroupListView({ groups, onDelete, onSelect }: GroupListViewProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'name', label: 'Name', visible: true, sortable: true, width: '30%' },
    { id: 'type', label: 'Type', visible: true, sortable: true, width: '15%' },
    { id: 'connections', label: 'Connections', visible: true, sortable: true, width: '15%' },
    { id: 'members', label: 'Members', visible: true, sortable: true, width: '15%' },
    { id: 'status', label: 'Status', visible: true, sortable: true, width: '15%' },
    { id: 'billing', label: 'Monthly Cost', visible: false, sortable: true, width: '15%' },
    { id: 'performance', label: 'Performance', visible: false, sortable: false, width: '15%' }
  ]);
  
  const [sortField, setSortField] = useState<keyof Group>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const handleSort = (field: keyof Group) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedGroups = [...groups].sort((a, b) => {
    let aValue, bValue;
    
    // Special handling for connection and member counts
    if (sortField === 'connections') {
      aValue = a.connectionIds.length;
      bValue = b.connectionIds.length;
    } else if (sortField === 'members') {
      aValue = a.userIds.length;
      bValue = b.userIds.length;
    } else if (sortField === 'billing') {
      aValue = a.billing?.monthlyRate || 0;
      bValue = b.billing?.monthlyRate || 0;
    } else {
      aValue = a[sortField as keyof Group];
      bValue = b[sortField as keyof Group];
    }
    
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    return aValue < bValue ? -1 * modifier : aValue > bValue ? 1 * modifier : 0;
  });

  // Get group type color
  const getGroupTypeColor = (type: Group['type']) => {
    switch (type) {
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'department':
        return 'bg-purple-100 text-purple-800';
      case 'project':
        return 'bg-green-100 text-green-800';
      case 'team':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Group['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleColumnToggle = (columnId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  // Only show visible columns
  const visibleColumns = columns.filter(col => col.visible);

  const renderColumnContent = (group: Group, columnId: string) => {
    switch (columnId) {
      case 'name':
        return (
          <div className="max-w-[200px]">
            <div className="text-sm font-medium text-gray-900 truncate">{group.name}</div>
            <div className="text-sm text-gray-500 truncate">{group.description}</div>
          </div>
        );
      case 'type':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGroupTypeColor(group.type)} capitalize`}>
            {group.type}
          </span>
        );
      case 'connections':
        return (
          <div className="flex items-center">
            <Network className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">{group.connectionIds.length}</span>
          </div>
        );
      case 'members':
        return (
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">{group.userIds.length}</span>
          </div>
        );
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(group.status)} capitalize`}>
            {group.status}
          </span>
        );
      case 'billing':
        return (
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">
              ${group.billing?.monthlyRate.toFixed(2) || '0.00'}
            </span>
          </div>
        );
      case 'performance':
        return (
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">
              {group.performance?.aggregatedMetrics.averageUptime || 'N/A'}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Column Selector */}
      <div className="absolute top-0 right-0 z-10 mb-2">
        <button
          onClick={() => setShowColumnSelector(!showColumnSelector)}
          className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
          title="Customize Columns"
          aria-label="Customize table columns"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>

        {showColumnSelector && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Customize Columns</h3>
            </div>

            <div className="p-3">
              <div className="space-y-2">
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={column.visible}
                        onChange={() => handleColumnToggle(column.id)}
                        className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                      />
                      <span className="ml-2 text-sm text-gray-700">{column.label}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Toggle visibility using checkboxes.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <BaseTable
        columns={visibleColumns.map(col => ({
          id: col.id,
          label: col.label,
          sortable: !!col.sortable,
          width: col.width,
          render: (group: Group) => renderColumnContent(group, col.id)
        }))}
        data={sortedGroups}
        keyField="id"
        sortField={sortField as string}
        sortDirection={sortDirection}
        onSort={(field) => handleSort(field as keyof Group)}
        onRowClick={(group) => onSelect(group.id)}
        actions={(group) => (
          <OverflowMenu
            items={[
              {
                id: 'view',
                label: 'View Details',
                icon: <Users className="h-4 w-4" />,
                onClick: () => onSelect(group.id)
              },
              {
                id: 'edit',
                label: 'Edit Pool',
                icon: <Settings className="h-4 w-4" />,
                onClick: () => onSelect(group.id)
              },
              {
                id: 'delete',
                label: 'Delete Pool',
                icon: <X className="h-4 w-4" />,
                onClick: () => onDelete(group.id),
                variant: 'danger'
              }
            ]}
          />
        )}
        emptyState={
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No pools found</p>
          </div>
        }
      />
    </div>
  );
}