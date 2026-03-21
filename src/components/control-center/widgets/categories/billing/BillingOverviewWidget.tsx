import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { Connection } from '../../../../../types';
import { formatCurrency } from '../../../../../utils/connections';

interface BillingOverviewWidgetProps {
  connections: Connection[];
}

export function BillingOverviewWidget({ connections }: BillingOverviewWidgetProps) {
  const totalBilling = connections.reduce((sum, conn) =>
    sum + (conn.billing?.total || 0), 0
  );

  const monthlyTrend = 8.5;
  const nextBillingDate = new Date();
  nextBillingDate.setDate(1);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  return (
    <div className="space-y-4">
      {/* Total Cost */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em]">
            {formatCurrency(totalBilling)}
          </div>
          <div className="flex items-center mt-1">
            <TrendingUp className="h-4 w-4 text-fw-success mr-1" />
            <span className="text-figma-base text-fw-success">+{monthlyTrend}%</span>
            <span className="text-figma-base text-fw-bodyLight ml-1">vs last month</span>
          </div>
        </div>
        <DollarSign className="h-8 w-8 text-fw-success" />
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-fw-wash rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-figma-sm text-fw-bodyLight">Base Services</span>
            <CreditCard className="h-4 w-4 text-fw-bodyLight" />
          </div>
          <div className="text-figma-base font-semibold text-fw-heading">
            {formatCurrency(totalBilling * 0.7)}
          </div>
        </div>
        <div className="p-3 bg-fw-wash rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-figma-sm text-fw-bodyLight">Add-ons</span>
            <CreditCard className="h-4 w-4 text-fw-bodyLight" />
          </div>
          <div className="text-figma-base font-semibold text-fw-heading">
            {formatCurrency(totalBilling * 0.3)}
          </div>
        </div>
      </div>

      {/* Next Billing */}
      <div className="flex items-center justify-between p-3 bg-fw-accent rounded-lg">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-fw-link mr-2" />
          <span className="text-figma-base text-fw-linkHover">Next Billing Date</span>
        </div>
        <span className="text-figma-base font-medium text-fw-linkHover">
          {nextBillingDate.toLocaleDateString()}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 px-3 py-2 text-figma-base text-fw-link hover:bg-fw-accent rounded-lg transition-colors">
          View Details
        </button>
        <button className="flex-1 px-3 py-2 text-figma-base text-fw-link hover:bg-fw-accent rounded-lg transition-colors">
          Download Invoice
        </button>
      </div>
    </div>
  );
}
