import { useState } from 'react';
import { MapPin, Search, CheckCircle2, Circle } from 'lucide-react';
import { LMCCSite } from '../../../types/lmcc';

interface SiteSelectionPanelProps {
  sites: LMCCSite[];
  selectedSites: string[];
  onSitesChange: (siteIds: string[]) => void;
}

export function SiteSelectionPanel({ sites, selectedSites, onSitesChange }: SiteSelectionPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  // Get unique regions
  const regions = ['all', ...Array.from(new Set(sites.map(s => s.region)))];

  // Filter sites
  const filteredSites = sites.filter(site => {
    const matchesRegion = regionFilter === 'all' || site.region === regionFilter;
    const matchesSearch = searchQuery === '' ||
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.state.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRegion && matchesSearch;
  });

  const handleToggleSite = (siteId: string) => {
    if (selectedSites.includes(siteId)) {
      onSitesChange(selectedSites.filter(id => id !== siteId));
    } else {
      onSitesChange([...selectedSites, siteId]);
    }
  };

  const handleSelectAll = () => {
    onSitesChange(filteredSites.map(s => s.id));
  };

  const handleClearAll = () => {
    onSitesChange([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select Sites</h3>
        <p className="text-sm text-gray-600">
          Choose one or more sites where LMCC connectivity will be established. Select sites strategically based on your network topology and requirements.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {regions.map(region => (
            <option key={region} value={region}>
              {region === 'all' ? 'All Regions' : region}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="text-sm font-medium text-gray-700">
          {selectedSites.length} of {sites.length} sites selected
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {filteredSites.map(site => {
          const isSelected = selectedSites.includes(site.id);
          return (
            <div
              key={site.id}
              onClick={() => handleToggleSite(site.id)}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <h4 className="font-medium text-gray-900">{site.name}</h4>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{site.address}</p>
                    <p>{site.city}, {site.state} {site.zip}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {site.region}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        site.availability === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {site.availability}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSites.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No sites found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
