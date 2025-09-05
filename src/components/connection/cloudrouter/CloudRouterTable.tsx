import { useState } from 'react';
import { ChevronDown, ChevronUp, Router, Network, Settings, Shield, Edit2, Trash2 } from 'lucide-react';
import { CloudRouter } from '../../../types/cloudrouter';
import { OverflowMenu } from '../../common/OverflowMenu';
import { VNF } from '../../../types/vnf';

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
  const [sortField, setSortField] = useState<keyof CloudRouter>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeOverflow, setActiveOverflow] = useState<string | null>(null);

  const handleSort = (field: keyof CloudRouter) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  // Calculate bandwidth used by each router's links
  const getBandwidthUsedByRouter = (router: CloudRouter): number => {
    if (!router.links || router.links.length === 0) return 0;
    
    return router.links.reduce((total, link) => {
      // Extract numeric value from link bandwidth if available
      if (link.bandwidth) {
        const bandwidthMatch = link.bandwidth.match(/(\d+(\.\d+)?)/);
        if (bandwidthMatch) {
          return total + parseFloat(bandwidthMatch[0]);
        }
      }
      return total;
    }, 0);
  };

  // Sort cloud routers
  const sortedCloudRouters = [...cloudRouters].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle special cases for sorting
    if (sortField === 'links') {
      aValue = a.links?.length || 0;
      bValue = b.links?.length || 0;
    }
    
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                <span>Name</span>
                {sortField === 'name' && (
                  sortDirection === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                    <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                <span>Status</span>
                {sortField === 'status' && (
                  sortDirection === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                    <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div className="flex items-center">
                <span>Available Bandwidth</span>
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('links')}
            >
              <div className="flex items-center">
                <span>Links</span>
                {sortField === 'links' && (
                  sortDirection === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                    <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div className="flex items-center">
                <span>VNF Functions</span>
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Policies
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('createdAt')}
            >
              <div className="flex items-center">
                <span>Created</span>
                {sortField === 'createdAt' && (
                  sortDirection === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                    <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedCloudRouters.map((cloudRouter) => {
            // Count VNFs for this router
            const vnfCount = vnfCountByRouter[cloudRouter.id] || 0;

            // Get VNFs for this router
            const routerVNFs = vnfs.filter(vnf => vnf.cloudRouterId === cloudRouter.id);
            
            // Calculate bandwidth used by this router
            const routerBandwidthUsed = getBandwidthUsedByRouter(cloudRouter);
            
            return (
              <tr key={cloudRouter.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-brand-lightBlue rounded-lg">
                        <Router className="h-5 w-5 text-brand-blue" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{cloudRouter.name}</div>
                      <div className="text-sm text-gray-500">{cloudRouter.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cloudRouter.status === 'active' ? 'bg-green-100 text-green-800' : 
                    cloudRouter.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    cloudRouter.status === 'provisioning' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cloudRouter.status.charAt(0).toUpperCase() + cloudRouter.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span>{availableBandwidth.toFixed(1)} Gbps available</span>
                    <span className="text-xs text-gray-400">Using: {routerBandwidthUsed.toFixed(1)} Gbps</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Network className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{cloudRouter.links?.length || 0} links</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{vnfCount} VNFs</span>
                    {vnfCount > 0 && (
                      <div className="ml-2 flex -space-x-1">
                        {routerVNFs.slice(0, 3).map((vnf, index) => (
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {cloudRouter.policies ? Object.keys(cloudRouter.policies).length : 0} policies
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(cloudRouter.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <OverflowMenu
                    items={[
                      {
                        id: 'edit',
                        label: 'Edit Cloud Router',
                        icon: <Edit2 className="h-4 w-4" />,
                        onClick: () => onEdit(cloudRouter)
                      },
                      {
                        id: 'delete',
                        label: 'Delete Cloud Router',
                        icon: <Trash2 className="h-4 w-4" />,
                        onClick: () => onDelete(cloudRouter),
                        variant: 'danger'
                      }
                    ]}
                    isOpen={activeOverflow === cloudRouter.id}
                    onOpenChange={(isOpen) => {
                      setActiveOverflow(isOpen ? cloudRouter.id : null);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}