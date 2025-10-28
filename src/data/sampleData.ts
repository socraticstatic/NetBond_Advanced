// Sample data for testing UI components
import { Connection, User } from '../types';
import { Group, GroupAddress, GroupContact } from '../types/group';
import { Anomaly, AnomalyInsight, AnomalyDetectionStats, AnomalyBaseline } from '../types/anomaly';

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
    createdAt: '2024-01-15T00:00:00Z',
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
    createdAt: '2024-02-01T00:00:00Z',
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

// Helper function to generate time series data
const generateTimeSeriesData = (
  hours: number,
  baseValue: number,
  anomalyHour: number,
  anomalyValue: number
) => {
  const data = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    const isAnomaly = i === anomalyHour;
    const value = isAnomaly ? anomalyValue : baseValue + (Math.random() * 0.5 - 0.25);

    data.push({
      timestamp,
      value: Math.max(0, value),
      isAnomaly
    });
  }

  return data;
};

// Sample anomalies showcasing various scenarios
export const sampleAnomalies: Anomaly[] = [
  {
    id: 'anom-1',
    connectionId: 'conn-1',
    connectionName: 'Corporate Cloud Gateway',
    metricType: 'latency',
    severity: 'critical',
    status: 'active',
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    baselineValue: 4.2,
    detectedValue: 28.5,
    deviation: 578.6,
    confidenceScore: 98.5,
    title: 'Severe Latency Spike Detected',
    description: 'Network latency has increased by 578% from the baseline average of 4.2ms to 28.5ms',
    aiInsight: 'Analysis indicates this spike correlates with increased traffic volume during peak business hours. The anomaly began at 2:15 PM EST and shows characteristics of network congestion.',
    recommendation: 'Consider implementing QoS policies or increasing bandwidth allocation during peak hours. Review traffic patterns to identify specific applications causing congestion.',
    pattern: 'spike',
    correlatedAnomalies: ['anom-2'],
    timeSeriesData: generateTimeSeriesData(24, 4.2, 2, 28.5)
  },
  {
    id: 'anom-2',
    connectionId: 'conn-1',
    connectionName: 'Corporate Cloud Gateway',
    metricType: 'bandwidth',
    severity: 'warning',
    status: 'active',
    detectedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    baselineValue: 7.5,
    detectedValue: 9.2,
    deviation: 22.7,
    confidenceScore: 94.2,
    title: 'Bandwidth Utilization Above Threshold',
    description: 'Bandwidth utilization has increased by 23% from baseline, currently at 92% of capacity',
    aiInsight: 'This increase coincides with the latency anomaly detected earlier. Pattern analysis suggests this is part of a normal business cycle but approaching capacity limits.',
    recommendation: 'Monitor closely. If utilization remains above 90% for extended periods, consider bandwidth upgrade or traffic optimization.',
    pattern: 'gradual_increase',
    correlatedAnomalies: ['anom-1'],
    timeSeriesData: generateTimeSeriesData(24, 7.5, 1.5, 9.2)
  },
  {
    id: 'anom-3',
    connectionId: 'conn-2',
    connectionName: 'Multi-Cloud Production',
    metricType: 'packet_loss',
    severity: 'warning',
    status: 'acknowledged',
    detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    baselineValue: 0.02,
    detectedValue: 0.15,
    deviation: 650.0,
    confidenceScore: 96.8,
    title: 'Elevated Packet Loss Detected',
    description: 'Packet loss rate increased from 0.02% to 0.15%, exceeding acceptable thresholds',
    aiInsight: 'The packet loss pattern suggests intermittent network issues, possibly due to routing instability or hardware degradation. The anomaly has been intermittent over the past 12 hours.',
    recommendation: 'Investigate routing tables and perform path analysis. Consider failover to redundant path if available.',
    pattern: 'cyclic_change',
    timeSeriesData: generateTimeSeriesData(24, 0.02, 12, 0.15)
  },
  {
    id: 'anom-4',
    connectionId: 'conn-3',
    connectionName: 'Global Enterprise Network',
    metricType: 'jitter',
    severity: 'info',
    status: 'active',
    detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    baselineValue: 1.2,
    detectedValue: 3.8,
    deviation: 216.7,
    confidenceScore: 89.3,
    title: 'Jitter Variance Above Normal Range',
    description: 'Network jitter has increased to 3.8ms from a baseline of 1.2ms',
    aiInsight: 'Increased jitter detected during data center-to-cloud traffic. This may impact real-time applications such as VoIP or video conferencing.',
    recommendation: 'Review QoS settings for time-sensitive traffic. Consider dedicated traffic shaping for real-time applications.',
    pattern: 'gradual_increase',
    timeSeriesData: generateTimeSeriesData(24, 1.2, 4, 3.8)
  },
  {
    id: 'anom-5',
    connectionId: 'conn-2',
    connectionName: 'Multi-Cloud Production',
    metricType: 'throughput',
    severity: 'critical',
    status: 'resolved',
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    baselineValue: 8.5,
    detectedValue: 3.2,
    deviation: -62.4,
    confidenceScore: 97.1,
    title: 'Significant Throughput Degradation',
    description: 'Throughput dropped by 62% from 8.5 Gbps to 3.2 Gbps',
    aiInsight: 'Sudden throughput drop was caused by upstream provider maintenance. Issue was automatically resolved when traffic was rerouted through redundant path.',
    recommendation: 'Maintenance window was not properly communicated. Ensure SLA monitoring and provider notification systems are functioning correctly.',
    pattern: 'sudden_drop',
    timeSeriesData: generateTimeSeriesData(24, 8.5, 24, 3.2)
  },
  {
    id: 'anom-6',
    connectionId: 'conn-1',
    connectionName: 'Corporate Cloud Gateway',
    metricType: 'error_rate',
    severity: 'warning',
    status: 'resolved',
    detectedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    baselineValue: 0.05,
    detectedValue: 0.32,
    deviation: 540.0,
    confidenceScore: 93.7,
    title: 'Connection Error Rate Spike',
    description: 'Error rate increased from 0.05% to 0.32%, indicating potential connection instability',
    aiInsight: 'Error rate spike was traced to a misconfiguration deployed during routine maintenance. The issue was identified and corrected within 2 hours.',
    recommendation: 'Implement pre-deployment validation and staged rollouts for configuration changes.',
    pattern: 'spike',
    timeSeriesData: generateTimeSeriesData(24, 0.05, 18, 0.32)
  }
];

