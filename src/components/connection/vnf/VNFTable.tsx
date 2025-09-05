import { useState } from 'react';
import { ChevronDown, ChevronUp, Router as RouterIcon, Network, Settings, Shield, Globe, Activity, CheckCircle, XCircle, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { VNF } from '../../../types/vnf';
import { OverflowMenu } from '../../common/OverflowMenu';
import { CloudRouter } from '../../../types/cloudrouter';

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
  const [sortField, setSortField] = useState<keyof VNF>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof VNF) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
        return 'Virtual NAT';
      case 'custom':
        return 'Custom VNF';
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

  // Get cloud router name
  const getCloudRouterName = (cloudRouterId?: string) => {
    if (!cloudRouterId) return 'Not assigned';
    const router = cloudRouters.find(cr => cr.id === cloudRouterId);
    return router ? router.name : 'Unknown';
  };

  // Sort VNFs
  const sortedVNFs = [...vnfs].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Special case for cloud router
    if (sortField === 'cloudRouterId') {
      aValue = getCloudRouterName(a.cloudRouterId);
      bValue = getCloudRouterName(b.cloudRouterId);
    }
    
    // Handle undefined values
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (vnfs.length === 0) {
    return (
      <div className="text-center py-12">
        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Virtual Network Functions</h3>
        <p className="text-gray-500">Add virtual network functions to enhance your network capabilities</p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th 
            scope="col" 
            className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
            className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('type')}
          >
            <div className="flex items-center">
              <span>Type</span>
              {sortField === 'type' && (
                sortDirection === 'asc' ? 
                  <ChevronUp className="h-4 w-4 ml-1" /> : 
                  <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </div>
          </th>
          <th 
            scope="col" 
            className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('vendor')}
          >
            <div className="flex items-center">
              <span>Vendor/Model</span>
              {sortField === 'vendor' && (
                sortDirection === 'asc' ? 
                  <ChevronUp className="h-4 w-4 ml-1" /> : 
                  <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </div>
          </th>
          <th 
            scope="col" 
            className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
            className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('cloudRouterId')}
          >
            <div className="flex items-center">
              <span>Cloud Router</span>
              {sortField === 'cloudRouterId' && (
                sortDirection === 'asc' ? 
                  <ChevronUp className="h-4 w-4 ml-1" /> : 
                  <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </div>
          </th>
          <th 
            scope="col" 
            className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('throughput')}
          >
            <div className="flex items-center">
              <span>Throughput</span>
              {sortField === 'throughput' && (
                sortDirection === 'asc' ? 
                  <ChevronUp className="h-4 w-4 ml-1" /> : 
                  <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </div>
          </th>
          <th 
            scope="col" 
            className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('licenseExpiry')}
          >
            <div className="flex items-center">
              <span>License Expiry</span>
              {sortField === 'licenseExpiry' && (
                sortDirection === 'asc' ? 
                  <ChevronUp className="h-4 w-4 ml-1" /> : 
                  <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </div>
          </th>
          <th scope="col" className="relative px-3 sm:px-4 py-3">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sortedVNFs.map((vnf) => (
          <tr key={vnf.id} className="hover:bg-gray-50">
            <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
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
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{vnf.name}</div>
                  <div className="text-sm text-gray-500">{vnf.description}</div>
                </div>
              </div>
            </td>
            <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {getTypeIcon(vnf.type)}
                <span className="ml-2 text-sm text-gray-900">{getTypeName(vnf.type)}</span>
              </div>
            </td>
            <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{vnf.vendor}</div>
              <div className="text-xs text-gray-500">{vnf.model} {vnf.version && `v${vnf.version}`}</div>
            </td>
            <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vnf.status)}`}>
                {vnf.status.charAt(0).toUpperCase() + vnf.status.slice(1)}
              </span>
            </td>
            <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <RouterIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">{getCloudRouterName(vnf.cloudRouterId)}</span>
              </div>
            </td>
            <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              {vnf.throughput || 'N/A'}
            </td>
            <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              {vnf.licenseExpiry ? new Date(vnf.licenseExpiry).toLocaleDateString() : 'N/A'}
            </td>
            <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <OverflowMenu
                items={[
                  {
                    id: 'edit',
                    label: 'Edit VNF',
                    icon: <Edit2 className="h-4 w-4" />,
                    onClick: () => onEdit(vnf)
                  },
                  {
                    id: 'delete',
                    label: 'Delete VNF',
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}