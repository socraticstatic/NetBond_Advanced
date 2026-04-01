/**
 * Provider locations for the wizard.
 *
 * CRITICAL DISTINCTION:
 * - AWS, Azure, Google, Oracle: These are physical interconnect LOCATIONS
 *   (datacenters where AT&T's IPE connects), NOT cloud provider regions.
 * - IBM, Equinix, Digital Realty, etc.: Already physical locations.
 *
 * The "servesRegions" field shows which cloud regions a location connects to,
 * displayed as help text in the wizard.
 */

export interface ProviderLocation {
  label: string;
  servesRegions?: string[];
}

export const PROVIDER_LOCATIONS: Record<string, ProviderLocation[]> = {
  'AWS': [
    { label: 'Ashburn, VA (Equinix)', servesRegions: ['us-east-1'] },
    { label: 'Columbus, OH (Cologix)', servesRegions: ['us-east-2'] },
    { label: 'Chicago, IL (CoreSite)', servesRegions: ['us-east-2'] },
    { label: 'Dallas, TX (Equinix)', servesRegions: ['us-east-1', 'us-west-2'] },
    { label: 'Los Angeles, CA (CoreSite)', servesRegions: ['us-west-2'] },
    { label: 'Portland, OR (Pittock)', servesRegions: ['us-west-2'] },
  ],
  'Azure': [
    { label: 'Ashburn (Equinix)', servesRegions: ['East US', 'East US 2'] },
    { label: 'Chicago (Equinix)', servesRegions: ['North Central US'] },
    { label: 'Dallas (Equinix)', servesRegions: ['South Central US'] },
    { label: 'Los Angeles (CoreSite)', servesRegions: ['West US'] },
    { label: 'San Jose (Equinix)', servesRegions: ['West US 2'] },
    { label: 'Seattle (Equinix)', servesRegions: ['West US 2'] },
  ],
  'Google': [
    { label: 'Ashburn, VA', servesRegions: ['us-east1', 'us-east4'] },
    { label: 'Chicago, IL', servesRegions: ['us-central1'] },
    { label: 'Dallas, TX', servesRegions: ['us-south1'] },
    { label: 'Los Angeles, CA', servesRegions: ['us-west2'] },
    { label: 'New York, NY', servesRegions: ['us-east1'] },
  ],
  'Oracle': [
    { label: 'Ashburn, VA (US East)', servesRegions: ['us-ashburn-1'] },
    { label: 'Phoenix, AZ (US West)', servesRegions: ['us-phoenix-1'] },
    { label: 'Frankfurt (Europe)', servesRegions: ['eu-frankfurt-1'] },
    { label: 'Tokyo (Asia Pacific)', servesRegions: ['ap-tokyo-1'] },
  ],
  'IBM': [
    { label: 'Dallas' },
    { label: 'Washington DC' },
    { label: 'London' },
    { label: 'Frankfurt' },
    { label: 'Tokyo' },
    { label: 'Sydney' },
  ],
  'Equinix': [
    { label: 'New York' },
    { label: 'Chicago' },
    { label: 'Los Angeles' },
    { label: 'London' },
    { label: 'Frankfurt' },
    { label: 'Tokyo' },
    { label: 'Singapore' },
  ],
  'Digital Realty': [
    { label: 'New York Metro' },
    { label: 'Chicago' },
    { label: 'Dallas' },
    { label: 'Los Angeles' },
    { label: 'London' },
    { label: 'Amsterdam' },
  ],
  'Centersquare': [
    { label: 'Atlanta' },
    { label: 'Dallas' },
    { label: 'Denver' },
    { label: 'Phoenix' },
    { label: 'Toronto' },
  ],
  'CoreSite': [
    { label: 'New York' },
    { label: 'Los Angeles' },
    { label: 'Chicago' },
    { label: 'Denver' },
    { label: 'Virginia' },
  ],
  'DataBank': [
    { label: 'Dallas' },
    { label: 'Minneapolis' },
    { label: 'Kansas City' },
    { label: 'Baltimore' },
    { label: 'Salt Lake City' },
  ],
  'Cisco Jasper': [
    { label: 'Ashburn, VA - CenterSquare' },
    { label: 'Columbus, OH - Cologix' },
    { label: 'Lynnwood, WA - CenterSquare' },
    { label: 'Atlanta, GA - QTS' },
    { label: 'Atlanta New DC - Equinix' },
    { label: 'San Jose, CA - Equinix' },
    { label: 'Phoenix, AZ - Digital Realty' },
  ],
};

/**
 * Backward-compatible helper that returns just the label strings.
 * Used by ConnectionConfiguration.tsx which expects string[].
 */
export function getLocationLabels(provider: string): string[] {
  const locations = PROVIDER_LOCATIONS[provider];
  if (!locations) return [];
  return locations.map(l => l.label);
}

/**
 * Get the full location objects for a provider.
 */
export function getLocations(provider: string): ProviderLocation[] {
  return PROVIDER_LOCATIONS[provider] || [];
}
