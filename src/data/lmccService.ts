/**
 * LMCC (Last Mile Cloud Connectivity) Data Layer
 *
 * LMCC is AT&T's automated maximum resiliency interconnect product for AWS.
 * This module provides metro definitions, phase capabilities, and mock
 * connection data for the prototype.
 *
 * Source of truth: references/lmcc-product-brief.md
 */

import {
  LMCCMetro,
  LMCCPhaseConfig,
  LMCCConnection,
  LMCCContractType,
} from '../types/lmcc';

// --- Metro Definitions ---

export const LMCC_METROS: LMCCMetro[] = [
  {
    id: 'metro-sj',
    name: 'San Jose, CA',
    datacenters: ['Equinix SV1', 'Equinix SV5'],
    facilities: ['Equinix'],
    phase: 'preview',
  },
  {
    id: 'metro-la',
    name: 'Los Angeles, CA',
    datacenters: ['Equinix LA1', 'Equinix LA3'],
    facilities: ['Equinix'],
    phase: 'preview',
  },
  {
    id: 'metro-ash',
    name: 'Ashburn, VA',
    datacenters: ['Equinix DC2', 'CoreSite VA1'],
    facilities: ['Equinix', 'CoreSite'],
    phase: 'ga',
  },
];

// GA-expanded metros: San Jose + Ashburn only (LA drops at GA per product brief)
export const LMCC_METROS_GA: LMCCMetro[] = [
  {
    id: 'metro-sj',
    name: 'San Jose, CA',
    datacenters: ['Equinix SV1', 'Equinix SV5', 'CoreSite SV1'],
    facilities: ['Equinix', 'CoreSite'],
    phase: 'ga',
  },
  {
    id: 'metro-ash',
    name: 'Ashburn, VA',
    datacenters: ['Equinix DC2', 'CoreSite VA1'],
    facilities: ['Equinix', 'CoreSite'],
    phase: 'ga',
  },
];

// Phase launch dates
export const PHASE_DATES = {
  preview: 'June 30, 2026',
  ga: 'November 30, 2026',
} as const;

// --- Phase Capabilities ---

export const LMCC_PHASES: Record<'preview' | 'ga', LMCCPhaseConfig> = {
  preview: {
    phase: 'preview',
    availableMetros: ['metro-sj', 'metro-la'],
    bandwidthOptions: [1000],  // Fixed 1 Gbps only
    contractTypes: ['trial'],
    transports: ['mpls'],
    operations: ['create', 'delete'],
  },
  ga: {
    phase: 'ga',
    availableMetros: ['metro-sj', 'metro-ash'],
    bandwidthOptions: [50, 100, 200, 300, 400, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000],
    contractTypes: ['monthly', 'fixed-12', 'fixed-24', 'fixed-36'],
    transports: ['mpls', 'internet'],
    operations: ['create', 'read', 'update', 'delete'],
  },
};

// Current phase for the prototype
export const CURRENT_PHASE: 'preview' | 'ga' = 'preview';

// --- Helpers ---

export function getAvailableMetros(phase?: 'preview' | 'ga'): LMCCMetro[] {
  const p = phase || CURRENT_PHASE;
  const config = LMCC_PHASES[p];
  return LMCC_METROS.filter(m => config.availableMetros.includes(m.id));
}

export function getMetroById(id: string): LMCCMetro | undefined {
  return LMCC_METROS.find(m => m.id === id);
}

export function getBandwidthOptions(phase?: 'preview' | 'ga'): number[] {
  const p = phase || CURRENT_PHASE;
  return LMCC_PHASES[p].bandwidthOptions;
}

export function getContractTypes(phase?: 'preview' | 'ga'): LMCCContractType[] {
  const p = phase || CURRENT_PHASE;
  return LMCC_PHASES[p].contractTypes;
}

export function formatBandwidth(mbps: number): string {
  if (mbps >= 1000) return `${mbps / 1000} Gbps`;
  return `${mbps} Mbps`;
}

export function getPhaseLabel(phase: 'preview' | 'ga'): string {
  return phase === 'preview' ? `Preview (${PHASE_DATES.preview})` : `GA (${PHASE_DATES.ga})`;
}

