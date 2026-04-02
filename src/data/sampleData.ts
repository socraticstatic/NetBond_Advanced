// Sample data for testing UI components
import { Connection, User } from '../types';
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
    id: 'conn-lmcc-1',
    name: 'LMCC - San Jose Metro',
    type: 'Internet to Cloud',
    status: 'Active',
    bandwidth: '1 Gbps',
    location: 'San Jose, CA',
    provider: 'AWS',
    locations: ['Equinix SV1', 'Equinix SV5'],
    cloudRouterCount: 4,
    linkCount: 4,
    primaryIPE: 'MX304-SV1-A',
    secondaryIPE: 'MX304-SV5-A',
    ipeRedundancy: true,
    createdAt: '2026-07-01T14:00:00Z',
    configuration: {
      isLmcc: true,
      lmccMetro: 'San Jose, CA',
      lmccDatacenters: ['Equinix SV1', 'Equinix SV5'],
      lmccPaths: 4,
      lmccActivePaths: 4,
      lmccContractType: 'trial',
      lmccTransport: 'mpls',
      resiliencyLevel: 'maximum',
    },
    performance: {
      latency: '<2ms',
      packetLoss: '<0.01%',
      uptime: '99.99%',
      throughput: '85%',
      tunnels: '4/4 Active',
      bandwidthUtilization: 85,
      currentUsage: '0.85 Gbps',
      utilizationTrend: [72, 78, 80, 82, 85, 83, 85]
    },
    features: defaultFeatures,
    security: defaultSecurity,
    billing: createBillingData(4996, 0),
  },
  {
    id: 'conn-aws-pending-1',
    name: 'AWS Interconnect - Last Mile',
    type: 'Internet to Cloud',
    status: 'Pending',
    bandwidth: '1 Gbps',
    location: 'US East',
    provider: 'AWS',
    locations: ['AWS - US East'],
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
      baseFee: 1000,
      usage: 0,
      total: 1000,
      currency: 'USD',
      lastBill: undefined,
      nextBill: undefined
    },
  },
  {
    id: 'conn-1',
    name: 'Corporate Cloud Gateway',
    type: 'Internet to Cloud',
    status: 'Active',
    bandwidth: '10 Gbps',
    location: 'Ashburn, VA',
    provider: 'AWS',
    locations: ['Ashburn, VA'],
    cloudRouterCount: 2,
    linkCount: 4,
    primaryIPE: 'NYC-2',
    secondaryIPE: 'Atlanta-1',
    ipeRedundancy: true,
    createdAt: '2024-01-15T00:00:00Z',
    alerts: [
      {
        id: 'alert-1',
        severity: 'critical',
        category: 'throughput',
        title: 'Bandwidth Utilization Critical',
        message: 'Connection bandwidth utilization has exceeded 90%. Current usage: 85%. Consider upgrading bandwidth or implementing traffic shaping policies.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        acknowledged: false,
        affectedComponents: ['cr-1', 'link-1'],
        recommendedAction: 'Upgrade to 20 Gbps bandwidth or enable QoS policies to prioritize critical traffic.',
      },
      {
        id: 'alert-2',
        severity: 'warning',
        category: 'configuration',
        title: 'BGP Session Flapping',
        message: 'BGP session on Primary Cloud Router has experienced 3 flaps in the last hour. This may indicate network instability.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        acknowledged: false,
        affectedComponents: ['cr-1'],
        recommendedAction: 'Review BGP configuration and check for network path issues. Consider increasing BGP timers.',
      },
      {
        id: 'alert-3',
        severity: 'info',
        category: 'maintenance',
        title: 'Scheduled Maintenance Window',
        message: 'A maintenance window is scheduled for March 25, 2024 from 2:00 AM to 4:00 AM EST. Services may experience brief interruptions.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        acknowledged: false,
        recommendedAction: 'Plan accordingly and notify affected teams of the maintenance window.',
      }
    ],
    health: {
      overall: 'degraded',
      throughputStatus: 'critical',
      configurationStatus: 'warning',
      lastChecked: new Date().toISOString(),
    },
    performance: createPerformanceData('4.2ms', '0.01%', '99.99%', 85),
    features: { ...defaultFeatures, redundantPath: true, loadBalancing: true },
    security: defaultSecurity,
    billing: createBillingData(999.99, 299.99, undefined, undefined, [
      { name: 'DDoS Protection', cost: 199.99 },
      { name: 'Advanced Monitoring', cost: 100.0 }
    ]),
  },
  {
    id: 'conn-2',
    name: 'Multi-Cloud Production',
    type: 'Cloud to Cloud',
    status: 'Active',
    bandwidth: '10 Gbps',
    location: 'Dallas, TX',
    provider: 'Azure',
    providers: ['Azure', 'AWS'],
    locations: ['Dallas, TX', 'San Jose, CA'],
    cloudRouterCount: 3,
    linkCount: 6,
    primaryIPE: 'Dallas-1',
    secondaryIPE: 'SFO-1',
    ipeRedundancy: true,
    createdAt: '2024-02-01T00:00:00Z',
    alerts: [
      {
        id: 'alert-4',
        severity: 'warning',
        category: 'performance',
        title: 'Increased Latency Detected',
        message: 'Average latency has increased from 4.2ms to 5.8ms over the past 4 hours. This may impact real-time applications.',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
        acknowledged: false,
        affectedComponents: ['link-3', 'link-4'],
        recommendedAction: 'Check for network congestion and consider rerouting traffic through alternate paths.',
      },
      {
        id: 'alert-5',
        severity: 'info',
        category: 'security',
        title: 'SSL Certificate Renewal Required',
        message: 'SSL certificate for the management interface expires in 30 days. Please renew to maintain secure access.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        acknowledged: true,
        recommendedAction: 'Initiate certificate renewal process through the Certificate Manager.',
      }
    ],
    health: {
      overall: 'healthy',
      throughputStatus: 'optimal',
      configurationStatus: 'valid',
      lastChecked: new Date().toISOString(),
    },
    performance: createPerformanceData('4.8ms', '0.02%', '99.95%', 75),
    features: { ...defaultFeatures, autoScaling: true, loadBalancing: true },
    security: defaultSecurity,
    billing: createBillingData(999.99, 199.99, undefined, undefined, [
      { name: 'Advanced Monitoring', cost: 100.0 }
    ]),
  },
  {
    id: 'conn-3',
    name: 'Global Enterprise Network',
    type: 'DataCenter/CoLocation to Cloud',
    status: 'Active',
    bandwidth: '10 Gbps',
    location: 'New York, NY',
    providers: ['AWS', 'Azure', 'Google'],
    locations: ['New York, NY', 'Chicago, IL', 'Los Angeles, CA', 'London, UK'],
    datacenters: ['Equinix NY5', 'CoreSite CH1', 'Digital Realty LAX1'],
    cloudRouterCount: 5,
    linkCount: 12,
    primaryIPE: 'Chicago-1',
    ipeRedundancy: false,
    createdAt: '2024-02-15T00:00:00Z',
    performance: createPerformanceData('5.1ms', '0.015%', '99.98%', 65),
    features: { ...defaultFeatures, autoScaling: true },
    security: defaultSecurity,
    billing: createBillingData(999.99, 99.99, undefined, undefined, [
      { name: 'Basic Monitoring', cost: 50.0 }
    ]),
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
    email: 'sarah.chen@example.com',
    role: 'Network Administrator',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-1', 'Internet to AWS Cloud', ['view', 'manage', 'monitor', 'configure'])],
  },
  {
    id: 'user-2',
    name: 'Michael Rodriguez',
    email: 'michael.r@example.com',
    role: 'Security Engineer',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-1', 'Internet to AWS Cloud', ['view', 'monitor', 'configure'])],
  },
];

