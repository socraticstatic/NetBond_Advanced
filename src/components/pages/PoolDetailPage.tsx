import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit2, Trash2, Users, Network, Activity, CreditCard, Settings, Plus, ExternalLink, DollarSign, Award, CheckCircle, Percent, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { MetricCard } from '../common/MetricCard';

export function PoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const groups = useStore(state => state.groups);
  const connections = useStore(state => state.connections);
  const users = useStore(state => state.users);
  const removeGroup = useStore(state => state.removeGroup);
  const termDiscounts = useStore(state => state.termDiscounts);
  const connectionTermAgreements = useStore(state => state.connectionTermAgreements);
  const addConnectionTermAgreement = useStore(state => state.addConnectionTermAgreement);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'connections' | 'members' | 'performance' | 'billing'>('overview');

  const pool = groups.find(g => g.id === id);
  const poolConnections = connections.filter(c => c.pool === id);
  const poolUsers = users.filter(u => pool?.userIds.includes(u.id));

  // Find if this pool has an active term agreement
  const activeAgreement = connectionTermAgreements.find(
    agreement => agreement.connectionId === id && agreement.status === 'active'
  );

  useEffect(() => {
    if (!pool && id) {
      navigate('/groups');
    }
  }, [pool, id, navigate]);

  if (!pool) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await removeGroup(pool.id);
      navigate('/groups');
      window.addToast({
        type: 'success',
        title: 'Pool Deleted',
        message: 'Pool has been successfully deleted.',
        duration: 3000
      });
    } catch (error) {
      window.addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete pool. Please try again.',
        duration: 3000
      });
    }
  };

  const totalBandwidth = poolConnections.reduce((total, conn) => {
    const bw = parseFloat(conn.bandwidth.replace(/[^\d.]/g, ''));
    return total + (isNaN(bw) ? 0 : bw);
  }, 0);

  const avgUtilization = poolConnections.reduce((total, conn) => {
    return total + (conn.performance?.bandwidthUtilization || 0);
  }, 0) / (poolConnections.length || 1);

  const activeConnections = poolConnections.filter(c => c.status === 'Active').length;

  return (
    <div className="min-h-screen bg-fw-wash">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/groups')}
            className="inline-flex items-center text-sm text-fw-bodyLight hover:text-fw-heading mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Pools
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-fw-heading">{pool.name}</h1>
              {pool.description && (
                <p className="mt-2 text-fw-body">{pool.description}</p>
              )}
              <div className="mt-3 flex items-center gap-3">
                <StatusBadge
                  status={pool.status}
                  label={pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
                />
                <span className="text-sm text-fw-bodyLight">Type: {pool.type}</span>
                <span className="text-sm text-fw-bodyLight">
                  Created {new Date(pool.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <IconButton
                icon={Edit2}
                label="Edit Pool"
                onClick={() => navigate(`/groups/${pool.id}/edit`)}
              />
              <IconButton
                icon={Trash2}
                label="Delete Pool"
                onClick={() => setShowDeleteConfirm(true)}
                variant="danger"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Connections"
            value={poolConnections.length.toString()}
            icon={Network}
            trend={activeConnections > 0 ? {
              value: `${activeConnections} active`,
              isPositive: true
            } : undefined}
          />
          <MetricCard
            title="Members"
            value={poolUsers.length.toString()}
            icon={Users}
          />
          <MetricCard
            title="Total Bandwidth"
            value={`${totalBandwidth} Gbps`}
            icon={Activity}
          />
          <MetricCard
            title="Avg Utilization"
            value={`${avgUtilization.toFixed(1)}%`}
            icon={CreditCard}
            trend={{
              value: avgUtilization > 75 ? 'High' : 'Normal',
              isPositive: avgUtilization <= 75
            }}
          />
        </div>

        <div className="mb-6">
          <div className="border-b border-fw-secondary">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Settings },
                { id: 'connections', label: 'Connections', icon: Network },
                { id: 'members', label: 'Members', icon: Users },
                { id: 'billing', label: 'Billing', icon: DollarSign },
                { id: 'performance', label: 'Performance', icon: Activity }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-fw-active text-fw-heading'
                      : 'border-transparent text-fw-bodyLight hover:text-fw-body hover:border-fw-secondary'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-fw-heading mb-4">Pool Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">Pool ID</dt>
                    <dd className="mt-1 text-sm text-fw-heading font-mono">{pool.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">Type</dt>
                    <dd className="mt-1 text-sm text-fw-heading capitalize">{pool.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">Status</dt>
                    <dd className="mt-1">
                      <StatusBadge
                        status={pool.status}
                        label={pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">Created</dt>
                    <dd className="mt-1 text-sm text-fw-heading">
                      {new Date(pool.createdAt).toLocaleString()}
                    </dd>
                  </div>
                  {pool.updatedAt && (
                    <div>
                      <dt className="text-sm font-medium text-fw-bodyLight">Last Updated</dt>
                      <dd className="mt-1 text-sm text-fw-heading">
                        {new Date(pool.updatedAt).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </Card>

            {pool.contacts && pool.contacts.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-fw-heading mb-4">Contacts</h3>
                  <div className="space-y-4">
                    {pool.contacts.map((contact, index) => (
                      <div key={index} className="flex items-start justify-between border-b border-fw-secondary pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium text-fw-heading">{contact.name}</p>
                          <p className="text-sm text-fw-bodyLight">{contact.role}</p>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-fw-body">{contact.email}</p>
                            <p className="text-sm text-fw-body">{contact.phone}</p>
                          </div>
                        </div>
                        {contact.isPrimary && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fw-wash text-fw-body border border-fw-secondary">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'connections' && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-fw-heading">Connections</h3>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Plus}
                  onClick={() => navigate('/wizard')}
                >
                  Add Connection
                </Button>
              </div>

              {poolConnections.length === 0 ? (
                <div className="text-center py-12">
                  <Network className="mx-auto h-12 w-12 text-fw-disabled" />
                  <h3 className="mt-2 text-sm font-medium text-fw-heading">No connections</h3>
                  <p className="mt-1 text-sm text-fw-bodyLight">
                    Get started by adding a connection to this pool.
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="primary"
                      leftIcon={Plus}
                      onClick={() => navigate('/wizard')}
                    >
                      Add Connection
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {poolConnections.map(connection => (
                    <Link
                      key={connection.id}
                      to={`/connections/${connection.id}`}
                      className="block border border-fw-secondary rounded-lg p-4 hover:border-fw-active hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-fw-heading">{connection.name}</h4>
                            <StatusBadge
                              status={connection.status.toLowerCase() as 'active' | 'inactive'}
                              label={connection.status}
                            />
                          </div>
                          <div className="mt-2 flex items-center gap-6 text-sm text-fw-bodyLight">
                            <span>{connection.type}</span>
                            <span>{connection.bandwidth}</span>
                            <span>{connection.location}</span>
                            {connection.provider && <span>{connection.provider}</span>}
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-fw-disabled" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'members' && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-fw-heading">Members</h3>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Plus}
                  onClick={() => {}}
                >
                  Add Member
                </Button>
              </div>

              <div className="space-y-4">
                {poolUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between border-b border-fw-secondary pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-fw-wash flex items-center justify-center border border-fw-secondary text-fw-heading font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-fw-heading">{user.name}</p>
                        <p className="text-sm text-fw-bodyLight">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-sm text-fw-bodyLight capitalize">{user.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Term Discount Section */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-fw-body" />
                    <h3 className="text-lg font-medium text-fw-heading">Pool Term Discount</h3>
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
                  <div className="bg-fw-wash border border-fw-secondary rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-5 w-5 text-fw-success" />
                          <h4 className="font-semibold text-fw-heading">{activeAgreement.termDiscountName}</h4>
                        </div>
                        <p className="text-sm text-fw-body">
                          Active term commitment with {activeAgreement.discountPercentage}% discount applied to all pool connections
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-fw-heading text-fw-base text-sm font-medium rounded-full">
                        {activeAgreement.discountPercentage}% OFF
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <span className="text-sm text-fw-bodyLight">Monthly Savings</span>
                        <p className="text-lg font-bold text-fw-heading">
                          ${activeAgreement.estimatedMonthlySavings.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-fw-bodyLight">Connections</span>
                        <p className="text-lg font-bold text-fw-heading">
                          {poolConnections.length}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-fw-bodyLight">Agreement Period</span>
                        <p className="text-sm font-medium text-fw-heading">
                          {new Date(activeAgreement.startDate).toLocaleDateString()} - {new Date(activeAgreement.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-fw-bodyLight">Auto-Renew</span>
                        <p className="text-sm font-medium text-fw-heading">
                          {activeAgreement.autoRenew ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>

                    {activeAgreement.status === 'expiring_soon' && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-fw-warn bg-fw-wash px-3 py-2 rounded border border-fw-warn/20">
                        <AlertTriangle className="h-4 w-4" />
                        Your term agreement is expiring soon. Contact support to renew.
                      </div>
                    )}
                  </div>
                ) : termDiscounts.length > 0 ? (
                  <div className="text-center py-8">
                    <Percent className="h-12 w-12 text-fw-disabled mx-auto mb-3" />
                    <p className="text-fw-body mb-2">No term discount applied to this pool</p>
                    <p className="text-sm text-fw-bodyLight mb-4">
                      Save up to {Math.max(...termDiscounts.map(d => d.discountPercentage))}% on all pool connections with a term commitment
                    </p>
                    <button
                      onClick={() => setShowDiscountModal(true)}
                      className="text-fw-link hover:text-fw-active font-medium"
                    >
                      View Available Discounts
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Percent className="h-12 w-12 text-fw-disabled mx-auto mb-3" />
                    <p className="text-fw-body mb-2">No term discounts configured</p>
                    <p className="text-sm text-fw-bodyLight">
                      Contact your account manager to set up term discounts
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Pool Billing Summary */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-fw-heading mb-6">Pool Billing Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">Total Connections</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {poolConnections.length}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">Estimated Monthly Cost</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      ${(poolConnections.length * 999.99).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">
                      {activeAgreement ? 'With Discount' : 'Potential Savings'}
                    </dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-success">
                      {activeAgreement
                        ? `-$${activeAgreement.estimatedMonthlySavings.toLocaleString()}`
                        : termDiscounts.length > 0
                          ? `Up to ${Math.max(...termDiscounts.map(d => d.discountPercentage))}%`
                          : 'N/A'
                      }
                    </dd>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-fw-heading mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">Avg Latency</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {pool.performance?.aggregatedMetrics.averageLatency || 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">Avg Packet Loss</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {pool.performance?.aggregatedMetrics.averagePacketLoss || 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-fw-bodyLight">Avg Uptime</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {pool.performance?.aggregatedMetrics.averageUptime || 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Apply Term Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-fw-base rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-fw-secondary">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-fw-heading">Available Term Discounts for Pool</h3>
                <button
                  onClick={() => setShowDiscountModal(false)}
                  className="text-fw-disabled hover:text-fw-body"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-fw-bodyLight mt-1">
                Choose a term commitment to receive a discount on all connections in this pool
              </p>
            </div>

            <div className="p-6 space-y-4">
              {termDiscounts
                .filter(discount => discount.isActive)
                .map((discount) => {
                  const estimatedMonthlySavings = Math.round(poolConnections.length * 999.99 * (discount.discountPercentage / 100));
                  return (
                    <div
                      key={discount.id}
                      className="border border-fw-secondary rounded-lg p-4 hover:border-fw-active hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        if (id) {
                          addConnectionTermAgreement({
                            connectionId: id,
                            connectionName: pool.name,
                            termDiscountId: discount.id,
                            termDiscountName: discount.name,
                            discountPercentage: discount.discountPercentage,
                            startDate: new Date().toISOString(),
                            endDate: new Date(
                              Date.now() + (discount.termLength * (discount.termUnit === 'years' ? 365 : 30) * 24 * 60 * 60 * 1000)
                            ).toISOString(),
                            status: 'active',
                            autoRenew: true,
                            estimatedMonthlySavings
                          });
                          window.addToast({
                            type: 'success',
                            title: 'Term Discount Applied',
                            message: `${discount.name} has been applied to this pool`,
                            duration: 3000
                          });
                          setShowDiscountModal(false);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-fw-heading">{discount.name}</h4>
                          <p className="text-sm text-fw-bodyLight mt-1">{discount.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-fw-heading text-fw-base text-sm font-bold rounded-full">
                          {discount.discountPercentage}% OFF
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-fw-bodyLight">Term Length</span>
                          <p className="font-medium text-fw-heading">
                            {discount.termLength} {discount.termUnit}
                          </p>
                        </div>
                        <div>
                          <span className="text-fw-bodyLight">Est. Monthly Savings</span>
                          <p className="font-medium text-fw-heading">
                            ${estimatedMonthlySavings.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-fw-bodyLight">Total Savings</span>
                          <p className="font-medium text-fw-heading">
                            ${Math.round(
                              estimatedMonthlySavings *
                              discount.termLength *
                              (discount.termUnit === 'years' ? 12 : 1)
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {discount.minimumSpend > 0 && (
                        <div className="mt-3 text-xs text-fw-bodyLight">
                          Minimum spend: ${discount.minimumSpend.toLocaleString()}/month per connection
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2 text-xs text-fw-body bg-fw-wash px-3 py-2 rounded">
                        <Network className="h-3 w-3" />
                        Applies to all {poolConnections.length} connection{poolConnections.length !== 1 ? 's' : ''} in this pool
                      </div>
                    </div>
                  );
                })}

              {termDiscounts.filter(d => d.isActive).length === 0 && (
                <div className="text-center py-8">
                  <Percent className="h-12 w-12 text-fw-disabled mx-auto mb-3" />
                  <p className="text-fw-body">No active term discounts available</p>
                  <p className="text-sm text-fw-bodyLight mt-1">
                    Contact your account manager to configure term discounts
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-fw-secondary bg-fw-wash">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="w-full px-4 py-2 border border-fw-secondary rounded-lg hover:bg-fw-wash font-medium text-fw-body"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Pool"
        message={`Are you sure you want to delete "${pool.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
