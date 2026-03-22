// Sample data for testing UI components
import { Connection, User, Alert } from '../types';
import { Group, GroupAddress, GroupContact } from '../types/group';

// Define reusable data fragments to avoid repetition
const defaultSecurity = {
  encryption: 'AES-256',
  firewall: true,
  ddosProtection: true,
  ipSecEnabled: true
};

const defaultFeatures = {
  dedicatedConnection: true,
  redundantPath: false,
  autoScaling: false,
  loadBalancing: false
};

// Performance data factory to create consistent performance metrics
const createPerformanceData = (
  latency: string,
  packetLoss: string,
  uptime: string,
  bandwidthUtil: number
) => ({
  latency,
  packetLoss,
  uptime: uptime,
  tunnels: bandwidthUtil > 0 ? 'Active' : 'Inactive',
  bandwidthUtilization: bandwidthUtil,
  currentUsage: `${bandwidthUtil / 10} Gbps`,
  utilizationTrend: Array(7).fill(0).map((_, i) => Math.max(0, Math.min(100, bandwidthUtil + (Math.random() * 4 - 2))))
});

// Billing data factory to create billing info with less duplication
const createBillingData = (
  baseFee: number,
  usage: number,
  lastBill?: string,
  nextBill?: string,
  additionalServices: {name: string, cost: number}[] = []
) => ({
  baseFee,
  usage,
  total: baseFee + usage + additionalServices.reduce((sum, service) => sum + service.cost, 0),
  currency: 'USD',
  lastBill: lastBill || '2024-02-01T00:00:00Z',
  nextBill: nextBill || '2024-04-01T00:00:00Z',
  additionalServices
});

