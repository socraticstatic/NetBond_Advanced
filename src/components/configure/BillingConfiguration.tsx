import { useState, useEffect } from 'react';
import { CreditCard, FileText, TrendingUp, Settings } from 'lucide-react';
import { SubscriptionDetails } from './billing/SubscriptionDetails';
import { PaymentMethods } from './billing/PaymentMethods';
import { UsageMetrics } from './billing/UsageMetrics';
import { InvoiceHistory } from './billing/InvoiceHistory';
import { VerticalTabGroup } from '../navigation/VerticalTabGroup';
import { TabItem } from '../../types/navigation';

interface BillingConfigurationProps {
  defaultTab?: 'subscription' | 'payment' | 'usage' | 'invoices';
}

export function BillingConfiguration({ defaultTab = 'subscription' }: BillingConfigurationProps) {
  const [activeView, setActiveView] = useState<'subscription' | 'payment' | 'usage' | 'invoices'>(defaultTab);

  useEffect(() => {
    setActiveView(defaultTab);
  }, [defaultTab]);

  const tabs: TabItem[] = [
    { id: 'subscription', label: 'Subscription', icon: <Settings className="h-5 w-5 mr-2" /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard className="h-5 w-5 mr-2" /> },
    { id: 'usage', label: 'Usage', icon: <TrendingUp className="h-5 w-5 mr-2" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="h-5 w-5 mr-2" /> }
  ];

  return (
    <div className="p-6">
      <div className="flex">
        <VerticalTabGroup
          tabs={tabs}
          activeTab={activeView}
          onChange={(tab) => setActiveView(tab as typeof activeView)}
        />

        <div className="flex-1 pl-6">
          {activeView === 'subscription' && <SubscriptionDetails />}
          {activeView === 'payment' && <PaymentMethods />}
          {activeView === 'usage' && <UsageMetrics />}
          {activeView === 'invoices' && <InvoiceHistory />}
        </div>
      </div>
    </div>
  );
}