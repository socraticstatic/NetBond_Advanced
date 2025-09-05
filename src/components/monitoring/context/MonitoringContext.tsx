import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Connection } from '../../../types';
import { useTimeRange } from '../../../hooks/useTimeRange';
import { calculateConnectionSummary } from '../../../utils/connections';

interface MonitoringContextType {
  // Filter state
  selectedConnection: string;
  selectedGroup: string;
  timeRange: string;
  lastRefreshed: Date | null;
  isRefreshing: boolean;
  refreshInterval: number;
  
  // Data
  connections: Connection[];
  filteredConnections: Connection[];
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
}

export function MonitoringProvider({ children, allConnections }: MonitoringProviderProps) {
  // Connection filtering
  const [selectedConnection, setSelectedConnection] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  
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
  const filteredConnections = selectedConnection === 'all' 
    ? allConnections
    : allConnections.filter(conn => conn.id === selectedConnection);

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
    timeRange,
    lastRefreshed,
    isRefreshing,
    refreshInterval,
    connections: allConnections,
    filteredConnections,
    summary,
    setSelectedConnection,
    setSelectedGroup,
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