import { ChevronDown, ChevronUp, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { VLAN } from '../modals/VLANModal';
import { OverflowMenu } from '../../common/OverflowMenu';
import { useState } from 'react';

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
  sortField, 
  sortDirection, 
  onSort, 
  onEdit, 
  onDelete,
  searchQuery,
  showCloudRouter = false
}: LinkTableProps) {
  const [activeOverflow, setActiveOverflow] = useState<string | null>(null);

  // Column definitions for the Link table
  const baseColumns = [
    {
      id: 'vlanId',
      label: 'Link ID',
      sortable: true,
      sortKey: 'vlanId' as keyof VLAN,
      render: (link: any) => (
        <div className="text-sm font-medium text-gray-900">{link.vlanId}</div>
      )
    },
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      sortKey: 'name' as keyof VLAN,
      render: (link: any) => (
        <div className="text-sm font-medium text-gray-900">{link.name}</div>
      )
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      sortKey: 'status' as keyof VLAN,
      render: (link: any) => (
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
      sortKey: 'bandwidth' as keyof VLAN,
      render: (link: any) => (
        <div className="text-sm font-medium text-gray-900">{link.bandwidth || 'Not specified'}</div>
      )
    },
    {
      id: 'ipSubnet',
      label: 'IP Subnet',
      render: (link: any) => (
        <div className="text-sm font-mono text-gray-700">{link.ipSubnet || 'Not configured'}</div>
      )
    },
    {
      id: 'createdAt',
      label: 'Created',
      sortable: true,
      sortKey: 'createdAt' as keyof VLAN,
      render: (link: any) => (
        <div className="text-sm text-gray-500">
          {new Date(link.createdAt).toLocaleDateString()}
        </div>
      )
    }
  ];

  // Add cloud router column if showing cloud router
  const cloudRouterColumn = {
    id: 'cloudRouter',
    label: 'Cloud Router',
    sortable: true,
    sortKey: 'cloudRouterId' as keyof VLAN,
    render: (link: any) => (
      <div className="text-sm font-medium text-gray-900">{link.cloudRouterName || 'N/A'}</div>
    )
  };

  // Combine columns based on whether to show cloud router
  const columns = showCloudRouter 
    ? [...baseColumns.slice(0, 3), cloudRouterColumn, ...baseColumns.slice(3)]
    : baseColumns;

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th 
              key={column.id}
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              onClick={() => column.sortable && onSort(column.sortKey)}
              style={column.width ? { width: column.width } : undefined}
            >
              <div className="flex items-center">
                {column.label}
                {column.sortable && (
                  <span className="ml-1">
                    {sortField === column.sortKey ? (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </th>
          ))}
          <th scope="col" className="relative px-6 py-3">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {links.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
              {searchQuery ? 'No links match your search criteria' : 'No links configured for this connection'}
            </td>
          </tr>
        ) : (
          links.map((link) => (
            <tr key={link.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                  {column.render(link)}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}