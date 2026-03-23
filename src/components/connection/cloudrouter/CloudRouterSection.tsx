import { useState } from 'react';
import { Plus, GitBranch } from 'lucide-react';
import { Button } from '../../common/Button';
import { SearchFilterBar } from '../../common/SearchFilterBar';
import { CloudRouter } from '../../../types/cloudrouter';
import { CloudRouterTable } from './CloudRouterTable';
import { VNF } from '../../../types/vnf';
import { Connection } from '../../../types';

interface CloudRouterSectionProps {
  cloudRouters: CloudRouter[];
  vnfs?: VNF[];
  onAdd: () => void;
  onEdit: (cloudRouter: CloudRouter) => void;
  onDelete: (cloudRouter: CloudRouter) => void;
  connectionId: string;
  connection?: Connection;
}

export function CloudRouterSection({
  cloudRouters,
  vnfs = [],
  onAdd,
  onEdit,
  onDelete,
  connection
}: CloudRouterSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate bandwidth usage
  const calculateTotalUsedBandwidth = () => {
    let totalUsed = 0;
    cloudRouters.forEach(router => {
      if (router.links && router.links.length > 0) {
        router.links.forEach(link => {
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

  const getConnectionBandwidth = (): string => {
    return connection?.bandwidth || '10 Gbps';
  };

  const totalUsedBandwidth = calculateTotalUsedBandwidth();
  const connectionBandwidthValue = parseFloat(getConnectionBandwidth().replace(/[^\d.]/g, ''));
  const availableBandwidth = connectionBandwidthValue - totalUsedBandwidth;

  // Filter cloud routers
  const filteredCloudRouters = cloudRouters.filter(router => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      router.name.toLowerCase().includes(searchLower) ||
      router.description?.toLowerCase().includes(searchLower) ||
      router.location?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.04em]">Cloud Routers</h2>
          <p className="text-figma-base text-fw-bodyLight mt-1">
            Manage cloud routers and their network configurations
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={onAdd}>
          Add Cloud Router
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-fw-accent rounded-lg p-4 border border-fw-active">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-base font-medium text-fw-linkHover">Active Cloud Routers</p>
              <p className="text-figma-xl font-bold text-fw-linkHover mt-1">
                {cloudRouters.filter(r => r.status === 'active').length}
              </p>
            </div>
            <GitBranch className="h-8 w-8 text-fw-link opacity-50" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-sm font-medium text-fw-heading">Total Links</p>
              <p className="text-figma-xl font-bold text-fw-success mt-1">
                {cloudRouters.reduce((sum, r) => sum + (r.links?.length || 0), 0)}
              </p>
            </div>
            <GitBranch className="h-8 w-8 text-fw-success opacity-50" />
          </div>
        </div>

        <div className="bg-fw-wash rounded-lg p-4 border border-fw-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-base font-medium text-fw-heading">Bandwidth</p>
              <p className="text-figma-xl font-bold text-fw-body mt-1">
                {availableBandwidth.toFixed(1)} <span className="text-figma-base font-normal">Gbps free</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-figma-sm text-fw-bodyLight">{totalUsedBandwidth.toFixed(1)} used</p>
              <p className="text-figma-sm text-fw-bodyLight">{getConnectionBandwidth()} total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-lg border border-fw-secondary overflow-hidden">
        <div className="px-6 py-4 border-b border-fw-secondary">
          <SearchFilterBar
            searchPlaceholder="Search routers ..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onFilter={() => setShowFilters(!showFilters)}
            onExport={() => window.addToast?.({ type: 'success', title: 'Exported', message: 'Cloud routers exported', duration: 3000 })}
          />
        </div>

        {filteredCloudRouters.length === 0 ? (
          <div className="text-center py-16">
            <GitBranch className="h-12 w-12 mx-auto text-fw-bodyLight mb-4" />
            <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em] mb-2">
              {searchQuery ? 'No routers found' : 'No cloud routers'}
            </h3>
            <p className="text-fw-bodyLight mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first cloud router'}
            </p>
            {!searchQuery && (
              <Button variant="primary" icon={Plus} onClick={onAdd}>
                Add Cloud Router
              </Button>
            )}
          </div>
        ) : (
          <CloudRouterTable
            cloudRouters={filteredCloudRouters}
            vnfs={vnfs}
            onEdit={onEdit}
            onDelete={onDelete}
            connectionBandwidth={getConnectionBandwidth()}
            usedBandwidth={totalUsedBandwidth}
          />
        )}
      </div>
    </div>
  );
}
