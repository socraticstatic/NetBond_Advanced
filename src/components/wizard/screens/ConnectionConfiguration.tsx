import { CheckCircle2, AlertTriangle, MapPin, Shield, Server, ArrowRight, Lock, Globe, Info } from 'lucide-react';
import { CloudProvider, LocationOption, BandwidthOption } from '../../../types/connection';
import { getLocationLabels, getLocations, getMetros, getLocationsInMetro } from '../../../data/providerLocations';
import { LMCC_METROS, CURRENT_PHASE, getPhaseTag } from '../../../data/lmccService';
import { getResiliencyConfig } from '../../../data/providerResiliency';
import type { ResiliencyLevel } from './ResiliencySelection';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const minLocations = resiliencyLevel === 'maximum' || resiliencyLevel === 'geodiversity' ? 2 : 1;

  // AWS + Maximum Resiliency + Internet to Cloud = LMCC metro selection
  const isAwsMax = selectedProviders.includes('AWS' as CloudProvider) && resiliencyLevel === 'maximum' && type === 'Internet to Cloud';

  // If we have multi-provider data, use the new UI
  if (selectedProviders.length > 0 && onToggleLocation) {
    // AWS Maximum Resiliency: show LMCC Metro selection with associated datacenters
    if (isAwsMax) {
      // Show ALL metros, tag by phase, disable GA metros during preview
      const metros = LMCC_METROS;
      const awsSelected = selectedLocations['AWS'] || [];

      return (
        <div className="space-y-6">
          <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-2">
            Select AWS Max Metro
          </h3>
          <p className="text-figma-sm text-fw-bodyLight text-center mb-6">
            AT&T auto-provisions 4 hosted connections across 4 IPEs in 2 diverse datacenters within your selected metro.
          </p>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-fw-accent border border-fw-active/20 mb-6">
            <Shield className="h-5 w-5 text-fw-link flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-figma-sm font-medium text-fw-heading">Maximum Resiliency via AWS Max</p>
              <p className="text-figma-xs text-fw-bodyLight mt-1">
                Each metro contains 2 diverse datacenter sites. AT&T automatically distributes 4 connections (2 per site, on separate Juniper MX-304 devices) for full device + location redundancy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {metros.map((metro) => {
              const isSelected = awsSelected.includes(metro.id);
              const isGaOnly = metro.phase === 'ga' && CURRENT_PHASE === 'preview';
              const phaseTag = getPhaseTag(metro.phase);
              return (
                <button
                  key={metro.id}
                  disabled={isGaOnly}
                  onClick={() => {
                    if (isGaOnly) return;
                    if (isSelected) {
                      onToggleLocation('AWS', metro.id);
                    } else {
                      awsSelected.forEach(s => onToggleLocation('AWS', s));
                      onToggleLocation('AWS', metro.id);
                    }
                  }}
                  className={`
                    relative p-5 border-2 rounded-2xl text-left transition-all duration-200
                    ${isGaOnly
                      ? 'border-fw-secondary bg-fw-wash cursor-not-allowed opacity-60'
                      : isSelected
                        ? 'border-fw-active bg-fw-primary shadow-lg'
                        : 'border-fw-secondary bg-fw-base hover:border-fw-active/50 hover:bg-fw-wash'
                    }
                  `}
                >
                  {isSelected && (
                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-white" />
                  )}
                  {isGaOnly && (
                    <Lock className="absolute top-3 right-3 h-4 w-4 text-fw-disabled" />
                  )}

                  {/* Phase badge - white on selected blue, standard on unselected */}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-[8px] text-[10px] font-medium mb-2 ${
                      isSelected ? 'text-white bg-white/20' : isGaOnly ? 'text-fw-disabled bg-fw-wash' : ''
                    }`}
                    style={!isSelected && !isGaOnly ? { color: phaseTag.color, backgroundColor: phaseTag.bg } : undefined}
                  >
                    {phaseTag.label}
                  </span>

                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className={`h-5 w-5 ${isGaOnly ? 'text-fw-disabled' : isSelected ? 'text-white' : 'text-fw-body'}`} />
                    <span className={`text-figma-base font-bold ${isGaOnly ? 'text-fw-disabled' : isSelected ? 'text-white' : 'text-fw-heading'}`}>
                      {metro.name}
                    </span>
                  </div>

                  {/* Associated datacenters */}
                  <div className="space-y-2">
                    {metro.datacenters.map((dc, i) => (
                      <div
                        key={dc}
                        className={`
                          flex items-center gap-2 p-2.5 rounded-lg
                          ${isGaOnly ? 'bg-fw-wash border border-fw-secondary' : isSelected ? 'bg-white/10' : 'bg-fw-wash border border-fw-secondary'}
                        `}
                      >
                        <Server className={`h-3.5 w-3.5 shrink-0 ${isGaOnly ? 'text-fw-disabled' : isSelected ? 'text-white/70' : 'text-fw-bodyLight'}`} />
                        <div>
                          <p className={`text-figma-xs font-medium ${isGaOnly ? 'text-fw-disabled' : isSelected ? 'text-white' : 'text-fw-heading'}`}>
                            {dc}
                          </p>
                          <p className={`text-figma-xs ${isGaOnly ? 'text-fw-disabled' : isSelected ? 'text-white/60' : 'text-fw-bodyLight'}`}>
                            Site {i + 1} - 2 IPEs (MX-304)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-3 text-figma-xs ${isGaOnly ? 'text-fw-disabled' : isSelected ? 'text-white/70' : 'text-fw-bodyLight'}`}>
                    {metro.facilities.join(' + ')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Non-AWS providers still use regular location selection */}
          {selectedProviders.filter(p => p !== 'AWS').length > 0 && (
            <div className="mt-8 space-y-8">
              {selectedProviders.filter(p => p !== 'AWS').map((providerId) => {
                const locations = getLocationLabels(providerId);
                const selected = selectedLocations[providerId] || [];
                return (
                  <div key={providerId} className="border border-fw-secondary rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 bg-fw-wash border-b border-fw-secondary flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-fw-body" />
                        <h4 className="text-figma-base font-semibold text-fw-heading">{providerId}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-figma-xs font-medium ${
                        selected.length > 0 ? 'bg-fw-primary text-white' : 'bg-fw-wash text-fw-bodyLight border border-fw-secondary'
                      }`}>
                        {selected.length} selected
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {locations.map((location) => {
                          const isLoc = selected.includes(location);
                          return (
                            <button
                              key={location}
                              onClick={() => onToggleLocation(providerId, location)}
                              className={`relative p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                                isLoc ? 'border-fw-active bg-fw-blue-light shadow-md' : 'border-fw-secondary bg-fw-base hover:border-fw-active/50 hover:bg-fw-wash'
                              }`}
                            >
                              <span className={`text-figma-sm font-medium block ${isLoc ? 'text-fw-heading' : 'text-fw-body'}`}>{location}</span>
                              {isLoc && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-fw-link" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Location selection - adapts per provider's locationBehavior
    return (
      <div className="space-y-6">
        <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">
          {resiliencyLevel === 'geodiversity' ? 'Select Metros for Geodiversity' : 'Select Locations'}
        </h3>

        <div className="space-y-8">
            <div className="text-center">
              <p className="text-figma-sm text-fw-bodyLight mt-2">
                {resiliencyLevel === 'geodiversity'
                  ? 'Select a primary and geographically independent secondary metro per provider.'
                  : resiliencyLevel === 'maximum'
                    ? 'Maximum resiliency provisions 4 links across 2 sites in 1 metro.'
                    : 'Select at least 1 location per provider.'}
              </p>
            </div>

            {resiliencyLevel === 'geodiversity' && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-fw-accent border border-fw-active/20">
                <Globe className="h-5 w-5 text-fw-link flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-figma-sm font-medium text-fw-heading">Geo-Diverse, Metro-Independent Redundancy</p>
                  <p className="text-figma-xs text-fw-bodyLight mt-1">
                    Select 2 geographically independent metros. Each metro will have local redundancy with 2 links. This protects against device, site, and metro-wide outages.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {selectedProviders.map((providerId) => {
                const tier = (resiliencyLevel || 'standard') as 'standard' | 'maximum' | 'geodiversity';
                const config = getResiliencyConfig(providerId, tier);
                const selected = selectedLocations[providerId] || [];
                const needsMore = (resiliencyLevel === 'maximum' || resiliencyLevel === 'geodiversity') && selected.length < config.minLocations;

                // Azure/Google Maximum: metro-grouped site picker
                if (config.locationBehavior === 'single-metro-manual' && resiliencyLevel === 'maximum') {
                  const providerMetros = getMetros(providerId);

                  return (
                    <div key={providerId} className="border border-fw-secondary rounded-2xl overflow-hidden">
                      <div className="px-5 py-4 bg-fw-wash border-b border-fw-secondary flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-fw-link" />
                          <div>
                            <h4 className="text-figma-base font-semibold text-fw-heading">{providerId} - Select 2 Sites in Same Metro</h4>
                            <p className="text-figma-xs text-fw-bodyLight">
                              {providerId === 'Google'
                                ? 'Sites must be in different edge availability domains for 99.9% SLA.'
                                : 'Select 2 peering locations within the same metro to match provider portal behavior.'}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-figma-xs font-medium ${
                          needsMore ? 'bg-fw-warningLight text-fw-warning' : selected.length >= 2 ? 'bg-fw-primary text-white' : 'bg-fw-wash text-fw-bodyLight border border-fw-secondary'
                        }`}>
                          {selected.length}/2 selected
                        </span>
                      </div>

                      <div className="p-5 space-y-4">
                        {providerMetros.map(metro => {
                          const metroLocations = getLocationsInMetro(providerId, metro);
                          if (metroLocations.length < 2) return null;

                          const metroSelected = selected.filter(s => metroLocations.some(ml => ml.label === s));
                          const isActiveMetro = metroSelected.length > 0;

                          return (
                            <div key={metro} className={`border rounded-xl overflow-hidden ${isActiveMetro ? 'border-fw-active' : 'border-fw-secondary'}`}>
                              <div className={`px-4 py-2 flex items-center gap-2 ${isActiveMetro ? 'bg-fw-accent' : 'bg-fw-wash'}`}>
                                <MapPin className={`h-4 w-4 ${isActiveMetro ? 'text-fw-link' : 'text-fw-bodyLight'}`} />
                                <span className="text-figma-sm font-semibold text-fw-heading">{metro} Metro</span>
                                {metroSelected.length >= 2 && <CheckCircle2 className="h-3.5 w-3.5 text-fw-success" />}
                              </div>
                              <div className="p-3 grid grid-cols-2 gap-2">
                                {metroLocations.map(loc => {
                                  const isSelected = selected.includes(loc.label);
                                  // If 2 already selected in another metro, disable this metro
                                  const otherMetroSelected = selected.filter(s => !metroLocations.some(ml => ml.label === s)).length;
                                  const disabledByOtherMetro = otherMetroSelected >= 2 && !isSelected;

                                  return (
                                    <button
                                      key={loc.label}
                                      disabled={disabledByOtherMetro}
                                      onClick={() => {
                                        // If selecting from a new metro, clear previous selections
                                        if (!isActiveMetro && selected.length > 0) {
                                          selected.forEach(s => onToggleLocation(providerId, s));
                                        }
                                        onToggleLocation(providerId, loc.label);
                                      }}
                                      className={`relative p-3 border-2 rounded-lg text-left transition-all text-figma-xs ${
                                        disabledByOtherMetro ? 'border-fw-secondary bg-fw-wash opacity-40 cursor-not-allowed'
                                        : isSelected ? 'border-fw-active bg-fw-accent shadow-sm' : 'border-fw-secondary bg-fw-base hover:border-fw-active/50'
                                      }`}
                                    >
                                      <span className="font-medium text-fw-heading block">{loc.label}</span>
                                      {loc.edgeDomain && (
                                        <span className="text-fw-bodyLight block mt-0.5">Edge: {loc.edgeDomain}</span>
                                      )}
                                      {isSelected && <CheckCircle2 className="absolute top-2 right-2 h-3.5 w-3.5 text-fw-link" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}

                        {providerId === 'Google' && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-fw-wash border border-fw-secondary">
                            <Info className="h-3.5 w-3.5 text-fw-bodyLight shrink-0 mt-0.5" />
                            <p className="text-figma-xs text-fw-bodyLight">
                              For 99.9% SLA, selected sites must be in <strong>different edge availability domains</strong> within the same metro.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Geodiversity: dual-metro picker
                if (resiliencyLevel === 'geodiversity') {
                  const providerMetros = getMetros(providerId);

                  return (
                    <div key={providerId} className="border border-fw-secondary rounded-2xl overflow-hidden">
                      <div className="px-5 py-4 bg-fw-wash border-b border-fw-secondary flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-fw-link" />
                          <div>
                            <h4 className="text-figma-base font-semibold text-fw-heading">{providerId} - Select 2 Independent Metros</h4>
                            <p className="text-figma-xs text-fw-bodyLight">Each metro provides local redundancy. Metros must be geographically independent.</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-figma-xs font-medium ${
                          needsMore ? 'bg-fw-warningLight text-fw-warning' : selected.length >= 2 ? 'bg-fw-primary text-white' : 'bg-fw-wash text-fw-bodyLight border border-fw-secondary'
                        }`}>
                          {selected.length}/2 metros
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {providerMetros.map(metro => {
                            // For geodiversity, user selects metros (not individual sites)
                            const isSelected = selected.includes(metro);
                            const isFull = selected.length >= 2 && !isSelected;
                            const metroLocs = getLocationsInMetro(providerId, metro);

                            return (
                              <button
                                key={metro}
                                disabled={isFull}
                                onClick={() => onToggleLocation(providerId, metro)}
                                className={`relative p-4 border-2 rounded-xl text-left transition-all ${
                                  isFull ? 'border-fw-secondary bg-fw-wash opacity-40 cursor-not-allowed'
                                  : isSelected ? 'border-fw-active bg-fw-accent shadow-md' : 'border-fw-secondary bg-fw-base hover:border-fw-active/50'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin className={`h-4 w-4 ${isSelected ? 'text-fw-link' : 'text-fw-body'}`} />
                                  <span className="text-figma-sm font-semibold text-fw-heading">{metro}</span>
                                </div>
                                <p className="text-figma-xs text-fw-bodyLight">{metroLocs.length} site{metroLocs.length !== 1 ? 's' : ''} available</p>
                                {selected.indexOf(metro) === 0 && (
                                  <span className="absolute top-2 right-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-fw-primary text-white">Primary</span>
                                )}
                                {selected.indexOf(metro) === 1 && (
                                  <span className="absolute top-2 right-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-fw-accent text-fw-link border border-fw-active">Secondary</span>
                                )}
                                {isSelected && !isFull && selected.indexOf(metro) === -1 && (
                                  <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-fw-link" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Standard: flat location grid
                const locations = getLocationLabels(providerId);
                return (
                  <div key={providerId} className="border border-fw-secondary rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 bg-fw-wash border-b border-fw-secondary flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-fw-body" />
                        <h4 className="text-figma-base font-semibold text-fw-heading">{providerId}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-figma-xs font-medium ${
                        selected.length > 0 ? 'bg-fw-primary text-white' : 'bg-fw-wash text-fw-bodyLight border border-fw-secondary'
                      }`}>
                        {selected.length} selected
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
                              className={`relative p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                                isSelected ? 'border-fw-active bg-fw-blue-light shadow-md' : 'border-fw-secondary bg-fw-base hover:border-fw-active/50 hover:bg-fw-wash'
                              }`}
                            >
                              <span className={`text-figma-sm font-medium block ${isSelected ? 'text-fw-heading' : 'text-fw-body'}`}>
                                {location}
                              </span>
                              {isSelected && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-fw-link" />}
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
