import { useState, useEffect, useMemo } from 'react';
import { Box, Zap, Users, Shield, Cpu, Database } from 'lucide-react';
import { RealTimeMetricCard } from './RealTimeMetricCard';
import { RealTimeChart } from './RealTimeChart';
import { useMonitoring } from '../context/MonitoringContext';

interface VNFMetricData {
  timestamp: Date;
  throughput: number;
  cpuUsage: number;
  memoryUsage: number;
  activeSessions: number;
  policyHitRate: number;
  licenseUtilization: number;
}

export function VNFMetricsView() {
  const { filteredVNFs, generateHourlyData } = useMonitoring();
  const [metricsData, setMetricsData] = useState<VNFMetricData[]>([]);

  useEffect(() => {
    const initialData = generateHourlyData().map(d => ({
      timestamp: new Date(d.timestamp),
      throughput: Math.random() * 250 + 650,
      cpuUsage: Math.random() * 35 + 35,
      memoryUsage: Math.random() * 25 + 55,
      activeSessions: Math.floor(Math.random() * 5000) + 15000,
      policyHitRate: Math.random() * 10 + 85,
      licenseUtilization: Math.random() * 20 + 60
    }));
    setMetricsData(initialData);

    const interval = setInterval(() => {
      setMetricsData(prev => {
        const newPoint: VNFMetricData = {
          timestamp: new Date(),
          throughput: Math.random() * 250 + 650,
          cpuUsage: Math.random() * 35 + 35,
          memoryUsage: Math.random() * 25 + 55,
          activeSessions: Math.floor(Math.random() * 5000) + 15000,
          policyHitRate: Math.random() * 10 + 85,
          licenseUtilization: Math.random() * 20 + 60
        };

        const updated = [...prev, newPoint];
        return updated.slice(-100);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [generateHourlyData]);

  const currentMetrics = useMemo(() => {
    if (metricsData.length === 0) return null;

    const current = metricsData[metricsData.length - 1];
    const previous = metricsData[Math.max(0, metricsData.length - 10)];

    const calculateTrend = (currentVal: number, prevVal: number) => {
      const change = ((currentVal - prevVal) / prevVal) * 100;
      return {
        direction: change > 1 ? 'up' as const : change < -1 ? 'down' as const : 'stable' as const,
        percentage: Math.abs(change),
        timeframe: '10 samples'
      };
    };

    const getStatus = (value: number, thresholds: { warning: number; critical: number }) => {
      if (value >= thresholds.critical) return 'critical' as const;
      if (value >= thresholds.warning) return 'warning' as const;
      return 'healthy' as const;
    };

    return {
      throughput: {
        value: current.throughput.toFixed(0),
        trend: calculateTrend(current.throughput, previous.throughput),
        status: current.throughput > 700 ? 'healthy' as const : current.throughput > 500 ? 'warning' as const : 'critical' as const,
        sparkline: metricsData.slice(-20).map(d => d.throughput)
      },
      cpuUsage: {
        value: current.cpuUsage.toFixed(1),
        trend: calculateTrend(current.cpuUsage, previous.cpuUsage),
        status: getStatus(current.cpuUsage, { warning: 70, critical: 85 }),
        sparkline: metricsData.slice(-20).map(d => d.cpuUsage)
      },
      memoryUsage: {
        value: current.memoryUsage.toFixed(1),
        trend: calculateTrend(current.memoryUsage, previous.memoryUsage),
        status: getStatus(current.memoryUsage, { warning: 75, critical: 90 }),
        sparkline: metricsData.slice(-20).map(d => d.memoryUsage)
      },
      activeSessions: {
        value: current.activeSessions.toLocaleString(),
        trend: calculateTrend(current.activeSessions, previous.activeSessions),
        status: 'healthy' as const,
        sparkline: metricsData.slice(-20).map(d => d.activeSessions)
      },
      policyHitRate: {
        value: current.policyHitRate.toFixed(1),
        trend: calculateTrend(current.policyHitRate, previous.policyHitRate),
        status: current.policyHitRate > 85 ? 'healthy' as const : current.policyHitRate > 70 ? 'warning' as const : 'critical' as const,
        sparkline: metricsData.slice(-20).map(d => d.policyHitRate)
      },
      licenseUtilization: {
        value: current.licenseUtilization.toFixed(1),
        trend: calculateTrend(current.licenseUtilization, previous.licenseUtilization),
        status: getStatus(current.licenseUtilization, { warning: 80, critical: 95 }),
        sparkline: metricsData.slice(-20).map(d => d.licenseUtilization)
      }
    };
  }, [metricsData]);

  if (!currentMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Box className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading VNF metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">VNF Performance & Capacity</h2>
          <p className="text-sm text-gray-600 mt-1">
            Monitoring {filteredVNFs.length} VNF{filteredVNFs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RealTimeMetricCard
          title="Throughput"
          value={currentMetrics.throughput.value}
          unit="Mbps"
          icon={<Zap className="h-5 w-5" />}
          status={currentMetrics.throughput.status}
          trend={currentMetrics.throughput.trend}
          sparklineData={currentMetrics.throughput.sparkline}
          target={{ value: 75, label: 'Capacity Usage' }}
          lastUpdate={metricsData[metricsData.length - 1]?.timestamp}
          isLive={true}
        />

        <RealTimeMetricCard
          title="Active Sessions"
          value={currentMetrics.activeSessions.value}
          icon={<Users className="h-5 w-5" />}
          status={currentMetrics.activeSessions.status}
          trend={currentMetrics.activeSessions.trend}
          sparklineData={currentMetrics.activeSessions.sparkline}
          lastUpdate={metricsData[metricsData.length - 1]?.timestamp}
          isLive={true}
        />

        <RealTimeMetricCard
          title="Policy Hit Rate"
          value={currentMetrics.policyHitRate.value}
          unit="%"
          icon={<Shield className="h-5 w-5" />}
          status={currentMetrics.policyHitRate.status}
          trend={currentMetrics.policyHitRate.trend}
          sparklineData={currentMetrics.policyHitRate.sparkline}
          lastUpdate={metricsData[metricsData.length - 1]?.timestamp}
          isLive={true}
        />

        <RealTimeMetricCard
          title="CPU Usage"
          value={currentMetrics.cpuUsage.value}
          unit="%"
          icon={<Cpu className="h-5 w-5" />}
          status={currentMetrics.cpuUsage.status}
          trend={currentMetrics.cpuUsage.trend}
          sparklineData={currentMetrics.cpuUsage.sparkline}
          target={{ value: Number(currentMetrics.cpuUsage.value), label: 'Current Load' }}
          lastUpdate={metricsData[metricsData.length - 1]?.timestamp}
          isLive={true}
        />

        <RealTimeMetricCard
          title="Memory Usage"
          value={currentMetrics.memoryUsage.value}
          unit="%"
          icon={<Database className="h-5 w-5" />}
          status={currentMetrics.memoryUsage.status}
          trend={currentMetrics.memoryUsage.trend}
          sparklineData={currentMetrics.memoryUsage.sparkline}
          target={{ value: Number(currentMetrics.memoryUsage.value), label: 'Current Usage' }}
          lastUpdate={metricsData[metricsData.length - 1]?.timestamp}
          isLive={true}
        />

        <RealTimeMetricCard
          title="License Utilization"
          value={currentMetrics.licenseUtilization.value}
          unit="%"
          icon={<Box className="h-5 w-5" />}
          status={currentMetrics.licenseUtilization.status}
          trend={currentMetrics.licenseUtilization.trend}
          sparklineData={currentMetrics.licenseUtilization.sparkline}
          lastUpdate={metricsData[metricsData.length - 1]?.timestamp}
          isLive={true}
        />
      </div>

      <RealTimeChart
        data={metricsData.map(d => ({ timestamp: d.timestamp, value: d.throughput }))}
        title="VNF Throughput Over Time"
        unit="Mbps"
        color="#8b5cf6"
        thresholds={{ warning: 500, critical: 300 }}
        height={300}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealTimeChart
          data={metricsData.map(d => ({ timestamp: d.timestamp, value: d.activeSessions }))}
          title="Active Sessions"
          unit="sessions"
          color="#10b981"
          height={250}
        />

        <RealTimeChart
          data={metricsData.map(d => ({ timestamp: d.timestamp, value: d.policyHitRate }))}
          title="Policy Hit Rate"
          unit="%"
          color="#f59e0b"
          height={250}
        />
      </div>
    </div>
  );
}
