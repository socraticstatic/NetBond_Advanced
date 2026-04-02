/**
 * LMCC (Last Mile Cloud Connectivity) Type Definitions
 *
 * LMCC is AT&T's automated maximum resiliency interconnect product for AWS.
 * It is NOT a VNF. It IS the connection.
 *
 * LMCC orchestrates 4 hosted connections across 4 IPEs (Juniper MX-304)
 * in 2 diverse datacenters within 1 metro. The customer initiates from
 * the AWS Console by selecting Maximum Resiliency + Metro + AT&T as partner.
 * AT&T's backend automation handles the rest.
 *
 * Source of truth: references/lmcc-product-brief.md
 */

// --- Metro ---

export type LMCCPhase = 'preview' | 'ga';

export interface LMCCMetro {
  id: string;
  name: string;            // "San Jose, CA" | "Los Angeles, CA" | "Ashburn, VA"
  datacenters: string[];   // 2 diverse sites per metro
  facilities: string[];    // "Equinix" | "CoreSite"
  phase: LMCCPhase;
}

// --- Path (one of 4 per LMCC connection) ---

export type BGPState =
  | 'idle'
  | 'connect'
  | 'active'
  | 'open-sent'
  | 'open-confirm'
  | 'established';

export type LMCCPathStatus = 'pending' | 'active' | 'down';

export interface LMCCPath {
  id: string;
  ipeId: string;              // Juniper MX-304 identifier
  datacenter: string;         // e.g. "Equinix SV1"
  awsConnectionId: string;    // AWS Direct Connect connection ID
  vlanId: number;             // AWS-assigned 802.1Q VLAN ID
  bgpState: BGPState;
  physicalPort: string;       // 100G port identifier
  status: LMCCPathStatus;
}

// --- Contract ---

export type LMCCContractType =
  | 'trial'       // Preview phase only, zero-penalty disconnect
  | 'monthly'     // Month-to-month, immediate hard delete
  | 'fixed-12'    // 12-month term, ETF if early
  | 'fixed-24'    // 24-month term, ETF if early
  | 'fixed-36';   // 36-month term, ETF if early

// --- Connection ---

export type LMCCConnectionStatus =
  | 'pending-acceptance'  // 4 connections in AWS Console awaiting Accept
  | 'provisioning'        // Customer accepted, AT&T configuring sub-interfaces
  | 'active'              // All 4 BGP sessions established
  | 'degraded'            // 1-3 paths down but service operational
  | 'disconnected';       // All paths down or connection deleted

export interface LMCCBilling {
  trigger: 'bgp-established';          // Revenue starts when BGP reaches Established
  startedAt?: string;                  // ISO timestamp of first BGP establishment
  contractEndDate?: string;            // ISO timestamp for fixed-term contracts
  model: 'fixed-rate' | 'burstable';   // Preview: fixed-rate. GA: 95th percentile burstable
}

export interface LMCCBGP {
  partnerASN: number;      // AT&T's ASN
  customerASN: number;     // Customer's ASN
  md5Key?: string;         // BGP authentication key
}

export interface LMCCBFD {
  interval: 100;           // BFD interval in ms (always 100ms)
  multiplier: 3;           // Detect multiplier (3x100ms = 300ms failover)
}

export interface LMCCConnection {
  id: string;
  awsAccountId: string;
  metro: LMCCMetro;
  status: LMCCConnectionStatus;
  contractType: LMCCContractType;
  bandwidth: number;         // Mbps - single value, same for all 4 paths
  transport: 'mpls' | 'internet';  // Preview: MPLS only. GA: MPLS or Internet.
  paths: [LMCCPath, LMCCPath, LMCCPath, LMCCPath]; // Always exactly 4
  bgp: LMCCBGP;
  bfd: LMCCBFD;
  billing: LMCCBilling;
  createdAt: string;
  updatedAt: string;
}

// --- Phase capabilities ---

export interface LMCCPhaseConfig {
  phase: LMCCPhase;
  availableMetros: string[];        // Metro IDs available in this phase
  bandwidthOptions: number[];       // Mbps values
  contractTypes: LMCCContractType[];
  transports: ('mpls' | 'internet')[];
  operations: ('create' | 'read' | 'update' | 'delete')[];
}
