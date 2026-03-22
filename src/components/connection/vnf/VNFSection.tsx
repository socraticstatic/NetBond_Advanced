import { useState } from 'react';
import { Plus, Shield } from 'lucide-react';
import { Button } from '../../common/Button';
import { SearchFilterBar } from '../../common/SearchFilterBar';
import { VNF, VNFType } from '../../../types/vnf';
import { VNFTable } from './VNFTable';
import { CloudRouter } from '../../../types/cloudrouter';
import { useStore } from '../../../store/useStore';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [vnfTypeFilter, setVnfTypeFilter] = useState<VNFType | 'all'>('all');
  const openWindow = useStore(state => state.openWindow);
  const isWindowOpen = useStore(state => state.isWindowOpen);

  // Filter VNFs
  const filteredVNFs = vnfs.filter(vnf => {
    const matchesType = vnfTypeFilter === 'all' || vnf.type === vnfTypeFilter;

    if (!searchQuery) return matchesType;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      vnf.name.toLowerCase().includes(searchLower) ||
      vnf.vendor?.toLowerCase().includes(searchLower) ||
      vnf.type.toLowerCase().includes(searchLower)
    );

    return matchesType && matchesSearch;
  });

  // Count VNFs by type
  const vnfsByType = {
    firewall: vnfs.filter(v => v.type === 'firewall').length,
    sdwan: vnfs.filter(v => v.type === 'sdwan').length,
    router: vnfs.filter(v => v.type === 'router').length,
    vnat: vnfs.filter(v => v.type === 'vnat').length,
    other: vnfs.filter(v => !['firewall', 'sdwan', 'router', 'vnat'].includes(v.type)).length
  };

  const activeVNFs = vnfs.filter(v => v.status === 'active').length;

  const handleDetach = () => {
    const tableId = `vnf-${connectionId}`;
    openWindow(tableId, {
      position: { x: 100, y: 100 },
      size: { width: 1200, height: 800 }
    });
  };

  const isDetached = isWindowOpen(`vnf-${connectionId}`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.04em]">Network Functions</h2>
          <p className="text-figma-base text-fw-bodyLight mt-1">
            Manage network function instances and their configurations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={onAdd}
          >
            Add Network Function
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-fw-accent rounded-lg p-4 border border-fw-active">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-sm font-medium text-fw-heading">Active VNFs</p>
              <p className="text-figma-xl font-bold text-fw-link mt-1">{activeVNFs}</p>
            </div>
            <Shield className="h-8 w-8 text-fw-link opacity-50" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-sm font-medium text-fw-heading">Firewalls</p>
              <p className="text-figma-xl font-bold text-fw-error mt-1">{vnfsByType.firewall}</p>
            </div>
            <Shield className="h-8 w-8 text-fw-error opacity-50" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-sm font-medium text-fw-heading">SD-WAN</p>
              <p className="text-figma-xl font-bold text-fw-success mt-1">{vnfsByType.sdwan}</p>
            </div>
            <Shield className="h-8 w-8 text-fw-success opacity-50" />
          </div>
        </div>

        <div className="bg-fw-wash rounded-lg p-4 border border-fw-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-base font-medium text-fw-heading">Routers</p>
              <p className="text-figma-xl font-bold text-fw-body mt-1">{vnfsByType.router}</p>
            </div>
            <Shield className="h-8 w-8 text-fw-bodyLight opacity-50" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-fw-base rounded-2xl overflow-hidden">
        <div className="px-6 py-4">
          <SearchFilterBar
            searchPlaceholder="Search VNFs ..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filterContent={
              <select
                value={vnfTypeFilter}
                onChange={(e) => setVnfTypeFilter(e.target.value as VNFType | 'all')}
                className="fw-select"
                style={{ width: 'auto', paddingRight: '2.5rem' }}
              >
                <option value="all">All Types</option>
                <option value="firewall">Firewall</option>
                <option value="sdwan">SD-WAN</option>
                <option value="router">Router</option>
                <option value="vnat">NAT</option>
                <option value="custom">Custom</option>
              </select>
            }
            onExport={() => {
              const getTypeName = (type: VNFType) => {
                switch(type) {
                  case 'firewall': return 'Firewall';
                  case 'sdwan': return 'SD-WAN';
                  case 'router': return 'Router';
                  case 'vnat': return 'NAT';
                  case 'custom': return 'Custom';
                  default: return type.toUpperCase();
                }
              };
              const headers = ['Name', 'Type', 'Status'].join(',');
              const rows = filteredVNFs.map(vnf =>
                `"${vnf.name}","${getTypeName(vnf.type)}","${vnf.status.charAt(0).toUpperCase() + vnf.status.slice(1)}"`
              );
              const csv = [headers, ...rows].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'network-functions.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
          />
        </div>

        {filteredVNFs.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="h-12 w-12 mx-auto text-fw-bodyLight mb-4" />
            <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em] mb-2">
              {searchQuery || vnfTypeFilter !== 'all' ? 'No VNFs found' : 'No network functions'}
            </h3>
            <p className="text-fw-bodyLight mb-6">
              {searchQuery || vnfTypeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first network function'}
            </p>
            {!searchQuery && vnfTypeFilter === 'all' && (
              <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={onAdd}>
                Add Network Function
              </Button>
            )}
          </div>
        ) : (
          <VNFTable
            vnfs={filteredVNFs}
            cloudRouters={cloudRouters}
            onEdit={onEdit}
            onDelete={onDelete}
            connectionId={connectionId}
            onDetach={handleDetach}
            isDetached={isDetached}
          />
        )}
      </div>
    </div>
  );
}
