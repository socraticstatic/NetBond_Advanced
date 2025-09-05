import { Suspense, lazy } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { SkeletonCard } from '../../common/SkeletonCard';
import { LazyLoadSection } from '../../common/layouts/LazyLoadSection';

// Lazy load components
const AlertCards = lazy(() => import('../alerts/AlertCards'));
const NotificationRules = lazy(() => import('../alerts/NotificationRules').then(module => ({ default: module.NotificationRules })));

export function AlertsTab() {
  const { selectedConnection } = useMonitoring();

  return (
    <div className="p-6">
      <div className="space-y-6">
        <LazyLoadSection
          placeholder={<SkeletonCard lines={4} />}
          className="w-full"
        >
          <Suspense fallback={<SkeletonCard lines={4} />}>
            <AlertCards selectedConnection={selectedConnection} />
          </Suspense>
        </LazyLoadSection>
        
        <LazyLoadSection
          placeholder={<SkeletonCard lines={8} />}
          className="w-full"
        >
          <Suspense fallback={<SkeletonCard lines={8} />}>
            <NotificationRules selectedConnection={selectedConnection} />
          </Suspense>
        </LazyLoadSection>
      </div>
    </div>
  );
}

