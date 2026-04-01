import { CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';
import { CloudProvider, LocationOption, BandwidthOption } from '../../../types/connection';
import { getLocationLabels } from '../../../data/providerLocations';
import type { ResiliencyLevel } from './ResiliencySelection';

interface ConnectionConfigurationProps {
  selectedLocation: LocationOption | undefined;
  selectedBandwidth: BandwidthOption | undefined;
  provider?: string;
  type?: string;
  onLocationSelect: (location: LocationOption) => void;
  onBandwidthSelect: (bandwidth: BandwidthOption) => void;
  // New multi-provider props
  selectedProviders?: CloudProvider[];
  selectedLocations?: Record<string, string[]>;
  onToggleLocation?: (providerId: string, location: string) => void;
  resiliencyLevel?: ResiliencyLevel;
}

export function ConnectionConfiguration({
  selectedProviders = [],
  selectedLocations = {},
  onToggleLocation,
  resiliencyLevel = '',
  // Legacy props kept for backward compat
  selectedLocation,
  selectedBandwidth,
  provider,
  type,
  onLocationSelect,
  onBandwidthSelect,
}: ConnectionConfigurationProps) {
  const minLocations = resiliencyLevel === 'maximum' ? 2 : 1;

  // If we have multi-provider data, use the new UI
  if (selectedProviders.length > 0 && onToggleLocation) {
    return (
      <div className="space-y-6">
        <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">
          Select Locations
        </h3>

        <div className="space-y-8">
            <div className="text-center">
              <p className="text-figma-sm text-fw-bodyLight mt-2">
                {resiliencyLevel === 'maximum'
                  ? 'Maximum resiliency requires at least 2 locations per provider.'
                  : resiliencyLevel === 'geo'
                    ? 'Geographic resiliency requires at least 2 locations per provider.'
                    : 'Select at least 1 location per provider.'}
              </p>
            </div>

            {(resiliencyLevel === 'maximum' || resiliencyLevel === 'geo') && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-fw-warningLight border border-fw-warning">
                <AlertTriangle className="h-5 w-5 text-fw-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-figma-sm font-medium text-fw-heading">
                    {resiliencyLevel === 'maximum' ? 'Maximum' : 'Geographic'} Resiliency Selected
                  </p>
                  <p className="text-figma-xs text-fw-bodyLight mt-1">
                    Each provider must have at least 2 locations for {resiliencyLevel === 'maximum' ? 'full geographic' : 'geographic'} failover.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {selectedProviders.map((providerId) => {
                const locations = getLocationLabels(providerId);
                const selected = selectedLocations[providerId] || [];
                const needsMore = resiliencyLevel === 'maximum' && selected.length < 2;

                return (
                  <div key={providerId} className="border border-fw-secondary rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 bg-fw-wash border-b border-fw-secondary flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-fw-body" />
                        <h4 className="text-figma-base font-semibold text-fw-heading">{providerId}</h4>
                      </div>
                      <span className={`
                        px-3 py-1 rounded-full text-figma-xs font-medium
                        ${needsMore
                          ? 'bg-fw-warningLight text-fw-warning'
                          : selected.length > 0
                            ? 'bg-fw-primary text-white'
                            : 'bg-fw-wash text-fw-bodyLight border border-fw-secondary'
                        }
                      `}>
                        {selected.length} selected
                        {needsMore && ` (${2 - selected.length} more needed)`}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {locations.map((location) => {
                          const isSelected = selected.includes(location);
                          return (
                            <button
                              key={location}
                              onClick={() => onToggleLocation(providerId, location)}
                              className={`
                                relative p-4 border-2 rounded-xl text-left transition-all duration-200
                                ${isSelected
                                  ? 'border-fw-active bg-fw-blue-light shadow-md'
                                  : 'border-fw-secondary bg-fw-base hover:border-fw-active/50 hover:bg-fw-wash'
                                }
                              `}
                            >
                              <span className={`text-figma-sm font-medium block ${isSelected ? 'text-fw-heading' : 'text-fw-body'}`}>
                                {location}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-fw-link" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      </div>
    );
  }

  // Legacy single-provider fallback
  return (
    <div className="space-y-6">
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">
        Configure Your Connection
      </h3>

          <div className="grid grid-cols-2 gap-3">
            {['US East', 'US West', 'EU West', 'Asia Pacific'].map((location) => (
              <button
                key={location}
                onClick={() => onLocationSelect(location as LocationOption)}
                className={`
                  flex flex-col items-center justify-center h-24 p-3 border-2 rounded-xl
                  transition-all duration-200 wizard-card
                  ${selectedLocation === location
                    ? 'border-fw-active bg-fw-blue-light shadow-lg'
                    : 'border-fw-secondary hover:border-fw-bodyLight'
                  }
                `}
              >
                <MapPin className={`h-5 w-5 mb-2 ${selectedLocation === location ? 'text-fw-link' : 'text-fw-bodyLight'}`} />
                <span className={`text-figma-base font-medium ${selectedLocation === location ? 'text-fw-heading' : 'text-fw-body'}`}>
                  {location}
                </span>
              </button>
            ))}
          </div>
    </div>
  );
}
