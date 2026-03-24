import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2 as RouterIcon, Network, Settings, Shield, Globe, CreditCard as Edit2, Trash2, Eye, ExternalLink, Scale, AlertTriangle, Zap, MapPin, Gauge } from 'lucide-react';
import { VNF } from '../../../types/vnf';
import { OverflowMenu } from '../../common/OverflowMenu';
import { CloudRouter } from '../../../types/cloudrouter';
import { EnhancedTable, TableColumn } from '../../common/EnhancedTable';
import { getVNFTypeIcon, getVNFTypeInfo } from '../../../utils/vnfTypes';

interface VNFTableProps {
  vnfs: VNF[];
  cloudRouters: CloudRouter[];
  onEdit: (vnf: VNF) => void;
  onDelete: (vnf: VNF) => void;
  connectionId?: string;
  onDetach?: () => void;
  isDetached?: boolean;
  toolbar?: React.ReactNode;
}

export function VNFTable({
  vnfs,
  cloudRouters,
  onEdit,
  onDelete,
  connectionId,
  onDetach,
  isDetached = false,
  toolbar
}: VNFTableProps) {
  const navigate = useNavigate();
  const [activeOverflow, setActiveOverflow] = useState<string | null>(null);

  const getTypeIcon = (type: VNF['type']) => {
    const Icon = getVNFTypeIcon(type);
    const info = getVNFTypeInfo(type);
    const colorMap: Record<string, string> = {
      red: 'text-fw-error',
      purple: 'text-fw-purple',
      blue: 'text-fw-link',
      green: 'text-fw-success',
      indigo: 'text-fw-link',
      orange: 'text-fw-warn',
      yellow: 'text-fw-warn',
      gray: 'text-fw-bodyLight'
    };
    const colorClass = colorMap[info.color] || 'text-fw-bodyLight';
    return <Icon className={`h-5 w-5 ${colorClass}`} />;
  };

  const getTypeName = (type: VNF['type']) => {
    return getVNFTypeInfo(type).label;
  };

  // Get status color
  const getStatusColor = (status: VNF['status']) => {
    switch(status) {
      case 'active':
        return 'bg-green-50 text-fw-success';
      case 'inactive':
        return 'bg-fw-neutral text-fw-heading';
      case 'provisioning':
        return 'bg-fw-accent text-fw-linkHover';
      case 'error':
        return 'bg-red-50 text-fw-error';
      default:
        return 'bg-fw-neutral text-fw-heading';
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
              vnf.type === 'firewall' ? 'bg-red-50' :
              vnf.type === 'sdwan' ? 'bg-fw-neutral' :
              vnf.type === 'router' ? 'bg-fw-accent' :
              vnf.type === 'vnat' ? 'bg-green-50' :
              'bg-fw-neutral'
            }`}>
              {getTypeIcon(vnf.type)}
            </div>
          </div>
          <div className="ml-3">
            <button
              onClick={() => navigate(`/vnfs/${vnf.id}`)}
              className="text-figma-base font-medium text-fw-link hover:text-fw-linkHover hover:underline text-left"
            >
              {vnf.name}
            </button>
            <div className="text-figma-sm text-fw-bodyLight">{vnf.description}</div>
          </div>
        </div>
      ),
      csvRender: (vnf) => vnf.name
    },
    {
      id: 'type',
      label: 'Type',
      sortable: true,
      sortKey: 'type',
      render: (vnf) => (
        <span className="text-figma-base text-fw-heading truncate block">{getTypeName(vnf.type)}</span>
      ),
      csvRender: (vnf) => getTypeName(vnf.type)
    },
    {
      id: 'vendor',
      label: 'Vendor',
      sortable: true,
      sortKey: 'vendor',
      render: (vnf) => (
        <span className="text-figma-base text-fw-heading">{vnf.vendor || 'N/A'}</span>
      ),
      csvRender: (vnf) => vnf.vendor || 'N/A'
    },
    {
      id: 'model',
      label: 'Model',
      sortable: true,
      sortKey: 'model',
      render: (vnf) => (
        <span className="text-figma-base text-fw-body">{vnf.model || 'N/A'}</span>
      ),
      csvRender: (vnf) => vnf.model || 'N/A'
    },
    {
      id: 'version',
      label: 'Version',
      sortable: true,
      sortKey: 'version',
      render: (vnf) => (
        <span className="text-figma-base text-fw-body">{vnf.version || 'N/A'}</span>
      ),
      csvRender: (vnf) => vnf.version || 'N/A'
    },
    {
      id: 'throughput',
      label: 'Throughput',
      sortable: true,
      sortKey: 'throughput',
      render: (vnf) => (
        <span className="text-figma-base text-fw-body">{vnf.throughput || 'N/A'}</span>
      ),
      csvRender: (vnf) => vnf.throughput || 'N/A'
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      sortKey: 'status',
      render: (vnf) => (
        <span className={`px-2 py-1 inline-flex text-figma-sm leading-5 font-semibold rounded-lg ${getStatusColor(vnf.status)}`}>
          {vnf.status.charAt(0).toUpperCase() + vnf.status.slice(1)}
        </span>
      ),
      csvRender: (vnf) => vnf.status.charAt(0).toUpperCase() + vnf.status.slice(1)
    },
    {
      id: 'cloudRouter',
      label: 'Cloud Router',
      sortable: false,
      render: (vnf) => (
        <span className="text-figma-base text-fw-body">{getCloudRouterName(vnf.cloudRouterId)}</span>
      ),
      csvRender: (vnf) => getCloudRouterName(vnf.cloudRouterId)
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
      showExport={false}
      tableId="vnf"
      showColumnManager={true}
      toolbar={toolbar}
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