// Azure users
const azureUsers: User[] = [
  {
    id: 'user-3',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Network Administrator',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-2', 'Internet to Azure Cloud', ['view', 'manage', 'monitor', 'configure'])],
  },
  {
    id: 'user-4',
    name: 'Lisa Martinez',
    email: 'lisa.m@example.com',
    role: 'Security Analyst',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-2', 'Internet to Azure Cloud', ['view', 'monitor', 'configure'])],
  },
];

// Google Cloud users
const googleUsers: User[] = [
  {
    id: 'user-5',
    name: 'Thomas Anderson',
    email: 'thomas.a@example.com',
    role: 'Network Administrator',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-3', 'Internet to Google Cloud', ['view', 'manage', 'monitor', 'configure'])],
  },
  {
    id: 'user-6',
    name: 'Sophia Lee',
    email: 'sophia.l@example.com',
    role: 'Security Engineer',
    status: 'active',
    lastActive: new Date().toISOString(),
    connectionAccess: [createConnectionAccess('conn-3', 'Internet to Google Cloud', ['view', 'monitor', 'configure'])],
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
    name: 'Cloud Infrastructure',
    description: 'Core cloud infrastructure connections and resources',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    type: 'department',
    status: 'active',
    addresses: [sampleAddresses[0]],
    contacts: [sampleContacts[0]],
    connectionIds: ['conn-1', 'conn-2'],
    userIds: ['user-1', 'user-3'],
    ownerId: 'user-1',
    permissions: {
      read: ['user-1', 'user-2', 'user-3', 'user-4'],
      write: ['user-1', 'user-3'],
      admin: ['user-1']
    },
    billing: createGroupBillingData(2499.96),
    performance: createGroupPerformanceData()
  },
  {
    id: 'group-2',
    name: 'Network Operations',
    description: 'Core network infrastructure management team',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    type: 'team',
    status: 'active',
    addresses: [sampleAddresses[1]],
    contacts: [sampleContacts[1]],
    connectionIds: ['conn-3'],
    userIds: ['user-5', 'user-6'],
    ownerId: 'user-5',
    permissions: {
      read: ['user-5', 'user-6'],
      write: ['user-5'],
      admin: ['user-5']
    },
    billing: createGroupBillingData(1099.98),
    performance: {
      aggregatedMetrics: {
        averageLatency: '5.1ms',
        averagePacketLoss: '0.015%',
        averageUptime: '99.98%',
        totalBandwidth: '10 Gbps',
        bandwidthUtilization: 65,
        totalTraffic: '0.8 TB'
      },
      historicalData: [] // This would be filled with actual historical data
    }
  },
  {
    id: 'group-3',
    name: 'Research & Development',
    description: 'R&D projects and dev environments',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    type: 'project',
    status: 'active',
    parentGroupId: 'group-1',
    addresses: [],
    contacts: [],
    connectionIds: [],
    userIds: ['user-2', 'user-4', 'user-6'],
    ownerId: 'user-2',
    permissions: {
      read: ['user-1', 'user-2', 'user-4', 'user-6'],
      write: ['user-2', 'user-6'],
      admin: ['user-2']
    },
    tags: {
      'department': 'R&D',
      'environment': 'development',
      'costCenter': 'CC-RD-001'
    }
  }
];