/**
 * Provider-specific resiliency tier configurations.
 *
 * VERIFIED FROM PROVIDER DOCUMENTATION (April 2026):
 *
 * KEY TERMINOLOGY:
 * - Region: Cloud provider's logical deployment (us-east-1, East US, us-central1)
 * - Metro: Metropolitan area with one or more physical sites (Ashburn VA metro, NYC metro)
 * - Location/Site: Specific datacenter building (Equinix DC2, CoreSite LA1)
 * - Device: Physical AWS/Azure/Google/Oracle router at a location
 *
 * AWS Direct Connect:
 * - Direct Connect locations are physical datacenter sites (NOT regions)
 * - Multiple locations can exist within one metro (e.g., Equinix DC2 + Digital Realty in Ashburn)
 * - Direct Connect Gateway lets you reach ANY region from ANY location
 * - Maximum Resiliency = connections on separate devices in MORE THAN ONE location
 *   (4 connections minimum: 2 per location, on different devices, across 2+ locations)
 *   All locations can be in the same metro or different metros
 *   Source: https://aws.amazon.com/directconnect/resiliency-recommendation/
 *
 * Azure ExpressRoute:
 * - Each circuit has built-in primary + secondary (active-active to 2 MSEEs)
 * - Peering locations are physical sites, NOT Azure regions
 * - Many metros have 2 peering locations (e.g., Amsterdam & Amsterdam2)
 * - Same-metro redundancy: 2 circuits at different peering locations in same metro
 * - Cross-metro redundancy: 2 circuits at peering locations in different metros
 *   (requires Premium SKU if different geopolitical regions)
 *   Source: https://learn.microsoft.com/en-us/azure/expressroute/designing-for-high-availability-with-expressroute
 *
 * Google Cloud Interconnect:
 * - Interconnect locations have edge availability domains (zones within a site)
 * - 99.9% SLA: 2 attachments in same metro, different edge availability domains
 * - 99.99% SLA: attachments in 2 different metros, each with domain diversity
 *   Source: https://cloud.google.com/network-connectivity/docs/interconnect/sla
 *
 * Oracle FastConnect:
 * - Redundant = 2 virtual circuits at same location on different devices
 * - Location-diverse = circuits at different FastConnect locations
 * - 99.9% SLA requires redundant connections with redundant BGP peers
 *   Source: https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/fastconnectresiliency.htm
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
    sla: 'No SLA',
    architecture: 'Connections on separate devices at a single Direct Connect location. Protects against device failure only.',
    minConnections: 2,
    minLocations: 1,
    locationConstraint: '1 Direct Connect location, separate devices',
    details: [
      '2 connections on separate devices',
      'Single Direct Connect location',
      'Device failure protection only',
      'NOT recommended for production',
    ],
  },
  geo: {
    providerName: 'High Resiliency',
    sla: '99.9%',
    architecture: 'One connection at each of two or more Direct Connect locations. Protects against location failure.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2+ Direct Connect locations, 1 connection each',
    details: [
      '2+ connections across 2+ locations',
      'Location failure protection',
      'Can be same metro or different metros',
      'Recommended for non-critical production',
    ],
  },
  maximum: {
    providerName: 'Maximum Resiliency',
    sla: '99.99%',
    architecture: 'Connections on separate devices at two or more Direct Connect locations. Protects against device, connectivity, and location failures.',
    minConnections: 4,
    minLocations: 2,
    locationConstraint: '2+ Direct Connect locations, 2 connections on separate devices per location',
    details: [
      '4+ connections: 2 per location on separate devices',
      '2+ Direct Connect locations',
      'Full device + location redundancy',
      'Recommended for all production workloads',
    ],
  },
};

const AZURE_TIERS: Record<Tier, ResiliencyTierConfig> = {
  local: {
    providerName: 'Single Circuit',
    sla: '99.95%',
    architecture: 'One ExpressRoute circuit with built-in primary and secondary connections (active-active to 2 MSEEs) at one peering location.',
    minConnections: 1,
    minLocations: 1,
    locationConstraint: '1 peering location',
    details: [
      '1 circuit with primary + secondary (built-in)',
      'Active-active to 2 Microsoft Edge routers',
      'Single peering location',
      'No protection against location failure',
    ],
  },
  geo: {
    providerName: 'Same-Metro Redundancy',
    sla: '99.95%',
    architecture: 'Two ExpressRoute circuits at two peering locations in the same metro. Low-latency failover.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2 peering locations in same metro (e.g., Amsterdam + Amsterdam2)',
    details: [
      '2 circuits at 2 peering locations',
      'Same metropolitan area',
      'Low-latency failover',
      'Protection against single-location failure',
    ],
  },
  maximum: {
    providerName: 'Cross-Metro Redundancy',
    sla: '99.99%',
    architecture: 'Two ExpressRoute circuits at peering locations in different metros. Full geographic diversity. Premium SKU needed if different geopolitical regions.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2 peering locations in different metros',
    details: [
      '2 circuits in different metros',
      'Full geographic diversity',
      'Premium SKU if crossing geopolitical boundary',
      'Zone-redundant gateways recommended',
    ],
  },
};

const GOOGLE_TIERS: Record<Tier, ResiliencyTierConfig> = {
  local: {
    providerName: 'No SLA',
    sla: 'None',
    architecture: 'Single VLAN attachment at one interconnect location. No uptime SLA from Google.',
    minConnections: 1,
    minLocations: 1,
    locationConstraint: '1 interconnect location',
    details: [
      '1 VLAN attachment',
      'No uptime SLA',
      'Development and testing only',
    ],
  },
  geo: {
    providerName: '99.9% Production',
    sla: '99.9%',
    architecture: 'Two VLAN attachments in the same metro, in different edge availability domains.',
    minConnections: 2,
    minLocations: 1,
    locationConstraint: 'Same metro, different edge availability domains',
    details: [
      '2 attachments in same metro',
      'MUST be in different edge availability domains',
      '99.9% uptime SLA',
    ],
  },
  maximum: {
    providerName: '99.99% Critical Production',
    sla: '99.99%',
    architecture: 'VLAN attachments across two different metros, each pair in different edge availability domains.',
    minConnections: 4,
    minLocations: 2,
    locationConstraint: '2 different metros, each with different edge availability domains',
    details: [
      '4 attachments across 2 metros',
      'Edge availability domain diversity per metro',
      '99.99% uptime SLA',
      'Required for critical production workloads',
    ],
  },
};

const ORACLE_TIERS: Record<Tier, ResiliencyTierConfig> = {
  local: {
    providerName: 'Single Circuit',
    sla: 'None',
    architecture: 'One virtual circuit at one FastConnect location. No SLA guaranteed.',
    minConnections: 1,
    minLocations: 1,
    locationConstraint: '1 FastConnect location',
    details: [
      '1 virtual circuit',
      'No SLA guaranteed',
      'Single point of failure',
    ],
  },
  geo: {
    providerName: 'Redundant',
    sla: '99.9%',
    architecture: 'Two virtual circuits at the same FastConnect location on different physical devices. Requires redundant BGP peers.',
    minConnections: 2,
    minLocations: 1,
    locationConstraint: 'Same FastConnect location, different physical devices',
    details: [
      '2 circuits on different devices',
      'Same FastConnect location',
      '99.9% SLA with redundant BGP',
      'Device failure protection',
    ],
  },
  maximum: {
    providerName: 'Location-Diverse',
    sla: '99.9%+',
    architecture: 'Two or more virtual circuits at different FastConnect locations. Partner diversity optional.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2+ different FastConnect locations',
    details: [
      '2+ circuits at different locations',
      'Full location diversity',
      'Partner diversity optional',
      'Maximum fault tolerance',
    ],
  },
};

const DEFAULT_TIERS: Record<Tier, ResiliencyTierConfig> = {
  local: {
    providerName: 'Standard',
    sla: '99.9%',
    architecture: 'Single connection at one location.',
    minConnections: 1,
    minLocations: 1,
    locationConstraint: '1 location',
    details: ['Single connection', 'Standard redundancy'],
  },
  geo: {
    providerName: 'Geographic',
    sla: '99.95%',
    architecture: 'Connections across two locations.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2 locations',
    details: ['Geographic redundancy', 'Location failover'],
  },
  maximum: {
    providerName: 'Maximum',
    sla: '99.99%',
    architecture: 'Fully redundant connections across multiple locations.',
    minConnections: 2,
    minLocations: 2,
    locationConstraint: '2+ locations with full redundancy',
    details: ['Full redundancy', 'Maximum availability'],
  },
};

const PROVIDER_TIERS: Record<string, Record<Tier, ResiliencyTierConfig>> = {
  'AWS': AWS_TIERS,
  'Azure': AZURE_TIERS,
  'Google': GOOGLE_TIERS,
  'Oracle': ORACLE_TIERS,
};

export function getResiliencyConfig(provider: string, tier: Tier): ResiliencyTierConfig {
  const providerTiers = PROVIDER_TIERS[provider];
  if (providerTiers) return providerTiers[tier];
  return DEFAULT_TIERS[tier];
}

export function getAllResiliencyTiers(provider: string): Record<Tier, ResiliencyTierConfig> {
  return PROVIDER_TIERS[provider] || DEFAULT_TIERS;
}

export function getMinLocations(provider: string, tier: Tier): number {
  const config = getResiliencyConfig(provider, tier);
  return config.minLocations;
}
