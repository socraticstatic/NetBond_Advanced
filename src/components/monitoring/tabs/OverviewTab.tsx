import { Suspense, lazy } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { LazyLoadSection } from '../../common/layouts/LazyLoadSection';
import { SkeletonCard } from '../../common/SkeletonCard';

// Lazy load components
const AlertCards = lazy(() => 
  import('../alerts/AlertCards').then(module => ({ 
    default: module.default 
  }))
);

const MetricsOverview = lazy(() => 
  import('../components/MetricsOverview').then(module => ({ 
    default: module.MetricsOverview 
  }))
);

const NetworkMetrics = lazy(() => 
  import('../metrics/NetworkMetrics').then(module => ({ 
    default: module.NetworkMetrics 
  }))
);

const BillingMetrics = lazy(() => 
  import('../BillingMetrics').then(module => ({ 
    default: module.BillingMetrics 
  }))
);

const SummaryPanel = lazy(() => 
  import('../SummaryPanel').then(module => ({ 
    default: module.SummaryPanel 
  }))
);

export function OverviewTab() {
  const { 
    selectedConnection,
    filteredConnections,
    summary
  } = useMonitoring();

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Alerts</h3>
        <Suspense fallback={<LoadingSpinner size="md" text="Loading alerts..." />}>
          <AlertCards 
            selectedConnection={selectedConnection} 
            connections={filteredConnections} 
          />
        </Suspense>
      </div>
      
      {/* Metrics Overview */}
      <LazyLoadSection
        placeholder={<SkeletonCard lines={4} />}
        className="w-full"
      >
        <Suspense fallback={<SkeletonCard lines={4} />}>
          <MetricsOverview metrics={summary} />
        </Suspense>
      </LazyLoadSection>
      
      {/* Network Metrics */}
      <LazyLoadSection
        placeholder={<SkeletonCard lines={6} />}
        className="w-full"
      >
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Network Performance</h3>
          <Suspense fallback={<LoadingSpinner size="md" text="Loading network metrics..." />}>
            <NetworkMetrics metrics={summary} />
          </Suspense>
        </div>
      </LazyLoadSection>
      
      {/* Billing Metrics */}
      <LazyLoadSection
        placeholder={<SkeletonCard lines={8} />}
        className="w-full"
      >
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Overview</h3>
          <Suspense fallback={<LoadingSpinner size="md" text="Loading billing data..." />}>
            <BillingMetrics connections={filteredConnections} />
          </Suspense>
        </div>
      </LazyLoadSection>
      
      {/* Summary Panel */}
      <LazyLoadSection
        placeholder={<SkeletonCard lines={4} />}
        className="w-full"
      >
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Analysis</h3>
          <Suspense fallback={<LoadingSpinner size="md" text="Loading usage data..." />}>
            <SummaryPanel connections={filteredConnections} />
          </Suspense>
        </div>
      </LazyLoadSection>
    </div>
  );
}

