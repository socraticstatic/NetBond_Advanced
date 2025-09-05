import { useState } from 'react';
import { Plus, Filter, Download, Router, Settings, ChevronDown, ChevronUp, Network } from 'lucide-react';
import { Button } from '../../common/Button';
import { CloudRouter } from '../../../types/cloudrouter';
import { CloudRouterCard } from './CloudRouterCard';
import { CloudRouterTable } from './CloudRouterTable';
import { VNF } from '../../../types/vnf';
import { Connection } from '../../../types';

interface CloudRouterSectionProps {
  cloudRouters: CloudRouter[];
  vnfs?: VNF[]; // VNFs to display with cloud routers
  onAdd: () => void;
  onEdit: (cloudRouter: CloudRouter) => void;
  onDelete: (cloudRouter: CloudRouter) => void;
  connectionId: string;
  connection?: Connection; // Add connection prop to access bandwidth
}

export function CloudRouterSection({ 
  cloudRouters, 
  vnfs = [],
  onAdd, 
  onEdit, 
  onDelete,
  connectionId,
  connection
}: CloudRouterSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize all cloud routers to be expanded by default
  const defaultExpandedState = cloudRouters.reduce((acc, router) => {
    acc[router.id] = true;  // Set all to expanded by default
    return acc;
  }, {} as Record<string, boolean>);
  
  const [expandedRouters, setExpandedRouters] = useState<Record<string, boolean>>(defaultExpandedState);

  // Filter cloud routers based on search
  const filteredCloudRouters = cloudRouters.filter(router => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      router.name.toLowerCase().includes(searchLower) ||
      router.description.toLowerCase().includes(searchLower)
    );
  });

  const toggleRouterExpanded = (routerId: string) => {
    setExpandedRouters(prev => ({
      ...prev,
      [routerId]: !prev[routerId]
    }));
  };

  // Calculate total bandwidth used by all links across all cloud routers
  const calculateTotalUsedBandwidth = () => {
    let totalUsed = 0;
    
    cloudRouters.forEach(router => {
      if (router.links && router.links.length > 0) {
        router.links.forEach(link => {
          // Extract numeric value from bandwidth if available
          if (link.bandwidth) {
            const bandwidthMatch = link.bandwidth.match(/(\d+(\.\d+)?)/);
            if (bandwidthMatch) {
              totalUsed += parseFloat(bandwidthMatch[0]);
            }
          }
        });
      }
    });
    
    return totalUsed;
  };

  // Get connection bandwidth as a number
  const getConnectionBandwidth = (): string => {
    if (connection?.bandwidth) {
      return connection.bandwidth;
    }
    return '10 Gbps'; // Default if not specified
  };

  // Calculate total used bandwidth
  const totalUsedBandwidth = calculateTotalUsedBandwidth();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Router className="h-5 w-5 text-brand-blue mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Cloud Routers</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cloud routers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
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
                message: 'Cloud Router data has been exported',
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
            Add Cloud Router
          </Button>
        </div>
      </div>

      {/* Cloud Router Status Summary */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-start space-x-2">
          <Router className="h-5 w-5 text-brand-blue mt-0.5" />
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Cloud Router Status:</span> {cloudRouters.filter(r => r.status === 'active').length} active, {cloudRouters.filter(r => r.status !== 'active').length} inactive
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Connection Bandwidth: {getConnectionBandwidth()} | Used: {totalUsedBandwidth.toFixed(1)} Gbps | Available: {(parseFloat(getConnectionBandwidth().replace(/[^\d.]/g, '')) - totalUsedBandwidth).toFixed(1)} Gbps
            </p>
          </div>
        </div>
      </div>

      {/* Content - Either Grid or Table */}
      <div className="p-6">
        {filteredCloudRouters.length === 0 ? (
          <div className="text-center py-12">
            <Router className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Cloud Routers</h3>
            <p className="text-gray-500 mb-6">Add cloud routers to manage your network connections</p>
            <Button
              variant="primary"
              icon={Plus}
              onClick={onAdd}
            >
              Add Cloud Router
            </Button>
          </div>
        ) : viewMode === 'table' ? (
          <CloudRouterTable 
            cloudRouters={filteredCloudRouters}
            vnfs={vnfs}
            onEdit={onEdit} 
            onDelete={onDelete}
            connectionBandwidth={getConnectionBandwidth()}
            usedBandwidth={totalUsedBandwidth}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCloudRouters.map(cloudRouter => (
              <CloudRouterCard 
                key={cloudRouter.id} 
                cloudRouter={cloudRouter}
                vnfs={vnfs.filter(vnf => vnf.cloudRouterId === cloudRouter.id)}
                onEdit={() => onEdit(cloudRouter)}
                onDelete={() => onDelete(cloudRouter)}
                isExpanded={!!expandedRouters[cloudRouter.id]}
                onToggleExpand={() => toggleRouterExpanded(cloudRouter.id)}
                connectionBandwidth={getConnectionBandwidth()}
                usedBandwidth={totalUsedBandwidth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}