import { useState } from 'react';
import {
  DollarSign, CreditCard, Receipt, Clock, TrendingUp,
  Download, FileText, AlertTriangle, Percent, ArrowUpDown,
  Calendar, RefreshCw, Award, CheckCircle
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { Button } from '../../common/Button';

interface BillingConfigurationProps {
  isEditing?: boolean;
  connectionId?: string;
}

export function BillingConfiguration({ isEditing, connectionId }: BillingConfigurationProps) {
  const {
    termDiscounts,
    connectionTermAgreements,
    addConnectionTermAgreement
  } = useStore();

  const [showDiscountModal, setShowDiscountModal] = useState(false);

  // Find if this connection has an active term agreement
  const activeAgreement = connectionTermAgreements.find(
    agreement => agreement.connectionId === connectionId && agreement.status === 'active'
  );

  const [config] = useState({
    // Base Plan Configuration
    plan: {
      name: 'Enterprise',
      basePrice: 999.99,
      billingCycle: 'monthly',
      autoRenew: true,
      startDate: '2024-01-01',
      nextBillingDate: '2024-04-01',
      status: 'active'
    },

    // Usage-based Pricing
    usage: {
      bandwidth: {
        included: '10TB',
        overage: '$0.08/GB',
        current: '8.5TB',
        forecast: '9.2TB'
      },
      ports: {
        included: 4,
        overage: '$99/port',
        current: 3
      }
    },

    // Add-ons and Features
    addons: [
      {
        name: 'DDoS Protection',
        price: 299.99,
        status: 'active',
        details: 'Advanced DDoS mitigation up to 10Tbps'
      },
      {
        name: 'Redundant Path',
        price: 199.99,
        status: 'active',
        details: 'Automatic failover with secondary connection'
      }
    ],

    // Billing History
    history: [
      {
        id: 'INV-2024-003',
        date: '2024-03-01',
        amount: 1499.97,
        status: 'paid',
        items: [
          { description: 'Base Plan', amount: 999.99 },
          { description: 'DDoS Protection', amount: 299.99 },
          { description: 'Redundant Path', amount: 199.99 }
        ]
      },
      {
        id: 'INV-2024-002',
        date: '2024-02-01',
        amount: 1499.97,
        status: 'paid',
        items: [
          { description: 'Base Plan', amount: 999.99 },
          { description: 'DDoS Protection', amount: 299.99 },
          { description: 'Redundant Path', amount: 199.99 }
        ]
      }
    ],

    // Payment Configuration
    payment: {
      method: 'credit_card',
      card: {
        brand: 'visa',
        last4: '4242',
        expiry: '12/25'
      },
      autopay: true,
      billingEmail: 'billing@example.com'
    },

    // Cost Allocation
    costAllocation: {
      department: 'IT Infrastructure',
      costCenter: 'CC-123456',
      projectCode: 'PROJ-789',
      tags: {
        environment: 'production',
        business_unit: 'cloud_services'
      }
    },

    // Alerts and Notifications
    alerts: {
      usageThreshold: 80,
      budgetThreshold: 90,
      recipients: ['admin@example.com', 'finance@example.com'],
      channels: ['email', 'slack']
    }
  });

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em]">Current Plan</h3>
          <span className={`px-2 py-1 text-figma-sm rounded-lg ${
            config.plan.status === 'active'
              ? 'bg-green-50 text-fw-success'
              : 'bg-fw-warn/10 text-fw-warn'
          }`}>
            {config.plan.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <span className="text-figma-sm text-fw-bodyLight">Base Plan</span>
            <div className="mt-1">
              <span className="text-figma-xl font-bold text-fw-heading">${config.plan.basePrice}</span>
              <span className="text-fw-bodyLight">/{config.plan.billingCycle}</span>
            </div>
          </div>
          <div>
            <span className="text-figma-sm text-fw-bodyLight">Billing Cycle</span>
            <div className="mt-1 flex items-center">
              <Calendar className="h-5 w-5 text-fw-bodyLight mr-2" />
              <span className="text-fw-heading">Monthly</span>
            </div>
          </div>
          <div>
            <span className="text-figma-sm text-fw-bodyLight">Next Billing Date</span>
            <div className="mt-1 flex items-center">
              <Clock className="h-5 w-5 text-fw-bodyLight mr-2" />
              <span className="text-fw-heading">{new Date(config.plan.nextBillingDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            <span className="text-figma-sm text-fw-bodyLight">Auto-Renew</span>
            <div className="mt-1 flex items-center">
              <RefreshCw className="h-5 w-5 text-fw-bodyLight mr-2" />
              <span className="text-fw-heading">{config.plan.autoRenew ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Term Discount */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Term Discount</h3>
          </div>
          {!activeAgreement && termDiscounts.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowDiscountModal(true)}
            >
              Apply Term Discount
            </Button>
          )}
        </div>

        {activeAgreement ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">{activeAgreement.termDiscountName}</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Active term commitment with {activeAgreement.discountPercentage}% discount
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                {activeAgreement.discountPercentage}% OFF
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <span className="text-sm text-blue-700">Monthly Savings</span>
                <p className="text-lg font-bold text-blue-900">
                  ${activeAgreement.estimatedMonthlySavings.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-blue-700">Agreement Period</span>
                <p className="text-sm font-medium text-blue-900">
                  {new Date(activeAgreement.startDate).toLocaleDateString()} - {new Date(activeAgreement.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-blue-700">Auto-Renew</span>
                <p className="text-sm font-medium text-blue-900">
                  {activeAgreement.autoRenew ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            {activeAgreement.status === 'expiring_soon' && (
              <div className="mt-3 flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded border border-yellow-200">
                <AlertTriangle className="h-4 w-4" />
                Your term agreement is expiring soon. Contact support to renew.
              </div>
            )}
          </div>
        ) : termDiscounts.length > 0 ? (
          <div className="text-center py-6">
            <Percent className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No term discount applied</p>
            <p className="text-sm text-gray-500 mb-4">
              Save up to {Math.max(...termDiscounts.map(d => d.discountPercentage))}% with a term commitment
            </p>
            <button
              onClick={() => setShowDiscountModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View Available Discounts
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Percent className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No term discounts configured</p>
            <p className="text-sm text-gray-500">
              Contact your account manager to set up term discounts
            </p>
          </div>
        )}
      </div>

      {/* Usage & Metering */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em] mb-6">Usage & Metering</h3>

        {/* Bandwidth Usage */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-figma-sm font-medium text-fw-body">Bandwidth Usage</span>
            <span className="text-figma-sm text-fw-bodyLight">
              {config.usage.bandwidth.current} of {config.usage.bandwidth.included} included
            </span>
          </div>
          <div className="relative">
            <div className="h-2 bg-fw-neutral rounded-full">
              <div
                className="h-2 bg-fw-cobalt-600 rounded-full"
                style={{ width: `${(parseFloat(config.usage.bandwidth.current) / parseFloat(config.usage.bandwidth.included.replace('TB', ''))) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-figma-sm text-fw-bodyLight">
            <span>Forecast: {config.usage.bandwidth.forecast}</span>
            <span>Overage Rate: {config.usage.bandwidth.overage}</span>
          </div>
        </div>

        {/* Port Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-figma-sm font-medium text-fw-body">Port Usage</span>
            <span className="text-figma-sm text-fw-bodyLight">
              {config.usage.ports.current} of {config.usage.ports.included} included
            </span>
          </div>
          <div className="relative">
            <div className="h-2 bg-fw-neutral rounded-full">
              <div
                className="h-2 bg-fw-cobalt-600 rounded-full"
                style={{ width: `${(config.usage.ports.current / config.usage.ports.included) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-figma-sm text-fw-bodyLight">
            <span>Additional Ports: {config.usage.ports.overage}</span>
          </div>
        </div>
      </div>

      {/* Add-ons */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em] mb-6">Add-ons & Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.addons.map((addon) => (
            <div key={addon.name} className="p-4 bg-fw-wash rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-fw-heading">{addon.name}</span>
                <span className="text-fw-link">${addon.price}/mo</span>
              </div>
              <p className="text-figma-sm text-fw-bodyLight mb-3">{addon.details}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-figma-sm rounded-lg ${
                  addon.status === 'active'
                    ? 'bg-green-50 text-fw-success'
                    : 'bg-fw-neutral text-fw-heading'
                }`}>
                  {addon.status.toUpperCase()}
                </span>
                <button className="text-figma-base text-fw-error hover:text-fw-error">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em]">Payment Information</h3>
          <button className="text-figma-base text-fw-link hover:text-fw-linkHover">
            Update Payment Method
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-fw-wash rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-fw-bodyLight" />
              <div>
                <div className="text-figma-base font-medium text-fw-heading">
                  {config.payment.card.brand.toUpperCase()} ending in {config.payment.card.last4}
                </div>
                <div className="text-figma-sm text-fw-bodyLight">
                  Expires {config.payment.card.expiry}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-fw-wash rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-figma-base font-medium text-fw-heading">Auto-Pay</span>
              <span className={`px-2 py-1 text-figma-sm rounded-lg ${
                config.payment.autopay
                  ? 'bg-green-50 text-fw-success'
                  : 'bg-fw-neutral text-fw-heading'
              }`}>
                {config.payment.autopay ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <div className="text-figma-sm text-fw-bodyLight">
              Billing Email: {config.payment.billingEmail}
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-fw-base rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em]">Billing History</h3>
          <button className="text-figma-base text-fw-link hover:text-fw-linkHover flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-fw-secondary">
            <thead className="bg-fw-wash">
              <tr>
                <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                  Invoice
                </th>
                <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                  Date
                </th>
                <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                  Amount
                </th>
                <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                  Status
                </th>
                <th scope="col" className="relative px-6 h-12">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-fw-base divide-y divide-fw-secondary">
              {config.history.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-fw-wash transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-fw-bodyLight mr-2" />
                      <div className="text-figma-base font-medium text-fw-heading">{invoice.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-figma-base text-fw-heading">
                      {new Date(invoice.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-figma-base text-fw-heading">${invoice.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-figma-sm leading-5 font-semibold rounded-lg ${
                      invoice.status === 'paid'
                        ? 'bg-green-50 text-fw-success'
                        : 'bg-fw-warn/10 text-fw-warn'
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-figma-base font-medium">
                    <button className="text-fw-link hover:text-fw-linkHover">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Allocation */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em] mb-6">Cost Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <label className="fw-label">Department</label>
                <input
                  type="text"
                  value={config.costAllocation.department}
                  disabled={!isEditing}
                  className="fw-input disabled:bg-fw-wash disabled:text-fw-bodyLight"
                />
              </div>
              <div>
                <label className="fw-label">Cost Center</label>
                <input
                  type="text"
                  value={config.costAllocation.costCenter}
                  disabled={!isEditing}
                  className="fw-input disabled:bg-fw-wash disabled:text-fw-bodyLight"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="fw-label">Tags</label>
            <div className="space-y-2">
              {Object.entries(config.costAllocation.tags).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <span className="text-figma-sm text-fw-bodyLight">{key}:</span>
                  <span className="text-figma-base text-fw-heading">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Billing Alerts */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em] mb-6">Billing Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="fw-label">Usage Threshold</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={config.alerts.usageThreshold}
                  disabled={!isEditing}
                  className="fw-input disabled:bg-fw-wash disabled:text-fw-bodyLight"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
            <div>
              <label className="fw-label">Budget Threshold</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={config.alerts.budgetThreshold}
                  disabled={!isEditing}
                  className="fw-input disabled:bg-fw-wash disabled:text-fw-bodyLight"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
          </div>
          <div>
            <label className="fw-label">Alert Recipients</label>
            <div className="space-y-2">
              {config.alerts.recipients.map((recipient) => (
                <div key={recipient} className="flex items-center justify-between">
                  <span className="text-figma-base text-fw-heading">{recipient}</span>
                  {isEditing && (
                    <button className="text-figma-base text-fw-error hover:text-fw-error">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Term Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Available Term Discounts</h3>
                <button
                  onClick={() => setShowDiscountModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Choose a term commitment to receive a discount on this connection
              </p>
            </div>

            <div className="p-6 space-y-4">
              {termDiscounts
                .filter(discount => discount.isActive)
                .map((discount) => (
                  <div
                    key={discount.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      if (connectionId) {
                        addConnectionTermAgreement({
                          connectionId,
                          connectionName: 'Current Connection',
                          termDiscountId: discount.id,
                          termDiscountName: discount.name,
                          discountPercentage: discount.discountPercentage,
                          startDate: new Date().toISOString(),
                          endDate: new Date(
                            Date.now() + (discount.termLength * (discount.termUnit === 'years' ? 365 : 30) * 24 * 60 * 60 * 1000)
                          ).toISOString(),
                          status: 'active',
                          autoRenew: true,
                          estimatedMonthlySavings: Math.round(config.plan.basePrice * (discount.discountPercentage / 100))
                        });
                        window.addToast({
                          type: 'success',
                          title: 'Term Discount Applied',
                          message: `${discount.name} has been applied to this connection`,
                          duration: 3000
                        });
                        setShowDiscountModal(false);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{discount.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{discount.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                        {discount.discountPercentage}% OFF
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Term Length</span>
                        <p className="font-medium text-gray-900">
                          {discount.termLength} {discount.termUnit}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Est. Monthly Savings</span>
                        <p className="font-medium text-gray-900">
                          ${Math.round(config.plan.basePrice * (discount.discountPercentage / 100)).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Savings</span>
                        <p className="font-medium text-gray-900">
                          ${Math.round(
                            config.plan.basePrice *
                            (discount.discountPercentage / 100) *
                            discount.termLength *
                            (discount.termUnit === 'years' ? 12 : 1)
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {discount.minimumSpend > 0 && (
                      <div className="mt-3 text-xs text-gray-500">
                        Minimum spend: ${discount.minimumSpend.toLocaleString()}/month
                      </div>
                    )}
                  </div>
                ))}

              {termDiscounts.filter(d => d.isActive).length === 0 && (
                <div className="text-center py-8">
                  <Percent className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No active term discounts available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Contact your account manager to configure term discounts
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}