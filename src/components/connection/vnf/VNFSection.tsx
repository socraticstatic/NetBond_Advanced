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

      {/* Table */}
      <VNFTable
        vnfs={filteredVNFs}
        cloudRouters={cloudRouters}
        onEdit={onEdit}
        onDelete={onDelete}
        connectionId={connectionId}
        onDetach={handleDetach}
        isDetached={isDetached}
        toolbar={
          <SearchFilterBar
            searchPlaceholder="Search VNFs ..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filterContent={
              <select
                value={vnfTypeFilter}
                onChange={(e) => setVnfTypeFilter(e.target.value as VNFType | 'all')}
                className="inline-flex items-center h-9 pl-4 pr-8 text-[14px] font-medium text-fw-link bg-transparent border border-fw-active rounded-full hover:bg-fw-neutral transition-colors tracking-[-0.03em] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230057B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                }}
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
        }
      />
    </div>
  );
}
