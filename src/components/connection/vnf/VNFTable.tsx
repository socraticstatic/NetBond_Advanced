import { useState } from 'react';
import { Router as RouterIcon, Network, Settings, Shield, Globe, Edit2, Trash2, Eye } from 'lucide-react';
import { VNF } from '../../../types/vnf';
import { OverflowMenu } from '../../common/OverflowMenu';
import { CloudRouter } from '../../../types/cloudrouter';
import { EnhancedTable, TableColumn } from '../../common/EnhancedTable';

interface VNFTableProps {
  vnfs: VNF[];
  cloudRouters: CloudRouter[];
  onEdit: (vnf: VNF) => void;
  onDelete: (vnf: VNF) => void;
}

export function VNFTable({
  vnfs,
  cloudRouters,
  onEdit,
  onDelete
}: VNFTableProps) {
  const [activeOverflow, setActiveOverflow] = useState<string | null>(null);

  // Get icon based on VNF type
  const getTypeIcon = (type: VNF['type']) => {
    switch(type) {
      case 'firewall':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'sdwan':
        return <Globe className="h-5 w-5 text-purple-500" />;
      case 'router':
        return <RouterIcon className="h-5 w-5 text-blue-500" />;
      case 'vnat':
        return <Network className="h-5 w-5 text-green-500" />;
      case 'custom':
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get formatted type name
  const getTypeName = (type: VNF['type']) => {
    switch(type) {
      case 'firewall':
        return 'Firewall';
      case 'sdwan':
        return 'SD-WAN';
      case 'router':
        return 'Router';
      case 'vnat':
        return 'NAT';
      case 'custom':
        return 'Custom';
      default:
        return type.toUpperCase();
    }
  };

  // Get status color
  const getStatusColor = (status: VNF['status']) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'provisioning':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCloudRouterName = (cloudRouterId?: string) => {
    if (!cloudRouterId) return 'Not assigned';
    const router = cloudRouters.find(cr => cr.id === cloudRouterId);
    return router ? router.name : 'Unknown';
  };

  const columns: TableColumn<VNF>[] = [
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      sortKey: 'name',
      render: (vnf) => (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-2 rounded-lg ${
              vnf.type === 'firewall' ? 'bg-red-100' :
              vnf.type === 'sdwan' ? 'bg-purple-100' :
              vnf.type === 'router' ? 'bg-blue-100' :
              vnf.type === 'vnat' ? 'bg-green-100' :
              'bg-gray-100'
            }`}>
              {getTypeIcon(vnf.type)}
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{vnf.name}</div>
            <div className="text-xs text-gray-500">{vnf.description}</div>
          </div>
        </div>
      )
    },
    {
      id: 'type',
      label: 'Type',
      sortable: true,
      sortKey: 'type',
      width: '12%',
      render: (vnf) => (
        <span className="text-sm text-gray-900 truncate block">{getTypeName(vnf.type)}</span>
      )
    },
    {
      id: 'vendor',
      label: 'Vendor',
      sortable: true,
      sortKey: 'vendor',
      width: '12%',
      render: (vnf) => (
        <div className="text-sm text-gray-900 truncate">{vnf.vendor}</div>
      )
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      sortKey: 'status',
      width: '10%',
      render: (vnf) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vnf.status)}`}>
          {vnf.status.charAt(0).toUpperCase() + vnf.status.slice(1)}
        </span>
      )
    },
    {
      id: 'cloudRouter',
      label: 'Cloud Router',
      sortable: true,
      sortKey: 'cloudRouterId',
      width: '15%',
      render: (vnf) => (
        <span className="text-sm text-gray-900 truncate block">{getCloudRouterName(vnf.cloudRouterId)}</span>
      )
    },
    {
      id: 'throughput',
      label: 'Throughput',
      sortable: true,
      sortKey: 'throughput',
      width: '11%',
      render: (vnf) => (
        <span className="text-sm text-gray-500 truncate block">{vnf.throughput || 'N/A'}</span>
      )
    },
    {
      id: 'licenseExpiry',
      label: 'License',
      sortable: true,
      sortKey: 'licenseExpiry',
      width: '10%',
      render: (vnf) => (
        <span className="text-sm text-gray-500">
          {vnf.licenseExpiry ? new Date(vnf.licenseExpiry).toLocaleDateString() : 'N/A'}
        </span>
      )
    }
  ];

  return (
    <EnhancedTable
      data={vnfs}
      columns={columns}
      keyExtractor={(vnf) => vnf.id}
      emptyMessage="No network functions configured"
      pageSize={50}
      showPagination={vnfs.length > 50}
      stickyHeader={true}
      rowActions={(vnf) => (
        <OverflowMenu
          items={[
            {
              id: 'view',
              label: 'View Details',
              icon: <Eye className="h-4 w-4" />,
              onClick: () => onEdit(vnf)
            },
            {
              id: 'edit',
              label: 'Edit Function',
              icon: <Edit2 className="h-4 w-4" />,
              onClick: () => onEdit(vnf)
            },
            {
              id: 'delete',
              label: 'Delete Function',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => onDelete(vnf),
              variant: 'danger'
            }
          ]}
          isOpen={activeOverflow === vnf.id}
          onOpenChange={(isOpen) => {
            setActiveOverflow(isOpen ? vnf.id : null);
          }}
        />
      )}
    />
  );
}