import { Lightbulb, TrendingUp, GitBranch, CheckCircle, AlertTriangle } from 'lucide-react';
import { AnomalyInsight } from '../../../types/anomaly';

interface AnomalyInsightsPanelProps {
  insights: AnomalyInsight[];
}

export function AnomalyInsightsPanel({ insights }: AnomalyInsightsPanelProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return TrendingUp;
      case 'correlation':
        return GitBranch;
      case 'prediction':
        return AlertTriangle;
      default:
        return Lightbulb;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pattern':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'correlation':
        return 'text-violet-600 bg-violet-50 border-violet-200';
      case 'prediction':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = getInsightIcon(insight.type);
          const colorClass = getTypeColor(insight.type);

          return (
            <div
              key={insight.id}
              className={`p-5 rounded-lg border-2 ${colorClass} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white rounded-lg">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-white rounded-full">
                        {insight.confidenceScore.toFixed(1)}% confidence
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        insight.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        insight.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {insight.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{insight.description}</p>

                  {insight.actionable && insight.suggestedActions && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Suggested Actions</span>
                      </h4>
                      <ul className="space-y-2">
                        {insight.suggestedActions.map((action, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    Affects {insight.affectedConnections.length} connection{insight.affectedConnections.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
