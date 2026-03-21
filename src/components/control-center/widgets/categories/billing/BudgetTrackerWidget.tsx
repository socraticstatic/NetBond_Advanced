import { CreditCard, AlertTriangle } from 'lucide-react';
import { Connection } from '../../../../../types';
import { formatCurrency } from '../../../../../utils/connections';

interface BudgetTrackerWidgetProps {
  connections: Connection[];
}

export function BudgetTrackerWidget({ connections }: BudgetTrackerWidgetProps) {
  const totalBilling = connections.reduce((sum, conn) =>
    sum + (conn.billing?.total || 0), 0
  );

  const budget = 20000; // Example budget
  const usagePercentage = (totalBilling / budget) * 100;
  const isOverBudget = usagePercentage > 100;
  const isNearBudget = usagePercentage > 80;

  return (
    <div className="space-y-4">
      {/* Budget Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-figma-base text-fw-bodyLight">Monthly Budget</span>
          <span className="text-figma-base font-medium text-fw-heading">{formatCurrency(budget)}</span>
        </div>
        <div className="h-2 bg-fw-neutral rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-fw-error' :
              isNearBudget ? 'bg-fw-warn' :
              'bg-fw-success'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-figma-base text-fw-bodyLight">Used</span>
          <span className={`text-figma-base font-medium ${
            isOverBudget ? 'text-fw-error' :
            isNearBudget ? 'text-fw-warn' :
            'text-fw-success'
          }`}>
            {formatCurrency(totalBilling)} ({usagePercentage.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Budget Status */}
      {(isOverBudget || isNearBudget) && (
        <div className={`p-3 rounded-lg ${
          isOverBudget ? 'bg-fw-error/10' : 'bg-fw-warn/10'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className={`h-4 w-4 mr-2 ${
              isOverBudget ? 'text-fw-error' : 'text-fw-warn'
            }`} />
            <span className={`text-figma-base ${
              isOverBudget ? 'text-fw-error' : 'text-fw-warn'
            }`}>
              {isOverBudget
                ? 'Budget exceeded! Take action now.'
                : 'Approaching budget limit'
              }
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button className="px-3 py-2 text-figma-base text-fw-link hover:bg-fw-accent rounded-lg transition-colors">
          Adjust Budget
        </button>
        <button className="px-3 py-2 text-figma-base text-fw-link hover:bg-fw-accent rounded-lg transition-colors">
          Cost Alerts
        </button>
      </div>
    </div>
  );
}
