import { Suspense, lazy, useState } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { SkeletonTable } from '../../common/SkeletonTable';
import { LazyLoadSection } from '../../common/layouts/LazyLoadSection';
import { FileText, Filter } from 'lucide-react';

// Load the logs content component lazily
const LogsContent = lazy(() => import('./LogsContent'));
const LogRuleMaking = lazy(() => import('../logs/LogRuleMaking').then(module => ({ default: module.LogRuleMaking })));

export function LogsTab() {
  const { selectedConnection, filteredConnections, timeRange } = useMonitoring();
  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'filters'>('logs');

  const tabs = [
    { id: 'logs', label: 'Log Viewer', icon: FileText },
    { id: 'filters', label: 'Filter Rules', icon: Filter }
  ];

  return (
    <div className="p-6">
      <div className="flex">
        {/* Vertical Tabs */}
        <div className="w-48 shrink-0 border-r border-gray-200 pr-4">
          <nav className="space-y-1" aria-label="Logs Navigation">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg
                    transition-colors duration-200
                    ${activeSubTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mr-3 ${
                    activeSubTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 pl-6">
          {activeSubTab === 'logs' ? (
            <LazyLoadSection
              placeholder={<SkeletonTable rows={5} columns={6} />}
              className="w-full"
            >
              <Suspense fallback={<SkeletonTable rows={5} columns={6} />}>
                <LogsContent
                  selectedConnection={selectedConnection}
                  connections={filteredConnections}
                />
              </Suspense>
            </LazyLoadSection>
          ) : (
            <Suspense fallback={<SkeletonTable rows={5} columns={6} />}>
              <LogRuleMaking
                selectedConnection={selectedConnection}
                timeRange={timeRange}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

