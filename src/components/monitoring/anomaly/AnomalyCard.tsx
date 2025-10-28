import { useState } from 'react';
import { AlertCircle, CheckCircle, Info, TrendingUp, TrendingDown, ArrowRight, Clock, Target } from 'lucide-react';
import { Anomaly } from '../../../types/anomaly';

interface AnomalyCardProps {
  anomaly: Anomaly;
  onAcknowledge?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function AnomalyCard({ anomaly, onAcknowledge, onViewDetails }: AnomalyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityStyles = () => {
    switch (anomaly.severity) {
      case 'critical':
        return {
          border: 'border-red-200',
          bg: 'bg-gradient-to-br from-red-50 to-white',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          badge: 'bg-red-100 text-red-800',
          icon: AlertCircle
        };
      case 'warning':
        return {
          border: 'border-amber-200',
          bg: 'bg-gradient-to-br from-amber-50 to-white',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-800',
          icon: AlertCircle
        };
      default:
        return {
          border: 'border-blue-200',
          bg: 'bg-gradient-to-br from-blue-50 to-white',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800',
          icon: Info
        };
    }
  };

  const getStatusBadge = () => {
    switch (anomaly.status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Active</span>;
      case 'acknowledged':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Acknowledged</span>;
      case 'resolved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Resolved</span>;
    }
  };

  const getPatternIcon = () => {
    if (anomaly.deviation > 0) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-blue-500" />;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const styles = getSeverityStyles();
  const Icon = styles.icon;

  return (
    <div className={`card p-6 ${styles.bg} ${styles.border} border-l-4 transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className={`p-3 ${styles.iconBg} rounded-lg`}>
            <Icon className={`h-6 w-6 ${styles.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{anomaly.title}</h3>
              {getPatternIcon()}
            </div>
            <p className="text-sm text-gray-600 mb-2">{anomaly.connectionName}</p>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(anomaly.detectedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="h-3 w-3" />
                <span>{anomaly.metricType.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {getStatusBadge()}
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles.badge}`}>
            {Math.abs(anomaly.deviation).toFixed(1)}% deviation
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-3">{anomaly.description}</p>

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-xs text-gray-500 mb-1">Baseline</div>
            <div className="text-sm font-semibold text-gray-900">{anomaly.baselineValue.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Detected</div>
            <div className="text-sm font-semibold text-gray-900">{anomaly.detectedValue.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Confidence</div>
            <div className="text-sm font-semibold text-gray-900">{anomaly.confidenceScore.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-2 mb-2">
            <div className="p-1 bg-blue-100 rounded">
              <Brain className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Insight</h4>
              <p className="text-sm text-gray-700">{anomaly.aiInsight}</p>
            </div>
          </div>

          {anomaly.recommendation && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Recommendation</h4>
              <p className="text-sm text-gray-700">{anomaly.recommendation}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {isExpanded ? 'Show Less' : 'View AI Insights'}
        </button>

        <div className="flex items-center space-x-3">
          {anomaly.status === 'active' && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(anomaly.id)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Acknowledge
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(anomaly.id)}
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Brain({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
