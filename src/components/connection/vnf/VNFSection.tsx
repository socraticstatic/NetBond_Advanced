import { useState } from 'react';
import { Plus, Filter, Download, Shield, Settings, Network, Router as RouterIcon, Globe, Info } from 'lucide-react';
import { Button } from '../../common/Button';
import { VNF, VNFType } from '../../../types/vnf';
import { VNFCard } from './VNFCard';
import { VNFTable } from './VNFTable';
import { CloudRouter } from '../../../types/cloudrouter';

interface VNFSectionProps {
  vnfs: VNF[];
  cloudRouters: CloudRouter[];
  onAdd: () => void;
  onEdit: (vnf: VNF) => void;
  onDelete: (vnf: VNF) => void;
  connectionId: string;
}

export function VNFSection({ 
  vnfs, 
  cloudRouters,
  onAdd, 
  onEdit, 
  onDelete,
  connectionId 
}: VNFSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [vnfTypeFilter, setVnfTypeFilter] = useState<VNFType | 'all'>('all');
  const [cloudRouterFilter, setCloudRouterFilter] = useState<string>('all');
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  // Filter VNFs by type and cloud router
  const filteredVNFs = vnfs.filter(vnf => {
    const matchesType = vnfTypeFilter === 'all' || vnf.type === vnfTypeFilter;
    const matchesRouter = cloudRouterFilter === 'all' || vnf.cloudRouterId === cloudRouterFilter;
    return matchesType && matchesRouter;
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Shield className="h-5 w-5 text-brand-blue mr-2" />
          Virtual Network Functions (VNFs)
          <div className="relative ml-2 group">
            <Info 
              className="h-4 w-4 text-gray-400 cursor-help" 
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
            />
            {showInfoTooltip && (
              <div className="absolute z-10 left-0 top-full mt-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                <p>
                  <strong>VNF</strong> is a Virtual Network Function, which is a software implementation of a network function traditionally performed by dedicated hardware. VNFs include virtual firewalls, routers, load balancers, and other network services that run on standard servers rather than specialized hardware.
                </p>
              </div>
            )}
          </div>
        </h3>
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Table view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Filter}
            className="text-gray-600"
          >
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            className="text-gray-600"
            onClick={() => {
              window.addToast({
                type: 'success',
                title: 'Export Complete',
                message: 'VNF data has been exported',
                duration: 3000
              });
            }}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onAdd}
          >
            Add VNF
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {/* VNF Type Filters */}
          <div className="flex flex-wrap gap-2 mr-6">
            <button
              onClick={() => setVnfTypeFilter('all')}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                vnfTypeFilter === 'all'
                  ? 'bg-brand-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Shield className="h-4 w-4 mr-1.5" />
              All VNFs
            </button>
            <button
              onClick={() => setVnfTypeFilter('firewall')}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                vnfTypeFilter === 'firewall'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Shield className="h-4 w-4 mr-1.5" />
              Firewall
            </button>
            <button
              onClick={() => setVnfTypeFilter('sdwan')}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                vnfTypeFilter === 'sdwan'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Globe className="h-4 w-4 mr-1.5" />
              SD-WAN
            </button>
            <button
              onClick={() => setVnfTypeFilter('router')}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                vnfTypeFilter === 'router'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <RouterIcon className="h-4 w-4 mr-1.5" />
              Router
            </button>
            <button
              onClick={() => setVnfTypeFilter('vnat')}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                vnfTypeFilter === 'vnat'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Network className="h-4 w-4 mr-1.5" />
              vNAT
            </button>
            <button
              onClick={() => setVnfTypeFilter('custom')}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                vnfTypeFilter === 'custom'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-4 w-4 mr-1.5" />
              Custom
            </button>
          </div>

          {/* Cloud Router Filter */}
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Cloud Router:</span>
            <select
              value={cloudRouterFilter}
              onChange={(e) => setCloudRouterFilter(e.target.value)}
              className="form-control text-sm"
            >
              <option value="all">All Cloud Routers</option>
              {cloudRouters.map(router => (
                <option key={router.id} value={router.id}>{router.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content - Either Grid or Table */}
      <div className="p-6">
        {filteredVNFs.length > 0 ? (
          viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <VNFTable 
                vnfs={filteredVNFs} 
                cloudRouters={cloudRouters}
                onEdit={onEdit} 
                onDelete={onDelete}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVNFs.map(vnf => (
                <VNFCard 
                  key={vnf.id} 
                  vnf={vnf} 
                  cloudRouter={cloudRouters.find(cr => cr.id === vnf.cloudRouterId)}
                  onEdit={() => onEdit(vnf)}
                  onDelete={() => onDelete(vnf)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="col-span-3 text-center py-12">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Virtual Network Functions</h3>
            <p className="text-gray-500 mb-6">Add virtual network functions to enhance your network capabilities</p>
            <Button
              variant="primary"
              icon={Plus}
              onClick={onAdd}
            >
              Add VNF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}