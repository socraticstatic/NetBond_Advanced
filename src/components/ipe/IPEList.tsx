import { useState } from 'react';
import { Server, MapPin, Filter, Download, Plus, Search } from 'lucide-react';
import { IPE, DataCenterProvider, IPERegion } from '../../types/ipe';
import { IPECard } from './IPECard';
import { Button } from '../common/Button';

interface IPEListProps {
  ipes: IPE[];
  onIPEClick?: (ipe: IPE) => void;
  onAddIPE?: () => void;
}

export function IPEList({ ipes, onIPEClick, onAddIPE }: IPEListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<DataCenterProvider | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<IPERegion | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredIPEs = ipes.filter(ipe => {
    const matchesSearch =
      ipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipe.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = selectedProvider === 'all' || ipe.dataCenterProvider === selectedProvider;
    const matchesRegion = selectedRegion === 'all' || ipe.region === selectedRegion;

    return matchesSearch && matchesProvider && matchesRegion;
  });

  const totalCapacity = ipes.reduce((sum, ipe) => {
    const capacity = parseFloat(ipe.installedCapacity.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(capacity) ? 0 : capacity);
  }, 0);

  const avgUtilization = ipes.length > 0
    ? ipes.reduce((sum, ipe) => sum + ipe.utilization, 0) / ipes.length
    : 0;

  const criticalIPEs = ipes.filter(ipe => ipe.utilization >= 85).length;

  return (
    <div className="space-y-6">
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-fw-accent rounded-lg">
              <Server className="h-6 w-6 text-fw-link" />
            </div>
            <div>
              <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.04em]">Infrastructure Provider Edge Routers</h2>
              <p className="text-figma-base font-medium text-fw-body mt-0.5">Physical network infrastructure at data center locations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => {
                window.addToast({
                  type: 'success',
                  title: 'Export Complete',
                  message: 'IPE data exported successfully',
                  duration: 3000
                });
              }}
            >
              Export
            </Button>
            {onAddIPE && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={onAddIPE}
              >
                Add IPE
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-fw-wash rounded-lg p-4">
            <div className="text-figma-base text-fw-bodyLight mb-1">Total IPEs</div>
            <div className="text-2xl font-bold text-fw-heading">{ipes.length}</div>
          </div>
          <div className="bg-fw-wash rounded-lg p-4">
            <div className="text-figma-base text-fw-bodyLight mb-1">Total Capacity</div>
            <div className="text-2xl font-bold text-fw-heading">{totalCapacity.toFixed(1)} Tbps</div>
          </div>
          <div className="bg-fw-wash rounded-lg p-4">
            <div className="text-figma-base text-fw-bodyLight mb-1">Avg Utilization</div>
            <div className="text-2xl font-bold text-fw-heading">{avgUtilization.toFixed(0)}%</div>
          </div>
          <div className="bg-fw-wash rounded-lg p-4">
            <div className="text-figma-base text-fw-bodyLight mb-1">At Capacity</div>
            <div className="text-2xl font-bold text-fw-error">{criticalIPEs}</div>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-fw-bodyLight" />
          <input
            type="text"
            placeholder="Search IPEs by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-fw-secondary rounded-full h-9 focus:ring-2 focus:ring-fw-active focus:border-transparent"
          />
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 mb-4 p-4 bg-fw-wash rounded-lg">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-figma-base font-medium text-fw-body mb-1">
                Data Center Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as DataCenterProvider | 'all')}
                className="w-full form-control"
              >
                <option value="all">All Providers</option>
                <option value="Equinix">Equinix</option>
                <option value="Cisco Jasper">Cisco Jasper</option>
                <option value="Databank">Databank</option>
                <option value="CoreWeave">CoreWeave</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-figma-base font-medium text-fw-body mb-1">
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as IPERegion | 'all')}
                className="w-full form-control"
              >
                <option value="all">All Regions</option>
                <option value="US East">US East</option>
                <option value="US West">US West</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Latin America">Latin America</option>
                <option value="Middle East">Middle East</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {filteredIPEs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIPEs.map(ipe => (
            <IPECard
              key={ipe.id}
              ipe={ipe}
              onClick={() => onIPEClick?.(ipe)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-fw-base rounded-2xl border border-fw-secondary p-12 text-center">
          <MapPin className="h-12 w-12 mx-auto text-fw-bodyLight mb-4" />
          <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em] mb-1">No IPEs Found</h3>
          <p className="text-fw-bodyLight">
            {searchQuery || selectedProvider !== 'all' || selectedRegion !== 'all'
              ? 'Try adjusting your filters'
              : 'No infrastructure provider edge routers configured yet'}
          </p>
        </div>
      )}
    </div>
  );
}
