import { useState } from 'react';
import { Router, Network, Settings, Shield, Edit2, Trash2 } from 'lucide-react';
import { CloudRouter } from '../../../types/cloudrouter';
import { OverflowMenu } from '../../common/OverflowMenu';
import { VNF } from '../../../types/vnf';
import { EnhancedTable, TableColumn } from '../../common/EnhancedTable';

interface CloudRouterTableProps {
  cloudRouters: CloudRouter[];
  vnfs?: VNF[]; // VNFs to display with cloud routers
  onEdit: (cloudRouter: CloudRouter) => void;
  onDelete: (cloudRouter: CloudRouter) => void;
  connectionBandwidth?: string; // Total connection bandwidth
  usedBandwidth?: number; // Total used bandwidth across all routers
}

export function CloudRouterTable({
  cloudRouters,
  vnfs = [],
  onEdit,
  onDelete,
  connectionBandwidth = '10 Gbps',
  usedBandwidth = 0
}: CloudRouterTableProps) {
  const [activeOverflow, setActiveOverflow] = useState<string | null>(null);

  // Count VNFs by cloud router
  const vnfCountByRouter = vnfs.reduce((counts, vnf) => {
    if (vnf.cloudRouterId) {
      counts[vnf.cloudRouterId] = (counts[vnf.cloudRouterId] || 0) + 1;
    }
    return counts;
  }, {} as Record<string, number>);

  // Calculate total bandwidth and available bandwidth
  const totalBandwidth = parseFloat(connectionBandwidth.replace(/[^\d.]/g, ''));
  const availableBandwidth = Math.max(0, totalBandwidth - usedBandwidth);

  const getBandwidthUsedByRouter = (router: CloudRouter): number => {
    if (!router.links || router.links.length === 0) return 0;

    return router.links.reduce((total, link) => {
      if (link.bandwidth) {
        const bandwidthMatch = link.bandwidth.match(/(\d+(\.\d+)?)/);
        if (bandwidthMatch) {
          return total + parseFloat(bandwidthMatch[0]);
        }
      }
      return total;
    }, 0);
  };

  const columns: TableColumn<CloudRouter>[] = [
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      sortKey: 'name',
      render: (router) => (
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0">
            <div className="p-2 bg-brand-lightBlue rounded-lg">
              <Router className="h-4 w-4 text-brand-blue" />
            </div>
          </div>
          <div className="ml-3 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{router.name}</div>
            <div className="text-xs text-gray-500 truncate">{router.description}</div>
          </div>
        </div>
      )
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      sortKey: 'status',
      width: '100px',
      render: (router) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          router.status === 'active' ? 'bg-green-100 text-green-800' :
          router.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
          router.status === 'provisioning' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {router.status.charAt(0).toUpperCase() + router.status.slice(1)}
        </span>
      )
    },
    {
      id: 'links',
      label: 'Links',
      sortable: true,
      sortKey: 'links',
      width: '80px',
      render: (router) => (
        <div className="flex items-center">
          <Network className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-900">{router.links?.length || 0}</span>
        </div>
      )
    },
    {
      id: 'vnfs',
      label: 'VNFs',
      width: '80px',
      render: (router) => {
        const vnfCount = vnfCountByRouter[router.id] || 0;
        return (
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-900">{vnfCount}</span>
          </div>
        );
      }
    },
    {
      id: 'bandwidth',
      label: 'Bandwidth',
      width: '120px',
      render: (router) => {
        const routerBandwidthUsed = getBandwidthUsedByRouter(router);
        return (
          <div className="text-sm text-gray-900">{routerBandwidthUsed.toFixed(1)} Gbps</div>
        );
      }
    },
    {
      id: 'createdAt',
      label: 'Created',
      sortable: true,
      sortKey: 'createdAt',
      width: '100px',
      render: (router) => (
        <span className="text-sm text-gray-500">
          {new Date(router.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
        </span>
      )
    }
  ];

  return (
    <EnhancedTable
        data={cloudRouters}
        columns={columns}
        keyExtractor={(router) => router.id}
        emptyMessage="No cloud routers configured"
        pageSize={50}
        showPagination={cloudRouters.length > 50}
        stickyHeader={true}
        rowActions={(router) => (
          <OverflowMenu
            items={[
              {
                id: 'edit',
                label: 'Edit Cloud Router',
                icon: <Edit2 className="h-4 w-4" />,
                onClick: () => onEdit(router)
              },
              {
                id: 'delete',
                label: 'Delete Cloud Router',
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => onDelete(router),
                variant: 'danger'
              }
            ]}
            isOpen={activeOverflow === router.id}
            onOpenChange={(isOpen) => {
              setActiveOverflow(isOpen ? router.id : null);
            }}
          />
        )}
      />
  );
}