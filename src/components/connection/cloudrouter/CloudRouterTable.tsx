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
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-2 bg-brand-lightBlue rounded-lg">
              <Router className="h-5 w-5 text-brand-blue" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{router.name}</div>
            <div className="text-sm text-gray-500">{router.description}</div>
          </div>
        </div>
      )
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      sortKey: 'status',
      width: '120px',
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
      id: 'bandwidth',
      label: 'Available Bandwidth',
      width: '180px',
      render: (router) => {
        const routerBandwidthUsed = getBandwidthUsedByRouter(router);
        return (
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">{availableBandwidth.toFixed(1)} Gbps available</span>
            <span className="text-xs text-gray-400">Using: {routerBandwidthUsed.toFixed(1)} Gbps</span>
          </div>
        );
      }
    },
    {
      id: 'links',
      label: 'Links',
      sortable: true,
      sortKey: 'links',
      width: '120px',
      render: (router) => (
        <div className="flex items-center">
          <Network className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{router.links?.length || 0} links</span>
        </div>
      )
    },
    {
      id: 'vnfs',
      label: 'VNF Functions',
      width: '180px',
      render: (router) => {
        const vnfCount = vnfCountByRouter[router.id] || 0;
        const routerVNFs = vnfs.filter(vnf => vnf.cloudRouterId === router.id);
        return (
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">{vnfCount} VNFs</span>
            {vnfCount > 0 && (
              <div className="ml-2 flex -space-x-1">
                {routerVNFs.slice(0, 3).map((vnf) => (
                  <div
                    key={vnf.id}
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      vnf.type === 'firewall' ? 'bg-red-100' :
                      vnf.type === 'sdwan' ? 'bg-purple-100' :
                      vnf.type === 'router' ? 'bg-blue-100' :
                      vnf.type === 'vnat' ? 'bg-green-100' :
                      'bg-gray-100'
                    }`}
                    title={`${vnf.name} (${vnf.type})`}
                  >
                    <span className="text-xs font-bold">{vnf.name.charAt(0).toUpperCase()}</span>
                  </div>
                ))}
                {vnfCount > 3 && (
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                    +{vnfCount - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'policies',
      label: 'Policies',
      width: '120px',
      render: (router) => (
        <div className="flex items-center">
          <Settings className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">
            {router.policies ? Object.keys(router.policies).length : 0} policies
          </span>
        </div>
      )
    },
    {
      id: 'createdAt',
      label: 'Created',
      sortable: true,
      sortKey: 'createdAt',
      width: '120px',
      render: (router) => (
        <span className="text-sm text-gray-500">
          {new Date(router.createdAt).toLocaleDateString()}
        </span>
      )
    }
  ];

  return (
    <div className="overflow-x-auto">
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
    </div>
  );
}