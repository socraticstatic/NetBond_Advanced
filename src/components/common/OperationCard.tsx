import { CheckCircle, Clock, DollarSign, TrendingDown, TrendingUp, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { OperationCard as OperationCardType } from '../../data/mockAIResponses';
import { Button } from './Button';

interface OperationCardProps {
  card: OperationCardType;
  onAction?: () => void;
  isProcessing?: boolean;
  isCompleted?: boolean;
}

export function OperationCard({ card, onAction, isProcessing = false, isCompleted = false }: OperationCardProps) {
  const getTypeColor = () => {
    if (isCompleted) return 'bg-green-50 border-green-300';
    switch (card.type) {
      case 'capacity':
        return 'bg-blue-50 border-blue-200';
      case 'cost':
        return 'bg-green-50 border-green-200';
      case 'schedule':
        return 'bg-purple-50 border-purple-200';
      case 'monitoring':
        return 'bg-cyan-50 border-cyan-200';
      case 'troubleshoot':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = () => {
    if (isCompleted) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    switch (card.type) {
      case 'capacity':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'cost':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'schedule':
        return <Clock className="h-5 w-5 text-purple-600" />;
      case 'monitoring':
        return <CheckCircle className="h-5 w-5 text-cyan-600" />;
      case 'troubleshoot':
        return <TrendingDown className="h-5 w-5 text-orange-600" />;
    }
  };

  return (
    <div className={`rounded-xl border-2 ${getTypeColor()} p-4 space-y-4 transition-all duration-300 ${isCompleted ? 'shadow-lg' : 'shadow-sm'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getTypeIcon()}
          <div>
            <h4 className="font-semibold text-gray-900">{card.title}</h4>
            <p className="text-sm text-gray-600">{card.summary}</p>
          </div>
        </div>
        {isCompleted && (
          <div className="px-3 py-1 bg-green-100 border border-green-300 rounded-full">
            <span className="text-xs font-semibold text-green-700">Executed</span>
          </div>
        )}
      </div>

      {card.metrics && card.metrics.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {card.metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
              <div className="font-semibold text-gray-900">{metric.value}</div>
              {metric.change && (
                <div className={`text-xs flex items-center gap-1 mt-1 ${
                  metric.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.positive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2 shadow-sm">
        {card.details.map((detail, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{detail.label}</span>
            <span className={detail.highlight ? 'font-semibold text-gray-900' : 'text-gray-900'}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {card.timeline && (
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-xs text-gray-500 mb-1">Start</div>
              <div className="font-medium text-gray-900">{card.timeline.start}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 mb-1">End</div>
              <div className="font-medium text-gray-900">{card.timeline.end}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Duration</div>
              <div className="font-medium text-gray-900">{card.timeline.duration}</div>
            </div>
          </div>
        </div>
      )}

      {card.cost && (
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-500 mb-1">Current</div>
              <div className="font-medium text-gray-900">${card.cost.current.toLocaleString()}/mo</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Projected</div>
              <div className="font-medium text-gray-900">${card.cost.projected.toLocaleString()}/mo</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {card.cost.savings > 0 ? 'Savings' : 'Additional'}
              </div>
              <div className={`font-semibold ${card.cost.savings > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {card.cost.savings > 0 ? '-' : '+'}${Math.abs(card.cost.savings).toLocaleString()}/mo
              </div>
            </div>
          </div>
        </div>
      )}

      {card.action && !isCompleted && (
        <Button
          onClick={onAction}
          variant={card.action.type === 'primary' ? 'primary' : 'secondary'}
          className="w-full relative"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            card.action.label
          )}
        </Button>
      )}

      {isCompleted && (
        <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-300 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">Operation Completed Successfully</span>
        </div>
      )}
    </div>
  );
}
