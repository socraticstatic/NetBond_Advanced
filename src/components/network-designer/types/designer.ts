export type NodeStatus = 'unconfigured' | 'configured-inactive' | 'active' | 'active-down';
export type EdgeStatus = 'active' | 'inactive' | 'down';

export interface NetworkNode {
  id: string;
  type: 'function' | 'destination' | 'network' | 'datacenter';
  functionType: string;
  subType?: string;
  cloudProvider?: string;
  dcProvider?: string;
  x: number;
  y: number;
  name: string;
  icon: string;
  status: NodeStatus;
  config: Record<string, any>;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  bandwidth: string;
  status: EdgeStatus;
  vlan?: number;
  metrics?: {
    latency?: string;
    throughput?: string;
    packetLoss?: string;
  };
  config?: {
    resilience?: 'single' | 'redundant' | 'ha' | 'dual-diverse';
    encrypted?: boolean;
    qosProfile?: string;
  };
}

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  nodeId?: string;
}

export interface DesignerTemplate {
  id: string;
  name: string;
  description: string;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  nodeCount: number;
  edgeCount: number;
}
