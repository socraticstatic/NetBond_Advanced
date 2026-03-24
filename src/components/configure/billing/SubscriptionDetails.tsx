import { useState } from 'react';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { PricingPlanModal } from './PricingPlanModal';
import { Button } from '../../common/Button';

export function SubscriptionDetails() {
  const [subscription] = useState({
    plan: 'Pay as you go',
    status: 'Active',
    billingCycle: 'Monthly',
    nextBilling: '2024-04-01',
    features: [
      'Up to 5 concurrent connections',
      'Basic monitoring and alerts',
      'Standard support (business hours)',
      'Core security features',
      'Basic reporting'
    ],
    usage: {
      connections: { used: 3, limit: 5 },
      bandwidth: { used: 8.5, limit: 10 },
      storage: { used: 750, limit: 1000 }
    }
  });

  const [showPricingModal, setShowPricingModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="card">
        <div className="card-header bg-fw-wash">
          <h3 className="text-lg font-medium text-fw-heading tracking-[-0.03em]">Current Plan</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-2xl font-bold text-fw-heading">{subscription.plan}</h4>
              <p className="text-figma-base text-fw-bodyLight">Billed {subscription.billingCycle.toLowerCase()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-figma-base font-medium ${
              subscription.status === 'Active'
                ? 'bg-fw-successLight text-fw-success'
                : 'bg-fw-warnLight text-fw-warn'
            }`}>
              {subscription.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Object.entries(subscription.usage).map(([resource, { used, limit }]) => {
              const percentage = (used / limit) * 100;
              const isWarning = percentage > 80;

              return (
                <div key={resource} className="space-y-2">
                  <div className="flex items-center justify-between text-figma-base">
                    <span className="font-medium text-fw-body capitalize">{resource}</span>
                    <span className="text-fw-bodyLight">
                      {used} / {limit} {resource === 'bandwidth' ? 'Gbps' : resource === 'storage' ? 'GB' : ''}
                    </span>
                  </div>
                  <div className="h-2 bg-fw-neutral rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWarning ? 'bg-fw-warnLight0' : 'bg-fw-cobalt-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {isWarning && (
                    <p className="flex items-center text-figma-sm text-fw-warn">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Approaching limit
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h5 className="text-figma-base font-medium text-fw-body">Plan Features</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subscription.features.map((feature, index) => (
                <div key={index} className="flex items-center text-figma-base text-fw-body">
                  <Package className="h-4 w-4 text-fw-link mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Actions */}
      <div className="flex space-x-4">
        <Button
          variant="primary"
          onClick={() => setShowPricingModal(true)}
          className="flex-1"
        >
          Upgrade Plan
        </Button>
        <Button
          variant="outline"
          onClick={() => {}}
          className="flex-1"
        >
          Cancel Subscription
        </Button>
      </div>

      {/* Pricing Plan Modal */}
      <PricingPlanModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        currentPlan={subscription.plan}
      />
    </div>
  );
}
