import { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { AnomalyDetectionSummary } from '../anomaly/AnomalyDetectionSummary';
import { AnomalyCard } from '../anomaly/AnomalyCard';
import { AnomalyInsightsPanel } from '../anomaly/AnomalyInsightsPanel';
import { AnomalyFilters } from '../anomaly/AnomalyFilters';
import { AnomalyFilter } from '../../../types/anomaly';
import { sampleAnomalies, sampleAnomalyInsights, sampleAnomalyStats, sampleConnections } from '../../../data/sampleData';

export function AnomalyTab() {
  const [filter, setFilter] = useState<AnomalyFilter>({});
  const [activeView, setActiveView] = useState<'anomalies' | 'insights'>('anomalies');

  const filteredAnomalies = useMemo(() => {
    return sampleAnomalies.filter((anomaly) => {
      if (filter.severity && !filter.severity.includes(anomaly.severity)) {
        return false;
      }

      if (filter.status && !filter.status.includes(anomaly.status)) {
        return false;
      }

      if (filter.connectionIds && filter.connectionIds.length > 0) {
        if (!filter.connectionIds.includes(anomaly.connectionId)) {
          return false;
        }
      }

      return true;
    });
  }, [filter]);

  const activeAnomalies = filteredAnomalies.filter(a => a.status === 'active');
  const connectionNames = sampleConnections.map(c => ({ id: c.id, name: c.name }));

  const handleAcknowledge = (id: string) => {
    window.addToast?.({
      type: 'success',
      title: 'Anomaly Acknowledged',
      message: 'The anomaly has been acknowledged and moved to review.',
      duration: 3000
    });
  };

  const handleViewDetails = (id: string) => {
    window.addToast?.({
      type: 'info',
      title: 'Anomaly Details',
      message: 'Opening detailed analysis view...',
      duration: 2000
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-violet-100 to-blue-100 rounded-lg">
            <Sparkles className="h-8 w-8 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Anomaly Detection</h1>
            <p className="text-sm text-gray-600">AI-powered monitoring and intelligent insights</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('anomalies')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === 'anomalies'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Anomalies</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('insights')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === 'insights'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Insights</span>
            </div>
          </button>
        </div>
      </div>

      <AnomalyDetectionSummary stats={sampleAnomalyStats} />

      {activeView === 'anomalies' ? (
        <>
          <AnomalyFilters
            filter={filter}
            onFilterChange={setFilter}
            connectionNames={connectionNames}
          />

          {activeAnomalies.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>Active Anomalies ({activeAnomalies.length})</span>
              </h2>
              <div className="space-y-4">
                {activeAnomalies.map((anomaly) => (
                  <AnomalyCard
                    key={anomaly.id}
                    anomaly={anomaly}
                    onAcknowledge={handleAcknowledge}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredAnomalies.filter(a => a.status !== 'active').length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent History
              </h2>
              <div className="space-y-4">
                {filteredAnomalies
                  .filter(a => a.status !== 'active')
                  .map((anomaly) => (
                    <AnomalyCard
                      key={anomaly.id}
                      anomaly={anomaly}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
              </div>
            </div>
          )}

          {filteredAnomalies.length === 0 && (
            <div className="card p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Anomalies Found</h3>
              <p className="text-gray-600">
                No anomalies match your current filter criteria. Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </>
      ) : (
        <AnomalyInsightsPanel insights={sampleAnomalyInsights} />
      )}
    </div>
  );
}