// Sample anomaly insights
export const sampleAnomalyInsights: AnomalyInsight[] = [
  {
    id: 'insight-1',
    type: 'pattern',
    title: 'Recurring Peak Hour Congestion',
    description: 'Analysis of the past 30 days shows consistent latency and bandwidth anomalies between 2-4 PM EST, suggesting predictable capacity constraints during peak business hours.',
    affectedConnections: ['conn-1', 'conn-2'],
    severity: 'warning',
    confidenceScore: 96.5,
    actionable: true,
    suggestedActions: [
      'Schedule bandwidth upgrade to accommodate peak traffic',
      'Implement traffic shaping policies for non-critical applications',
      'Consider auto-scaling bandwidth allocation during peak hours'
    ]
  },
  {
    id: 'insight-2',
    type: 'correlation',
    title: 'Multi-Connection Performance Degradation',
    description: 'Detected correlation between anomalies on conn-1 and conn-2, suggesting a common upstream provider issue affecting multiple connections simultaneously.',
    affectedConnections: ['conn-1', 'conn-2'],
    severity: 'critical',
    confidenceScore: 91.8,
    actionable: true,
    suggestedActions: [
      'Contact upstream provider to investigate regional issues',
      'Review SLA compliance and potential credits',
      'Evaluate alternative routing options for redundancy'
    ]
  },
  {
    id: 'insight-3',
    type: 'prediction',
    title: 'Bandwidth Capacity Approaching Limits',
    description: 'Based on current growth trends, connection bandwidth utilization is projected to exceed 95% within the next 2 weeks, increasing risk of performance degradation.',
    affectedConnections: ['conn-1'],
    severity: 'warning',
    confidenceScore: 88.3,
    actionable: true,
    suggestedActions: [
      'Plan bandwidth upgrade within the next 10 days',
      'Audit high-bandwidth applications for optimization opportunities',
      'Implement usage monitoring and alerting at 90% threshold'
    ]
  },
  {
    id: 'insight-4',
    type: 'recommendation',
    title: 'Optimize Alert Thresholds',
    description: 'Current alert thresholds have resulted in a 12% false positive rate. Machine learning analysis suggests adjusted thresholds would improve detection accuracy to 97%.',
    affectedConnections: ['conn-1', 'conn-2', 'conn-3'],
    severity: 'info',
    confidenceScore: 94.2,
    actionable: true,
    suggestedActions: [
      'Review and update alert threshold configurations',
      'Enable adaptive threshold learning',
      'Reduce alert fatigue by filtering low-confidence detections'
    ]
  }
];

// Sample anomaly detection statistics
export const sampleAnomalyStats: AnomalyDetectionStats = {
  totalDetected: 47,
  activeCount: 4,
  resolvedCount: 43,
  criticalCount: 2,
  warningCount: 2,
  infoCount: 0,
  averageConfidence: 94.8,
  detectionRate: 98.2,
  falsePositiveRate: 3.8,
  trendsLastWeek: [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 8 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 6 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 5 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 9 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 7 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 8 },
    { date: new Date().toISOString().split('T')[0], count: 4 }
  ]
};

// Sample baselines for key metrics
export const sampleAnomalyBaselines: AnomalyBaseline[] = [
  {
    metricType: 'latency',
    connectionId: 'conn-1',
    normalRange: { min: 3.8, max: 4.8, mean: 4.2, stdDev: 0.3 },
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    sampleSize: 10080,
    confidenceBand: 95
  },
  {
    metricType: 'bandwidth',
    connectionId: 'conn-1',
    normalRange: { min: 6.5, max: 8.5, mean: 7.5, stdDev: 0.5 },
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    sampleSize: 10080,
    confidenceBand: 95
  },
  {
    metricType: 'packet_loss',
    connectionId: 'conn-2',
    normalRange: { min: 0.01, max: 0.03, mean: 0.02, stdDev: 0.005 },
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    sampleSize: 10080,
    confidenceBand: 95
  },
  {
    metricType: 'jitter',
    connectionId: 'conn-3',
    normalRange: { min: 0.8, max: 1.6, mean: 1.2, stdDev: 0.2 },
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    sampleSize: 10080,
    confidenceBand: 95
  }
];