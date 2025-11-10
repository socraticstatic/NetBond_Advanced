import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { Connection } from '../../../types';
import { CloudRouter } from '../../../types/cloudrouter';
import { VNF } from '../../../types/vnf';
import { Link } from '../../../types/connection';
import { useTimeRange } from '../../../hooks/useTimeRange';
import { calculateConnectionSummary } from '../../../utils/connections';
import { ResourceType } from '../../../types/metric';

interface MonitoringContextType {
  // Filter state
  selectedConnection: string;
  selectedGroup: string;
  selectedVNF: string;
  resourceType: ResourceType;
  timeRange: string;
  lastRefreshed: Date | null;
  isRefreshing: boolean;
  refreshInterval: number;

  // Data
  connections: Connection[];
  filteredConnections: Connection[];
  routers: CloudRouter[];
  filteredRouters: CloudRouter[];
  links: Link[];
  filteredLinks: Link[];
  vnfs: VNF[];
  allVNFs: VNF[];
  filteredVNFs: VNF[];
  summary: {
    latency: string;
    packetLoss: string;
    uptime: string;
    bandwidth: string;
    tunnelStatus: string;
  };

  // Actions
  setSelectedConnection: (id: string) => void;
  setSelectedGroup: (id: string) => void;
  setSelectedVNF: (id: string) => void;
  setResourceType: (type: ResourceType) => void;
  setTimeRange: (range: string) => void;
  setRefreshInterval: (interval: number) => void;
  handleRefresh: () => void;
  generateHourlyData: () => any[];
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
}

interface MonitoringProviderProps {
  children: ReactNode;
  allConnections: Connection[];
  allRouters?: CloudRouter[];
  allLinks?: Link[];
  allVNFs?: VNF[];
}

export function MonitoringProvider({
  children,
  allConnections,
  allRouters = [],
  allLinks = [],
  allVNFs = []
}: MonitoringProviderProps) {
  // Connection filtering
  const [selectedConnection, setSelectedConnection] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedVNF, setSelectedVNF] = useState<string>('all');
  const [resourceType, setResourceType] = useState<ResourceType>('connection');

  // Time range handling
  const {
    timeRange,
    setTimeRange,
    refreshInterval,
    setRefreshInterval,
    isRefreshing,
    handleRefresh,
    lastRefreshed
  } = useTimeRange('1h');

  // Filter connections based on current selection
  const filteredConnections = useMemo(() =>
    selectedConnection === 'all'
      ? allConnections
      : allConnections.filter(conn => conn.id === selectedConnection),
    [selectedConnection, allConnections]
  );

  // Filter routers based on selected connection
  const filteredRouters = useMemo(() =>
    selectedConnection === 'all'
      ? allRouters
      : allRouters.filter(router => router.connectionId === selectedConnection),
    [selectedConnection, allRouters]
  );

  // Filter links based on selected connection or router
  const filteredLinks = useMemo(() => {
    if (selectedConnection === 'all') return allLinks;

    const connectionRouterIds = filteredRouters.map(r => r.id);
    return allLinks.filter(link =>
      link.cloudRouterIds.some(rid => connectionRouterIds.includes(rid))
    );
  }, [selectedConnection, filteredRouters, allLinks]);

  // Filter VNFs based on selected connection and specific VNF selection
  const filteredVNFs = useMemo(() => {
    let vnfs = selectedConnection === 'all'
      ? allVNFs
      : allVNFs.filter(vnf => vnf.connectionId === selectedConnection);

    if (selectedVNF && selectedVNF !== 'all') {
      vnfs = vnfs.filter(vnf => vnf.id === selectedVNF);
    }

    return vnfs;
  }, [selectedConnection, selectedVNF, allVNFs]);

  // Calculate summary metrics
  const summary = calculateConnectionSummary(filteredConnections);
  
  // Generate hourly data for charts
  const generateHourlyData = useCallback(() => {
    const hours = 24;
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < hours; i++) {
      const date = new Date(now);
      date.setHours(now.getHours() - (hours - i));
      
      data.push({
        timestamp: date.toISOString(),
        latency: 3 + Math.random() * 4, // 3-7ms 
        packetLoss: Math.random() * 0.05, // 0-0.05%
        jitter: Math.random() * 1.5, // 0-1.5ms
        bandwidth: 65 + Math.random() * 25, // 65-90%
        errorRate: Math.random() * 0.01 // 0-0.01%
      });
    }
    
    return data;
  }, []);

  const value = {
    selectedConnection,
    selectedGroup,
    selectedVNF,
    resourceType,
    timeRange,
    lastRefreshed,
    isRefreshing,
    refreshInterval,
    connections: allConnections,
    filteredConnections,
    routers: allRouters,
    filteredRouters,
    links: allLinks,
    filteredLinks,
    vnfs: allVNFs,
    allVNFs,
    filteredVNFs,
    summary,
    setSelectedConnection,
    setSelectedGroup,
    setSelectedVNF,
    setResourceType,
    setTimeRange,
    setRefreshInterval,
    handleRefresh,
    generateHourlyData
  };

  return (
    <MonitoringContext.Provider value={value}>
      {children}
    </MonitoringContext.Provider>
  );
}