// Sample connections with optimized structure
export const sampleConnections: Connection[] = [
  {
    id: 'conn-aws-pending-1',
    name: 'NetBond Cloud -AWS Direct Connect',
    type: 'Internet to Cloud',
    status: 'Pending',
    bandwidth: '1 Gbps',
    location: 'Ashburn, VA',
    provider: 'AWS',
    locations: ['Ashburn, VA'],
    cloudRouterCount: 0,
    linkCount: 0,
    primaryIPE: 'Not configured',
    ipeRedundancy: false,
    createdAt: new Date().toISOString(),
    origin: {
      source: 'aws-marketplace',
      requestId: 'AWS-REQ-789012',
      externalAccountId: '123456789012',
      initiatedAt: new Date().toISOString(),
      metadata: {
        region: 'us-east-1',
        awsConnectionId: 'dxcon-fgh5678',
        vlan: 1234
      }
    },
    performance: {
      latency: 'N/A',
      packetLoss: 'N/A',
      uptime: 'N/A',
      throughput: 'N/A',
      tunnels: 'Not configured',
      bandwidthUtilization: 0,
      currentUsage: '0 Gbps',
      utilizationTrend: [0, 0, 0, 0, 0, 0, 0]
    },
    features: defaultFeatures,
    security: defaultSecurity,
    billing: {
      baseFee: 1500,
      usage: 0,
      total: 1500,
      currency: 'USD',
      lastBill: undefined,
      nextBill: undefined
    },
  },
  {
    id: 'conn-1',
    name: 'NetBond Cloud -AWS East Production',
    type: 'Internet to Cloud',
    status: 'Active',
    bandwidth: '10 Gbps',
    location: 'Ashburn, VA',
    provider: 'AWS',
    locations: ['Ashburn, VA'],
    cloudRouterCount: 2,
    linkCount: 4,
    primaryIPE: 'EWR-2',
    secondaryIPE: 'ATL-1',
    ipeRedundancy: true,
    createdAt: '2025-01-15T00:00:00Z',
    performance: createPerformanceData('3.8ms', '0.01%', '99.99%', 87),
    features: { ...defaultFeatures, redundantPath: true, loadBalancing: true },
    security: defaultSecurity,
    billing: createBillingData(2200.00, 480.50, '2026-02-01T00:00:00Z', '2026-04-01T00:00:00Z', [
      { name: 'DDoS Protection', cost: 199.99 },
      { name: 'Advanced Monitoring', cost: 150.0 }
    ]),
  },
  {
    id: 'conn-2',
    name: 'NetBond Cloud -Azure ExpressRoute Central',
    type: 'Cloud to Cloud',
    status: 'Active',
    bandwidth: '10 Gbps',
    location: 'Dallas, TX',
    provider: 'Azure',
    providers: ['Azure', 'AWS'],
    locations: ['Dallas, TX', 'Chicago, IL'],
    cloudRouterCount: 3,
    linkCount: 6,
    primaryIPE: 'DFW-1',
    secondaryIPE: 'ORD-1',
    ipeRedundancy: true,
    createdAt: '2025-02-01T00:00:00Z',
    performance: createPerformanceData('5.2ms', '0.02%', '99.97%', 78),
    features: { ...defaultFeatures, autoScaling: true, loadBalancing: true },
    security: defaultSecurity,
    billing: createBillingData(2200.00, 360.75, '2026-02-01T00:00:00Z', '2026-04-01T00:00:00Z', [
      { name: 'Advanced Monitoring', cost: 150.0 }
    ]),
  },
  {
    id: 'conn-3',
    name: 'Dedicated Internet -Multi-Cloud Backbone',
    type: 'DataCenter/CoLocation to Cloud',
    status: 'Active',
    bandwidth: '100 Gbps',
    location: 'New York, NY',
    providers: ['AWS', 'Azure', 'Google Cloud'],
    locations: ['New York, NY', 'Chicago, IL', 'Los Angeles, CA', 'Atlanta, GA'],
    datacenters: ['Equinix NY5', 'CoreSite CH1', 'Digital Realty LAX10', 'Colo Atl ATL1'],
    cloudRouterCount: 5,
    linkCount: 12,
    primaryIPE: 'EWR-1',
    ipeRedundancy: false,
    createdAt: '2025-03-01T00:00:00Z',
    performance: createPerformanceData('2.1ms', '0.005%', '99.99%', 73),
    features: { ...defaultFeatures, autoScaling: true, redundantPath: true },
    security: defaultSecurity,
    billing: createBillingData(8500.00, 1240.00, '2026-02-01T00:00:00Z', '2026-04-01T00:00:00Z', [
      { name: 'Premium Support', cost: 500.0 },
      { name: 'Advanced Monitoring', cost: 250.0 }
    ]),
  },
  {
    id: 'conn-4',
    name: 'MPLS VPN -Google Cloud Interconnect West',
    type: 'Internet to Cloud',
    status: 'Active',
    bandwidth: '10 Gbps',
    location: 'Los Angeles, CA',
    provider: 'Google Cloud',
    locations: ['Los Angeles, CA', 'Seattle, WA'],
    cloudRouterCount: 2,
    linkCount: 3,
    primaryIPE: 'LAX-1',
    secondaryIPE: 'SEA-2',
    ipeRedundancy: true,
    createdAt: '2025-04-10T00:00:00Z',
    performance: createPerformanceData('4.5ms', '0.015%', '99.98%', 65),
    features: { ...defaultFeatures, redundantPath: true },
    security: defaultSecurity,
    billing: createBillingData(2200.00, 295.00, '2026-02-01T00:00:00Z', '2026-04-01T00:00:00Z', [
      { name: 'Advanced Monitoring', cost: 150.0 }
    ]),
  },
  {
    id: 'conn-5',
    name: 'NetBond Cloud -Oracle Cloud Chicago',
    type: 'DataCenter/CoLocation to Cloud',
    status: 'Inactive',
    bandwidth: '1 Gbps',
    location: 'Chicago, IL',
    provider: 'Oracle Cloud',
    locations: ['Chicago, IL'],
    datacenters: ['Equinix CH4'],
    cloudRouterCount: 1,
    linkCount: 2,
    primaryIPE: 'ORD-2',
    ipeRedundancy: false,
    createdAt: '2025-06-20T00:00:00Z',
    performance: createPerformanceData('N/A', 'N/A', 'N/A', 0),
    features: defaultFeatures,
    security: defaultSecurity,
    billing: createBillingData(1500.00, 0, '2026-02-01T00:00:00Z', '2026-04-01T00:00:00Z', []),
  },
];

