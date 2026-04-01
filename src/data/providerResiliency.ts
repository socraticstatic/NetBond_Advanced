/**
 * Provider-specific resiliency tier configurations.
 *
 * Each cloud provider has structurally different resiliency architectures.
 * AT&T maps them to three tiers (Local, Geo, Max) but the underlying
 * requirements differ per provider.
 */

export interface ResiliencyTierConfig {
  providerName: string;
  sla: string;
  architecture: string;
  minConnections: number;
  minLocations: number;
  locationConstraint: string;
  details: string[];
}

type Tier = 'local' | 'geo' | 'maximum';

const AWS_TIERS: Record<Tier, ResiliencyTierConfig> = {
  local: {
    providerName: 'Dev/Test',
    sla: '99.9%',
    architecture: '1 hosted connection at 1 Direct Connect location with device-level redundancy.',
    minConnections: 1,
    minLocations: 1,
    locationConstraint: 'Any 1 Direct Connect location',
    details: ['1 connection, 1 location', 'Device redundancy only', 'No location failover'],
  },
  geo: {
    providerName: 'High Resiliency',
    sla: '99.95%',
    architecture: '2 hosted connections at 2 different Direct Connect locations. Provides location failover.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2 different Direct Connect locations',
    details: ['2 connections, 2 locations', 'Location failover', 'Single device per site'],
  },
  maximum: {
    providerName: 'Maximum Resiliency',
    sla: '99.99%',
    architecture: '4 hosted connections at 2 Direct Connect locations, 2 per location on different devices.',
    minConnections: 4,
    minLocations: 2,
    locationConstraint: '2 different Direct Connect locations, 2 connections each',
    details: ['4 connections, 2 locations', 'Device + location redundancy', 'Full Active/Active'],
  },
};

const AZURE_TIERS: Record<Tier, ResiliencyTierConfig> = {
  local: {
    providerName: 'Standard',
    sla: '99.95%',
    architecture: '1 ExpressRoute circuit at 1 peering location with dual paths within the location.',
    minConnections: 1,
    minLocations: 1,
    locationConstraint: 'Any 1 peering location',
    details: ['1 circuit, 1 peering location', 'Dual paths within location', 'No location failover'],
  },
  geo: {
    providerName: 'High',
    sla: '99.95%',
    architecture: '1 ExpressRoute circuit across 2 peering locations in the same metro area.',
    minConnections: 1,
    minLocations: 2,
    locationConstraint: '2 peering locations in same metro',
    details: ['1 circuit, 2 locations (same metro)', 'Metro-level redundancy', 'Protects against single-location failure'],
  },
  maximum: {
    providerName: 'Maximum',
    sla: '99.99%',
    architecture: '2 ExpressRoute circuits in 2 different metros. Zone-redundant gateways recommended.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2 circuits in 2 different metros',
    details: ['2 circuits, 2 different metros', 'Full geographic diversity', 'Zone-redundant gateways recommended'],
  },
};

const GOOGLE_TIERS: Record<Tier, ResiliencyTierConfig> = {
  local: {
    providerName: 'No SLA',
    sla: 'None',
    architecture: '1 VLAN attachment at 1 interconnect location. No uptime SLA from Google.',
    minConnections: 1,
    minLocations: 1,
    locationConstraint: 'Any 1 interconnect location',
    details: ['1 VLAN attachment', 'No uptime SLA', 'Development/testing only'],
  },
  geo: {
    providerName: '99.9% Production',
    sla: '99.9%',
    architecture: '2 VLAN attachments in the same metro, in different edge availability domains.',
    minConnections: 2,
    minLocations: 1,
    locationConstraint: 'Same metro, different edge availability domains',
    details: ['2 attachments, same metro', 'Different edge availability domains required', '99.9% SLA'],
  },
  maximum: {
    providerName: '99.99% Critical Production',
    sla: '99.99%',
    architecture: '4 VLAN attachments across 2 metros, each pair in different edge availability domains.',
    minConnections: 4,
    minLocations: 2,
    locationConstraint: '2 different metros, each with different edge availability domains',
    details: ['4 attachments, 2 metros', 'Edge availability domain diversity per metro', '99.99% SLA'],
  },
};

const ORACLE_TIERS: Record<Tier, ResiliencyTierConfig> = {
  local: {
    providerName: 'Single Circuit',
    sla: 'None',
    architecture: '1 virtual circuit at 1 FastConnect location. No SLA guaranteed.',
    minConnections: 1,
    minLocations: 1,
    locationConstraint: 'Any 1 FastConnect location',
    details: ['1 virtual circuit', 'No SLA', 'Single point of failure'],
  },
  geo: {
    providerName: 'Redundant',
    sla: '99.9%',
    architecture: '2 virtual circuits at the same FastConnect location on different physical devices. Requires redundant BGP peers.',
    minConnections: 2,
    minLocations: 1,
    locationConstraint: 'Same location, different physical devices',
    details: ['2 circuits, same location', 'Different physical devices', '99.9% SLA with redundant BGP'],
  },
  maximum: {
    providerName: 'Location-Diverse',
    sla: '99.9%+',
    architecture: '2+ virtual circuits at different FastConnect locations. Partner diversity optional.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2+ different FastConnect locations',
    details: ['2+ circuits, different locations', 'Full location diversity', 'Partner diversity optional'],
  },
};

// Default tiers for providers without specific resiliency data
const DEFAULT_TIERS: Record<Tier, ResiliencyTierConfig> = {
  local: {
    providerName: 'Standard',
    sla: '99.9%',
    architecture: 'Single connection at one location with standard redundancy.',
    minConnections: 1,
    minLocations: 1,
    locationConstraint: '1 location',
    details: ['Single connection', 'Standard redundancy', 'Cost-effective'],
  },
  geo: {
    providerName: 'Geographic',
    sla: '99.95%',
    architecture: 'Connections across two locations for geographic redundancy.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2 different locations',
    details: ['Geographic redundancy', 'Location failover', 'Enterprise-grade'],
  },
  maximum: {
    providerName: 'Maximum',
    sla: '99.99%',
    architecture: 'Fully redundant connections across multiple locations.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2+ locations with full redundancy',
    details: ['Full redundancy', 'Maximum availability', 'Mission-critical workloads'],
  },
};

const PROVIDER_TIERS: Record<string, Record<Tier, ResiliencyTierConfig>> = {
  'AWS': AWS_TIERS,
  'Azure': AZURE_TIERS,
  'Google': GOOGLE_TIERS,
  'Oracle': ORACLE_TIERS,
};

/**
 * Get resiliency tier configuration for a specific provider.
 * Falls back to default tiers for providers without specific data.
 */
export function getResiliencyConfig(provider: string, tier: Tier): ResiliencyTierConfig {
  const providerTiers = PROVIDER_TIERS[provider];
  if (providerTiers) return providerTiers[tier];
  return DEFAULT_TIERS[tier];
}

/**
 * Get all three tier configs for a provider.
 */
export function getAllResiliencyTiers(provider: string): Record<Tier, ResiliencyTierConfig> {
  return PROVIDER_TIERS[provider] || DEFAULT_TIERS;
}

/**
 * Get the minimum location count for a provider + tier combination.
 * Used by the location selection step for validation.
 */
export function getMinLocations(provider: string, tier: Tier): number {
  const config = getResiliencyConfig(provider, tier);
  return config.minLocations;
}
