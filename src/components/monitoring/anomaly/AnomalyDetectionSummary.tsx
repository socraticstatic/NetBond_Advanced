import { AlertTriangle, CheckCircle, TrendingUp, Brain } from 'lucide-react';
import { AnomalyDetectionStats } from '../../../types/anomaly';

interface AnomalyDetectionSummaryProps {
  stats: AnomalyDetectionStats;
}

export function AnomalyDetectionSummary({ stats }: AnomalyDetectionSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.activeCount}</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600">Active Anomalies</h3>
        <p className="text-xs text-gray-500 mt-1">Requires attention</p>
      </div>

      <div className="card p-6 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.resolvedCount}</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600">Resolved This Week</h3>
        <p className="text-xs text-gray-500 mt-1">{stats.totalDetected} total detected</p>
      </div>

      <div className="card p-6 bg-gradient-to-br from-amber-50 to-white border-l-4 border-amber-500">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-amber-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{stats.criticalCount}</div>
            <div className="text-sm text-gray-600">{stats.warningCount} warnings</div>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-600">By Severity</h3>
        <p className="text-xs text-gray-500 mt-1">{stats.infoCount} informational</p>
      </div>

      <div className="card p-6 bg-gradient-to-br from-violet-50 to-white border-l-4 border-violet-500">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-violet-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-violet-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.averageConfidence.toFixed(1)}%</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600">Detection Confidence</h3>
        <p className="text-xs text-gray-500 mt-1">{stats.falsePositiveRate.toFixed(1)}% false positive rate</p>
      </div>
    </div>
  );
}