// Factory function to create connection access objects consistently
const createConnectionAccess = (connectionId: string, name: string, permissions: string[]) => ({
  connectionId,
  name,
  permissions
});

// Sample users organized by connection
// AWS Direct Connect users
const awsUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@att.com',
    role: 'Network Administrator',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-1', 'NetBond Cloud -AWS East Production', ['view', 'manage', 'monitor', 'configure'])],
  },
  {
    id: 'user-2',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@att.com',
    role: 'Cloud Architect',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-1', 'NetBond Cloud -AWS East Production', ['view', 'monitor', 'configure'])],
  },
];

// Azure / multi-cloud users
const azureUsers: User[] = [
  {
    id: 'user-3',
    name: 'David Kim',
    email: 'david.kim@att.com',
    role: 'Security Engineer',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-2', 'NetBond Cloud -Azure ExpressRoute Central', ['view', 'manage', 'monitor', 'configure'])],
  },
  {
    id: 'user-4',
    name: 'Lisa Martinez',
    email: 'lisa.martinez@att.com',
    role: 'Operations Manager',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-2', 'NetBond Cloud -Azure ExpressRoute Central', ['view', 'monitor', 'configure'])],
  },
];

// Google Cloud / backbone users
const googleUsers: User[] = [
  {
    id: 'user-5',
    name: 'Thomas Anderson',
    email: 'thomas.anderson@att.com',
    role: 'Platform Engineer',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-3', 'Dedicated Internet -Multi-Cloud Backbone', ['view', 'manage', 'monitor', 'configure'])],
  },
  {
    id: 'user-6',
    name: 'Sophia Lee',
    email: 'sophia.lee@att.com',
    role: 'DevOps Lead',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-3', 'Dedicated Internet -Multi-Cloud Backbone', ['view', 'monitor', 'configure'])],
  },
];

// Combine all users with an efficient reference
export const sampleUsers: User[] = [...awsUsers, ...azureUsers, ...googleUsers];

// Reusable address and contact data
const sampleAddresses: GroupAddress[] = [
  {
    street: '208 S Akard St',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75202',
    country: 'United States',
    isPrimary: true
  },
  {
    street: '1 AT&T Way',
    city: 'Bedminster',
    state: 'NJ',
    zipCode: '07921',
    country: 'United States',
    isPrimary: false
  }
];

// Reusable contact information
const sampleContacts: GroupContact[] = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(214) 555-1234',
    role: 'IT Director',
    isPrimary: true
  },
  {
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    phone: '(214) 555-5678',
    role: 'Network Manager',
    isPrimary: false
  }
];

// Performance and billing data factories for groups
const createGroupPerformanceData = () => ({
  aggregatedMetrics: {
    averageLatency: '4.5ms',
    averagePacketLoss: '0.015%',
    averageUptime: '99.97%',
    totalBandwidth: '20 Gbps',
    bandwidthUtilization: 80,
    totalTraffic: '1.8 TB'
  },
  historicalData: [] // Would be filled with actual historical data
});

const createGroupBillingData = (rate: number) => ({
  billingId: `bill-${Date.now()}`,
  planName: rate > 2000 ? 'Enterprise Plus' : 'Enterprise Standard',
  monthlyRate: rate,
  annualDiscount: 10,
  currency: 'USD',
  billingCycle: 'monthly',
  paymentMethod: rate > 2000 ? 'credit_card' : 'invoice',
  lastInvoiceDate: '2024-03-01T00:00:00Z',
  nextInvoiceDate: '2024-04-01T00:00:00Z'
});

