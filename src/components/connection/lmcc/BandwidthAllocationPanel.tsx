import { useState } from 'react';
import { Gauge, Zap } from 'lucide-react';
import { LMCCSite, LMCCBandwidthAllocation } from '../../../types/lmcc';

interface BandwidthAllocationPanelProps {
  sites: LMCCSite[];
  selectedSites: string[];
  bandwidthAllocations: LMCCBandwidthAllocation[];
  onBandwidthChange: (allocations: LMCCBandwidthAllocation[]) => void;
}

const BANDWIDTH_PRESETS = [100, 500, 1000, 10000]; // Mbps

export function BandwidthAllocationPanel({
  sites,
  selectedSites,
  bandwidthAllocations,
  onBandwidthChange
}: BandwidthAllocationPanelProps) {
  const [bulkBandwidth, setBulkBandwidth] = useState<number>(100);

  const selectedSitesData = sites.filter(s => selectedSites.includes(s.id));

  const getBandwidthForSite = (siteId: string): number => {
    const allocation = bandwidthAllocations.find(a => a.siteId === siteId);
    return allocation?.bandwidth || 100;
  };

  const handleBandwidthChange = (siteId: string, bandwidth: number) => {
    const updatedAllocations = bandwidthAllocations.filter(a => a.siteId !== siteId);
    updatedAllocations.push({ siteId, bandwidth });
    onBandwidthChange(updatedAllocations);
  };

  const handleApplyToAll = () => {
    const newAllocations = selectedSites.map(siteId => ({
      siteId,
      bandwidth: bulkBandwidth
    }));
    onBandwidthChange(newAllocations);
  };

  const totalBandwidth = bandwidthAllocations.reduce((sum, a) => sum + a.bandwidth, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Allocate Bandwidth</h3>
        <p className="text-sm text-gray-600">
          Configure bandwidth allocation for each selected site. You can set individual values or apply a bandwidth tier to all sites at once.
        </p>
      </div>

      {/* Bulk Bandwidth Allocation */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Bulk Bandwidth Assignment</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              value={bulkBandwidth}
              onChange={(e) => setBulkBandwidth(parseInt(e.target.value) || 0)}
              min="1"
              max="100000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter bandwidth in Mbps"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyToAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply to All Sites
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs text-gray-600">Quick presets:</span>
          {BANDWIDTH_PRESETS.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => setBulkBandwidth(preset)}
              className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {preset >= 1000 ? `${preset / 1000} Gbps` : `${preset} Mbps`}
            </button>
          ))}
        </div>
      </div>

      {/* Total Bandwidth Summary */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Aggregate Bandwidth</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalBandwidth >= 1000
                  ? `${(totalBandwidth / 1000).toFixed(2)} Gbps`
                  : `${totalBandwidth} Mbps`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Across {selectedSites.length} sites</p>
            <p className="text-sm text-gray-500">
              Avg: {selectedSites.length > 0 ? Math.round(totalBandwidth / selectedSites.length) : 0} Mbps/site
            </p>
          </div>
        </div>
      </div>

      {/* Individual Site Bandwidth */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Per-Site Bandwidth Allocation</h4>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {selectedSitesData.map(site => {
            const currentBandwidth = getBandwidthForSite(site.id);
            return (
              <div
                key={site.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Gauge className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{site.name}</h5>
                    <p className="text-sm text-gray-500">
                      {site.city}, {site.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={currentBandwidth}
                      onChange={(e) => handleBandwidthChange(site.id, parseInt(e.target.value) || 0)}
                      min="1"
                      max="100000"
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    />
                    <span className="text-sm font-medium text-gray-700 w-12">Mbps</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedSitesData.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Gauge className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No sites selected</p>
          <p className="text-sm text-gray-500 mt-1">Go back and select sites to configure bandwidth</p>
        </div>
      )}
    </div>
  );
}
