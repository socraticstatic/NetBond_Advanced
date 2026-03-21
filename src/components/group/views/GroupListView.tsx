import { useState } from 'react';
import { Activity, Network, Users, Settings, CreditCard, X } from 'lucide-react';
import { Group } from '../../../types/group';
import { BaseTable } from '../../common/BaseTable';
import { OverflowMenu } from '../../common/OverflowMenu';
import { ColumnDefinition } from '../../common/ColumnVisibilityPopover';
import { useColumnVisibility } from '../../../hooks/useColumnVisibility';

const TABLE_ID = 'groups-list';

const ALL_COLUMNS: ColumnDefinition[] = [
  { id: 'name', label: 'Name' },
  { id: 'type', label: 'Type' },
  { id: 'connections', label: 'Connections' },
  { id: 'members', label: 'Members' },
  { id: 'status', label: 'Status' },
  { id: 'billing', label: 'Monthly Cost' },
  { id: 'performance', label: 'Performance' }
];

const SORTABLE_COLUMNS = ['name', 'type', 'connections', 'members', 'status', 'billing'];

interface GroupListViewProps {
  groups: Group[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function GroupListView({ groups, onDelete, onSelect }: GroupListViewProps) {
  const { isVisible } = useColumnVisibility(TABLE_ID);
  const [sortField, setSortField] = useState<keyof Group>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        return 'bg-fw-wash text-fw-heading';
      case 'department':
        return 'bg-fw-neutral text-fw-body';
      case 'project':
        return 'bg-emerald-50 text-emerald-700';
      case 'team':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-fw-neutral text-fw-body';
    }
  };

  const getStatusColor = (status: Group['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-fw-success';
      case 'inactive':
        return 'bg-fw-neutral text-fw-heading';
      case 'suspended':
        return 'bg-red-50 text-fw-error';
      default:
        return 'bg-fw-neutral text-fw-heading';
    }
  };

  // Filter columns based on visibility
  const displayColumns = ALL_COLUMNS.filter(col => isVisible(col.id));

  const renderColumnContent = (group: Group, columnId: string) => {
    switch (columnId) {
      case 'name':
        return (
          <div className="max-w-[200px]">
            <div className="text-figma-base font-medium text-fw-heading truncate">{group.name}</div>
            <div className="text-figma-base text-fw-bodyLight truncate">{group.description}</div>
          </div>
        );
      case 'type':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-figma-sm font-medium ${getGroupTypeColor(group.type)} capitalize`}>
            {group.type}
          </span>
        );
      case 'connections':
        return (
          <div className="flex items-center">
            <Network className="h-4 w-4 text-fw-bodyLight mr-2" />
            <span className="text-figma-base text-fw-heading">{group.connectionIds.length}</span>
          </div>
        );
      case 'members':
        return (
          <div className="flex items-center">
            <Users className="h-4 w-4 text-fw-bodyLight mr-2" />
            <span className="text-figma-base text-fw-heading">{group.userIds.length}</span>
          </div>
        );
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-figma-sm font-medium ${getStatusColor(group.status)} capitalize`}>
            {group.status}
          </span>
        );
      case 'billing':
        return (
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-fw-bodyLight mr-2" />
            <span className="text-figma-base text-fw-heading">
              ${group.billing?.monthlyRate.toFixed(2) || '0.00'}
            </span>
          </div>
        );
      case 'performance':
        return (
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-fw-bodyLight mr-2" />
            <span className="text-figma-base text-fw-heading">
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
      {/* Table */}
      <BaseTable
        columns={displayColumns.map(col => ({
          id: col.id,
          label: col.label,
          sortable: SORTABLE_COLUMNS.includes(col.id),
          render: (group: Group) => renderColumnContent(group, col.id)
        }))}
        data={sortedGroups}
        keyField="id"
        tableId="groups-list"
        showColumnManager={true}
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
            <Users className="h-12 w-12 text-fw-bodyLight mx-auto mb-4" />
            <p className="text-fw-bodyLight">No pools found</p>
          </div>
        }
      />
    </div>
  );
}