/**
 * Provider-specific bandwidth tiers.
 *
 * Each provider has different available bandwidth options.
 * AWS Hosted goes to 25G. Google Partner goes to 50G.
 * Oracle partner caps at 10G. Azure caps at 10G (Direct at 100G).
 */

export interface BandwidthOption {
  value: number;
  label: string;
}

const AWS_HOSTED: BandwidthOption[] = [
  { value: 50, label: '50 Mbps' },
  { value: 100, label: '100 Mbps' },
  { value: 200, label: '200 Mbps' },
  { value: 300, label: '300 Mbps' },
  { value: 400, label: '400 Mbps' },
  { value: 500, label: '500 Mbps' },
  { value: 1000, label: '1 Gbps' },
  { value: 2000, label: '2 Gbps' },
  { value: 5000, label: '5 Gbps' },
  { value: 10000, label: '10 Gbps' },
  { value: 25000, label: '25 Gbps' },
];

const AZURE_CIRCUIT: BandwidthOption[] = [
  { value: 50, label: '50 Mbps' },
  { value: 100, label: '100 Mbps' },
  { value: 200, label: '200 Mbps' },
  { value: 500, label: '500 Mbps' },
  { value: 1000, label: '1 Gbps' },
  { value: 2000, label: '2 Gbps' },
  { value: 5000, label: '5 Gbps' },
  { value: 10000, label: '10 Gbps' },
];

const GOOGLE_PARTNER: BandwidthOption[] = [
  { value: 50, label: '50 Mbps' },
  { value: 100, label: '100 Mbps' },
  { value: 200, label: '200 Mbps' },
  { value: 300, label: '300 Mbps' },
  { value: 500, label: '500 Mbps' },
  { value: 1000, label: '1 Gbps' },
  { value: 2000, label: '2 Gbps' },
  { value: 5000, label: '5 Gbps' },
  { value: 10000, label: '10 Gbps' },
  { value: 20000, label: '20 Gbps' },
  { value: 50000, label: '50 Gbps' },
];

const ORACLE_PARTNER: BandwidthOption[] = [
  { value: 1000, label: '1 Gbps' },
  { value: 2000, label: '2 Gbps' },
  { value: 5000, label: '5 Gbps' },
  { value: 10000, label: '10 Gbps' },
];

const DEFAULT_BANDWIDTH: BandwidthOption[] = [
  { value: 100, label: '100 Mbps' },
  { value: 500, label: '500 Mbps' },
  { value: 1000, label: '1 Gbps' },
  { value: 2000, label: '2 Gbps' },
  { value: 5000, label: '5 Gbps' },
  { value: 10000, label: '10 Gbps' },
];

const PROVIDER_BANDWIDTH: Record<string, BandwidthOption[]> = {
  'AWS': AWS_HOSTED,
  'Azure': AZURE_CIRCUIT,
  'Google': GOOGLE_PARTNER,
  'Oracle': ORACLE_PARTNER,
};

/**
 * Get bandwidth options for a specific provider.
 * Falls back to a default set for providers without specific data.
 */
export function getProviderBandwidth(provider: string): BandwidthOption[] {
  return PROVIDER_BANDWIDTH[provider] || DEFAULT_BANDWIDTH;
}