// Sample groups with optimized structure
export const sampleGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Enterprise Cloud Infrastructure',
    description: 'Core cloud infrastructure connections supporting production enterprise workloads across AWS and Azure',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
    type: 'department',
    status: 'active',
    addresses: [sampleAddresses[0]],
    contacts: [sampleContacts[0]],
    connectionIds: ['conn-1', 'conn-2'],
    userIds: ['user-1', 'user-2', 'user-3', 'user-4'],
    ownerId: 'user-1',
    permissions: {
      read: ['user-1', 'user-2', 'user-3', 'user-4'],
      write: ['user-1', 'user-3'],
      admin: ['user-1']
    },
    tags: {
      'department': 'engineering',
      'environment': 'production',
      'costCenter': 'CC-NET-001'
    },
    billing: createGroupBillingData(5530.24),
    performance: {
      aggregatedMetrics: {
        averageLatency: '4.5ms',
        averagePacketLoss: '0.015%',
        averageUptime: '99.98%',
        totalBandwidth: '20 Gbps',
        bandwidthUtilization: 83,
        totalTraffic: '3.2 TB'
      },
      historicalData: []
    }
  },
  {
    id: 'group-2',
    name: 'Network Operations Center',
    description: 'NOC team responsible for 24x7 monitoring and incident response across all NetBond connections',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
    type: 'team',
    status: 'active',
    addresses: [sampleAddresses[1]],
    contacts: [sampleContacts[1]],
    connectionIds: ['conn-3', 'conn-4'],
    userIds: ['user-5', 'user-6'],
    ownerId: 'user-5',
    permissions: {
      read: ['user-5', 'user-6'],
      write: ['user-5'],
      admin: ['user-5']
    },
    tags: {
      'department': 'operations',
      'environment': 'production',
      'costCenter': 'CC-OPS-002'
    },
    billing: createGroupBillingData(11685.00),
    performance: {
      aggregatedMetrics: {
        averageLatency: '3.3ms',
        averagePacketLoss: '0.008%',
        averageUptime: '99.99%',
        totalBandwidth: '110 Gbps',
        bandwidthUtilization: 71,
        totalTraffic: '18.4 TB'
      },
      historicalData: []
    }
  },
  {
    id: 'group-3',
    name: 'Q1 2026 Migration Project',
    description: 'Oracle Cloud onboarding and legacy MPLS cutover - target completion March 31, 2026',
    createdAt: '2026-01-06T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    type: 'project',
    status: 'active',
    parentGroupId: 'group-1',
    addresses: [],
    contacts: [],
    connectionIds: ['conn-5'],
    userIds: ['user-2', 'user-4', 'user-6'],
    ownerId: 'user-2',
    permissions: {
      read: ['user-1', 'user-2', 'user-4', 'user-6'],
      write: ['user-2', 'user-6'],
      admin: ['user-2']
    },
    tags: {
      'department': 'engineering',
      'environment': 'staging',
      'costCenter': 'CC-PROJ-2026-01'
    }
  }
];

// Sample alerts with realistic AT&T network scenarios
export const sampleAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    title: 'High Latency - AWS Direct Connect ATL-1',
    message: 'Latency on conn-1 secondary path (ATL-1) has exceeded 45ms threshold. Current: 52ms. Primary path (EWR-2) unaffected.',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    connectionId: 'conn-1'
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'BGP Session Flap - Azure ExpressRoute DFW-1',
    message: 'BGP session on conn-2 primary IPE (DFW-1) experienced 3 flaps in the last 30 minutes. Session currently stable. Monitor for recurrence.',
    timestamp: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
    connectionId: 'conn-2'
  },
  {
    id: 'alert-3',
    type: 'warning',
    title: 'Bandwidth Utilization Near Threshold',
    message: 'conn-1 (NetBond Cloud -AWS East Production) bandwidth utilization reached 89% of 10 Gbps capacity. Consider upgrading to 100 Gbps.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    connectionId: 'conn-1'
  },
  {
    id: 'alert-4',
    type: 'info',
    title: 'Scheduled Maintenance - EWR-1 IPE',
    message: 'AT&T scheduled maintenance window for EWR-1 IPE: 2026-03-28 02:00-04:00 ET. conn-3 will fail over to redundant path. No customer action required.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    connectionId: 'conn-3'
  },
  {
    id: 'alert-5',
    type: 'info',
    title: 'Packet Loss Spike Resolved - Google Cloud Interconnect',
    message: 'Brief packet loss event on conn-4 (LAX-1) resolved. Peak loss was 0.04% for approximately 90 seconds at 14:32 ET. Root cause: upstream fiber splice.',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    connectionId: 'conn-4'
  }
];