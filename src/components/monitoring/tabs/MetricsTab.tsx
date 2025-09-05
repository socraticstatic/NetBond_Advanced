import { lazy } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { SkeletonCard } from '../../common/SkeletonCard';
import { LazyLoadSection } from '../../common/layouts/LazyLoadSection';

// Lazy-loaded components with named exports
const LazyLatencyTrends = lazy(() => import('../metrics/LatencyTrends').then(module => ({ 
  default: module.LatencyTrends 
})));

const LazyBandwidthUtilization = lazy(() => import('../metrics/BandwidthUtilization').then(module => ({ 
  default: module.BandwidthUtilization 
})));

const LazyPacketLossAnalysis = lazy(() => import('../metrics/PacketLossAnalysis').then(module => ({ 
  default: module.PacketLossAnalysis 
})));

const LazyErrorRateChart = lazy(() => import('../metrics/ErrorRateChart').then(module => ({ 
  default: module.ErrorRateChart 
})));

const LazyJitterAnalysis = lazy(() => import('../metrics/JitterAnalysis').then(module => ({ 
  default: module.JitterAnalysis 
})));

const LazyNetworkMetrics = lazy(() => import('../metrics/NetworkMetrics').then(module => ({ 
  default: module.NetworkMetrics 
})));

const LazyPerformanceDistribution = lazy(() => import('../metrics/PerformanceDistribution').then(module => ({ 
  default: module.PerformanceDistribution 
})));

export function MetricsTab() {
  const { 
    timeRange,
    summary,
    generateHourlyData,
  } = useMonitoring();
  
  // Generate hourly data for charts
  const hourlyData = generateHourlyData();

  // Current active metric view
  const [activeMetricView, setActiveMetricView] = useState('overview');

  return (
    <>
      {/* Overview Section */}
      {activeMetricView === 'overview' && (
        <LazyLoadSection
          placeholder={<SkeletonCard lines={8} />}
          className="w-full"
        >
          <div className="space-y-6 w-full">
            <LazyNetworkMetrics metrics={summary} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LazyLoadSection
                placeholder={<SkeletonCard lines={6} />}
                className="w-full"
              >
                <LazyPerformanceDistribution data={hourlyData} />
              </LazyLoadSection>
            </div>
          </div>
        </LazyLoadSection>
      )}

      {/* Latency Section */}
      {activeMetricView === 'latency' && (
        <div className="w-full space-y-6">
          <LazyLoadSection
            placeholder={<SkeletonCard lines={6} />}
            className="w-full"
          >
            <LazyLatencyTrends data={hourlyData} timeRange={timeRange} />
          </LazyLoadSection>
          
          <LazyLoadSection
            placeholder={<SkeletonCard lines={6} />}
            className="w-full"
          >
            <LazyJitterAnalysis data={hourlyData} timeRange={timeRange} />
          </LazyLoadSection>
        </div>
      )}

      {/* Bandwidth Section */}
      {activeMetricView === 'bandwidth' && (
        <div className="w-full space-y-6">
          <LazyLoadSection
            placeholder={<SkeletonCard lines={6} />}
            className="w-full"
          >
            <LazyBandwidthUtilization data={hourlyData} timeRange={timeRange} />
          </LazyLoadSection>
        </div>
      )}

      {/* Packet Loss Section */}
      {activeMetricView === 'packet-loss' && (
        <div className="w-full space-y-6">
          <LazyLoadSection
            placeholder={<SkeletonCard lines={6} />}
            className="w-full"
          >
            <LazyPacketLossAnalysis data={hourlyData} timeRange={timeRange} />
          </LazyLoadSection>
        </div>
      )}

      {/* Errors Section */}
      {activeMetricView === 'errors' && (
        <div className="w-full space-y-6">
          <LazyLoadSection
            placeholder={<SkeletonCard lines={6} />}
            className="w-full"
          >
            <LazyErrorRateChart data={hourlyData} timeRange={timeRange} />
          </LazyLoadSection>
        </div>
      )}
    </>
  );
}

// Add missing imports
import { useState } from 'react';