export function getPhaseTag(phase: 'preview' | 'ga'): { label: string; color: string; bg: string } {
  return phase === 'preview'
    ? { label: 'Preview - June 2026', color: '#cc7a00', bg: 'rgba(204,122,0,0.16)' }
    : { label: 'GA - November 2026', color: '#2d7e24', bg: 'rgba(45,126,36,0.16)' };
}

// --- Mock Data ---

export const MOCK_LMCC_CONNECTIONS: LMCCConnection[] = [
  {
    id: 'lmcc-001',
    awsAccountId: '123456789012',
    metro: LMCC_METROS[0], // San Jose
    status: 'active',
    contractType: 'trial',
    bandwidth: 1000,
    transport: 'mpls',
    paths: [
      {
        id: 'path-1',
        ipeId: 'MX304-SV1-A',
        datacenter: 'Equinix SV1',
        awsConnectionId: 'dxcon-abc001',
        vlanId: 1001,
        bgpState: 'established',
        physicalPort: '100GE-0/0/0',
        status: 'active',
      },
      {
        id: 'path-2',
        ipeId: 'MX304-SV1-B',
        datacenter: 'Equinix SV1',
        awsConnectionId: 'dxcon-abc002',
        vlanId: 1002,
        bgpState: 'established',
        physicalPort: '100GE-0/0/1',
        status: 'active',
      },
      {
        id: 'path-3',
        ipeId: 'MX304-SV5-A',
        datacenter: 'Equinix SV5',
        awsConnectionId: 'dxcon-abc003',
        vlanId: 1003,
        bgpState: 'established',
        physicalPort: '100GE-0/0/0',
        status: 'active',
      },
      {
        id: 'path-4',
        ipeId: 'MX304-SV5-B',
        datacenter: 'Equinix SV5',
        awsConnectionId: 'dxcon-abc004',
        vlanId: 1004,
        bgpState: 'established',
        physicalPort: '100GE-0/0/1',
        status: 'active',
      },
    ],
    bgp: {
      partnerASN: 7018,     // AT&T's ASN
      customerASN: 65000,
      md5Key: '********',
    },
    bfd: { interval: 100, multiplier: 3 },
    billing: {
      trigger: 'bgp-established',
      startedAt: '2026-07-01T14:30:00Z',
      model: 'fixed-rate',
    },
    createdAt: '2026-07-01T14:00:00Z',
    updatedAt: '2026-07-01T14:30:00Z',
  },
  {
    id: 'lmcc-002',
    awsAccountId: '987654321098',
    metro: LMCC_METROS[1], // Los Angeles
    status: 'pending-acceptance',
    contractType: 'trial',
    bandwidth: 1000,
    transport: 'mpls',
    paths: [
      {
        id: 'path-5',
        ipeId: 'MX304-LA1-A',
        datacenter: 'Equinix LA1',
        awsConnectionId: 'dxcon-def001',
        vlanId: 2001,
        bgpState: 'idle',
        physicalPort: '100GE-0/0/0',
        status: 'pending',
      },
      {
        id: 'path-6',
        ipeId: 'MX304-LA1-B',
        datacenter: 'Equinix LA1',
        awsConnectionId: 'dxcon-def002',
        vlanId: 2002,
        bgpState: 'idle',
        physicalPort: '100GE-0/0/1',
        status: 'pending',
      },
      {
        id: 'path-7',
        ipeId: 'MX304-LA3-A',
        datacenter: 'Equinix LA3',
        awsConnectionId: 'dxcon-def003',
        vlanId: 2003,
        bgpState: 'idle',
        physicalPort: '100GE-0/0/0',
        status: 'pending',
      },
      {
        id: 'path-8',
        ipeId: 'MX304-LA3-B',
        datacenter: 'Equinix LA3',
        awsConnectionId: 'dxcon-def004',
        vlanId: 2004,
        bgpState: 'idle',
        physicalPort: '100GE-0/0/1',
        status: 'pending',
      },
    ],
    bgp: {
      partnerASN: 7018,
      customerASN: 65100,
    },
    bfd: { interval: 100, multiplier: 3 },
    billing: {
      trigger: 'bgp-established',
      model: 'fixed-rate',
    },
    createdAt: '2026-07-15T10:00:00Z',
    updatedAt: '2026-07-15T10:00:00Z',
  },
];
