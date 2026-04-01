/**
 * Which AT&T connection types each provider supports.
 *
 * Decision tree rules:
 * - Major cloud providers (AWS, Azure, Google, Oracle): all 4 active types
 * - IBM: Internet to Cloud and VPN only (no Direct Connect equivalent for DC/Colo)
 * - DC/Colo providers (Equinix, CoreSite, etc.): DC/Colo to Cloud primarily
 * - Site to Cloud: disabled for all (Coming Soon)
 */

export const PROVIDER_CONNECTION_TYPES: Record<string, string[]> = {
  'AWS': ['Internet to Cloud', 'Cloud to Cloud', 'DataCenter/CoLocation to Cloud', 'VPN to Cloud'],
  'Azure': ['Internet to Cloud', 'Cloud to Cloud', 'DataCenter/CoLocation to Cloud', 'VPN to Cloud'],
  'Google': ['Internet to Cloud', 'Cloud to Cloud', 'DataCenter/CoLocation to Cloud', 'VPN to Cloud'],
  'Oracle': ['Internet to Cloud', 'Cloud to Cloud', 'DataCenter/CoLocation to Cloud', 'VPN to Cloud'],
  'IBM': ['Internet to Cloud', 'VPN to Cloud'],
  'Equinix': ['DataCenter/CoLocation to Cloud', 'Internet to Cloud'],
  'Digital Realty': ['DataCenter/CoLocation to Cloud', 'Internet to Cloud'],
  'Centersquare': ['DataCenter/CoLocation to Cloud'],
  'CoreSite': ['DataCenter/CoLocation to Cloud', 'Internet to Cloud'],
  'DataBank': ['DataCenter/CoLocation to Cloud'],
  'Cisco Jasper': ['DataCenter/CoLocation to Cloud', 'Internet to Cloud'],
};

/**
 * Get available connection types for selected provider(s).
 * When multiple providers are selected, returns the intersection.
 */
export function getAvailableConnectionTypes(providers: string[]): string[] {
  if (providers.length === 0) {
    return ['Internet to Cloud', 'Cloud to Cloud', 'DataCenter/CoLocation to Cloud', 'VPN to Cloud'];
  }

  const sets = providers.map(p => new Set(PROVIDER_CONNECTION_TYPES[p] || ['Internet to Cloud', 'VPN to Cloud']));
  const first = sets[0];
  return Array.from(first).filter(type => sets.every(s => s.has(type)));
}
