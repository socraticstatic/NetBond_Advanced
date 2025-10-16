import { Edit2, Trash2 } from 'lucide-react';
import { VLAN } from '../modals/VLANModal';
import { OverflowMenu } from '../../common/OverflowMenu';
import { useState } from 'react';
import { EnhancedTable, TableColumn } from '../../common/EnhancedTable';

interface LinkTableProps {
  links: Array<VLAN & { cloudRouterName?: string; cloudRouterId?: string }>;
  sortField: keyof VLAN;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof VLAN) => void;
  onEdit: (link: any) => void;
  onDelete: (link: any) => void;
  searchQuery: string;
  showCloudRouter?: boolean;
}

export function LinkTable({
  links,
  onEdit,
  onDelete,
  searchQuery,
  showCloudRouter = false
}: LinkTableProps) {
  const [activeOverflow, setActiveOverflow] = useState<string | null>(null);

  type LinkType = VLAN & { cloudRouterName?: string; cloudRouterId?: string };

  const baseColumns: TableColumn<LinkType>[] = [
    {
      id: 'vlanId',
      label: 'VLAN ID',
      sortable: true,
      sortKey: 'vlanId',
      width: '90px',
      render: (link) => (
        <div className="text-sm font-medium text-gray-900">{link.vlanId}</div>
      )
    },
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      sortKey: 'name',
      render: (link) => (
        <div className="text-sm font-medium text-gray-900 truncate">{link.name}</div>
      )
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      sortKey: 'status',
      width: '100px',
      render: (link) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          link.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
        </span>
      )
    },
    {
      id: 'bandwidth',
      label: 'Bandwidth',
      sortable: true,
      sortKey: 'bandwidth',
      width: '110px',
      render: (link) => (
        <div className="text-sm font-medium text-gray-900">{link.bandwidth || 'N/A'}</div>
      )
    },
    {
      id: 'ipSubnet',
      label: 'IP Subnet',
      width: '140px',
      render: (link) => (
        <div className="text-sm font-mono text-gray-700 truncate">{link.ipSubnet || 'N/A'}</div>
      )
    },
    {
      id: 'createdAt',
      label: 'Created',
      sortable: true,
      sortKey: 'createdAt',
      width: '100px',
      render: (link) => (
        <div className="text-sm text-gray-500">
          {new Date(link.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
        </div>
      )
    }
  ];

  const cloudRouterColumn: TableColumn<LinkType> = {
    id: 'cloudRouter',
    label: 'Cloud Router',
    sortable: true,
    sortKey: 'cloudRouterId',
    width: '140px',
    render: (link) => (
      <div className="text-sm font-medium text-gray-900 truncate">{link.cloudRouterName || 'N/A'}</div>
    )
  };

  const columns = showCloudRouter
    ? [...baseColumns.slice(0, 3), cloudRouterColumn, ...baseColumns.slice(3)]
    : baseColumns;

  return (
    <EnhancedTable
      data={links}
      columns={columns}
      keyExtractor={(link) => link.id}
      emptyMessage={searchQuery ? 'No links match your search criteria' : 'No links configured for this connection'}
      pageSize={100}
      showPagination={links.length > 100}
      stickyHeader={true}
      rowActions={(link) => (
        <OverflowMenu
          items={[
            {
              id: 'edit',
              label: 'Edit Link',
              icon: <Edit2 className="h-4 w-4" />,
              onClick: () => onEdit(link)
            },
            {
              id: 'delete',
              label: 'Delete Link',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => onDelete(link),
              variant: 'danger'
            }
          ]}
          isOpen={activeOverflow === link.id}
          onOpenChange={(isOpen) => {
            setActiveOverflow(isOpen ? link.id : null);
          }}
        />
      )}
    />
  );
}