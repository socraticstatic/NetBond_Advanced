import { DivideIcon as LucideIcon } from 'lucide-react';

export type VNFType = 'firewall' | 'sdwan' | 'router' | 'vnat' | 'custom';

export interface VNF {
  id: string;
  name: string;
  type: VNFType;
  vendor: string;
  model?: string;
  version?: string;
  status: 'active' | 'inactive' | 'provisioning' | 'error';
  throughput?: string;
  licenseExpiry?: string;
  configuration?: {
    interfaces?: VNFInterface[];
    routingProtocols?: string[];
    policies?: any[];
    highAvailability?: boolean;
    managementIP?: string;
    [key: string]: any;
  };
  position?: {
    x: number;
    y: number;
  };
  createdAt: string;
  updatedAt?: string;
  icon?: typeof LucideIcon;
  description?: string;
  connectionId: string;
  linkIds: string[];
  performance?: {
    throughput: string;
    latency: string;
    cpuUsage: number;
    memoryUsage: number;
    activeSessions: number;
    maxSessions: number;
    policyHitRate: number;
    licenseUtilization: number;
    serviceSpecificMetrics: Record<string, number>;
  };
}

export interface VNFInterface {
  id: string;
  name: string;
  type: 'wan' | 'lan' | 'management' | 'ha';
  ipAddress?: string;
  subnetMask?: string;
  gateway?: string;
  vlanId?: number;
  mtu?: number;
  status: 'up' | 'down';
}

export interface VNFTemplate {
  id: string;
  name: string;
  description: string;
  type: VNFType;
  vendor: string;
  model?: string;
  throughput: string;
  defaultConfiguration?: {
    interfaces?: Partial<VNFInterface>[];
    routingProtocols?: string[];
    policies?: any[];
    [key: string]: any;
  };
  icon: typeof LucideIcon;
  recommendedUseCase?: string;
  licenseRequired: boolean;
  pricing?: {
    monthly: number;
    annually: number;
  };
}