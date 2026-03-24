import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Network,
  Activity,
  Settings,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { AttIcon } from '../icons/AttIcon';
import { useStore } from '../../store/useStore';

function CloudRouterIcon({ className }: { className?: string }) {
  return <AttIcon name="cloudRouter" className={className} />;
}
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { MetricCard } from '../common/MetricCard';

export function CloudRouterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const connections = useStore(state => state.connections);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'vnfs' | 'performance'>('overview');

  const [cloudRouter, setCloudRouter] = useState<any>(null);
  const [parentConnection, setParentConnection] = useState<any>(null);

  useEffect(() => {
    const foundConnection = connections.find(c =>
      c.id === id || (c as any).cloudRouters?.some((cr: any) => cr.id === id)
    );

    if (foundConnection) {
      setParentConnection(foundConnection);
      const router = (foundConnection as any).cloudRouters?.find((cr: any) => cr.id === id);
      if (router) {
        setCloudRouter(router);
      }
    } else {
      navigate('/connections');
    }
  }, [connections, id, navigate]);

  if (!cloudRouter || !parentConnection) {
    return null;
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    navigate(`/connections/${parentConnection.id}`);
    window.addToast({
      type: 'success',
      title: 'Cloud Router Deleted',
      message: 'Cloud router has been successfully deleted.',
      duration: 3000
    });
  };

  const routerLinks = cloudRouter.links || [];
  const activeLinks = routerLinks.filter((l: any) => l.status === 'active').length;
  const totalBandwidth = routerLinks.reduce((total: number, link: any) => {
    const bw = parseFloat(link.bandwidth?.replace(/[^\d.]/g, '') || '0');
    return total + (isNaN(bw) ? 0 : bw);
  }, 0);

  return (
    <div className="min-h-screen bg-fw-wash">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/connections/${parentConnection.id}`)}
            className="inline-flex items-center text-figma-sm font-medium text-fw-bodyLight hover:text-fw-heading mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Connection
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CloudRouterIcon className="h-8 w-8 text-fw-link" />
                <h1 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em]">{cloudRouter.name}</h1>
              </div>
              {cloudRouter.description && (
                <p className="mt-2 text-figma-base font-medium text-fw-body">{cloudRouter.description}</p>
              )}
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <StatusBadge
                  status={cloudRouter.status}
                  label={cloudRouter.status.charAt(0).toUpperCase() + cloudRouter.status.slice(1)}
                />
                <span className="inline-flex items-center text-figma-sm font-medium text-fw-bodyLight">
                  <MapPin className="h-4 w-4 mr-1" />
                  {cloudRouter.location}
                </span>
                {cloudRouter.vendor && (
                  <span className="text-figma-sm font-medium text-fw-bodyLight">Vendor: {cloudRouter.vendor}</span>
                )}
                <Link
                  to={`/connections/${parentConnection.id}`}
                  className="inline-flex items-center text-figma-sm text-fw-link hover:text-fw-linkHover"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Parent Connection
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <IconButton
                icon={Edit2}
                label="Edit Router"
                onClick={() => {}}
              />
              <IconButton
                icon={Trash2}
                label="Delete Router"
                onClick={() => setShowDeleteConfirm(true)}
                variant="danger"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Links"
            value={routerLinks.length.toString()}
            icon={Network}
            trend={activeLinks > 0 ? {
              value: `${activeLinks} active`,
              isPositive: true
            } : undefined}
          />
          <MetricCard
            title="Total Bandwidth"
            value={`${totalBandwidth} Gbps`}
            icon={Activity}
          />
          <MetricCard
            title="BGP Sessions"
            value={cloudRouter.performance?.bgpSessions?.total?.toString() || '0'}
            icon={CloudRouterIcon}
            trend={cloudRouter.performance?.bgpSessions?.active > 0 ? {
              value: `${cloudRouter.performance.bgpSessions.active} active`,
              isPositive: true
            } : undefined}
          />
          <MetricCard
            title="CPU Usage"
            value={`${cloudRouter.performance?.cpuUsage || 0}%`}
            icon={Activity}
            trend={{
              value: cloudRouter.performance?.cpuUsage > 75 ? 'High' : 'Normal',
              isPositive: cloudRouter.performance?.cpuUsage <= 75
            }}
          />
        </div>

        <div className="mb-6">
          <div className="border-b border-fw-secondary">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Settings },
                { id: 'links', label: 'Links', icon: Network },
                { id: 'vnfs', label: 'VNFs', icon: CloudRouterIcon },
                { id: 'performance', label: 'Performance', icon: Activity }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-figma-base no-rounded tracking-[-0.03em]
                    ${activeTab === tab.id
                      ? 'border-fw-active text-fw-link'
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
                <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em] mb-4">Router Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">Router ID</dt>
                    <dd className="mt-1 text-figma-base font-medium text-fw-heading font-mono">{cloudRouter.id}</dd>
                  </div>
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">Status</dt>
                    <dd className="mt-1">
                      <StatusBadge
                        status={cloudRouter.status}
                        label={cloudRouter.status.charAt(0).toUpperCase() + cloudRouter.status.slice(1)}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">Location</dt>
                    <dd className="mt-1 text-figma-base font-medium text-fw-heading">{cloudRouter.location}</dd>
                  </div>
                  {cloudRouter.vendor && (
                    <div>
                      <dt className="text-figma-sm font-medium text-fw-bodyLight">Vendor</dt>
                      <dd className="mt-1 text-figma-base font-medium text-fw-heading">{cloudRouter.vendor}</dd>
                    </div>
                  )}
                  {cloudRouter.ipeName && (
                    <div>
                      <dt className="text-figma-sm font-medium text-fw-bodyLight">IPE</dt>
                      <dd className="mt-1 text-figma-base font-medium text-fw-heading">
                        {cloudRouter.ipeName}
                        {cloudRouter.ipeLocation && ` (${cloudRouter.ipeLocation})`}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">Created</dt>
                    <dd className="mt-1 text-figma-base font-medium text-fw-heading">
                      {new Date(cloudRouter.createdAt).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </Card>

            {cloudRouter.configuration && (
              <Card>
                <div className="p-6">
                  <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em] mb-4">Configuration</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cloudRouter.configuration.asn && (
                      <div>
                        <dt className="text-figma-sm font-medium text-fw-bodyLight">ASN</dt>
                        <dd className="mt-1 text-figma-base font-medium text-fw-heading font-mono">
                          {cloudRouter.configuration.asn}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-figma-sm font-medium text-fw-bodyLight">BGP</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-figma-sm font-medium ${
                          cloudRouter.configuration.bgpEnabled ? 'bg-fw-successLight text-fw-success' : 'bg-fw-neutral text-fw-heading'
                        }`}>
                          {cloudRouter.configuration.bgpEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </dd>
                    </div>
                    {cloudRouter.configuration.routeFilters && cloudRouter.configuration.routeFilters.length > 0 && (
                      <div className="md:col-span-2">
                        <dt className="text-figma-sm font-medium text-fw-bodyLight mb-2">Route Filters</dt>
                        <dd className="mt-1">
                          <div className="flex flex-wrap gap-2">
                            {cloudRouter.configuration.routeFilters.map((filter: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-figma-sm font-medium bg-fw-accent text-fw-link"
                              >
                                {filter}
                              </span>
                            ))}
                          </div>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </Card>
            )}

            {cloudRouter.policies && (
              <Card>
                <div className="p-6">
                  <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em] mb-4">Policies</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cloudRouter.policies.routingPolicy && (
                      <div>
                        <dt className="text-figma-sm font-medium text-fw-bodyLight">Routing Policy</dt>
                        <dd className="mt-1 text-figma-base font-medium text-fw-heading">{cloudRouter.policies.routingPolicy}</dd>
                      </div>
                    )}
                    {cloudRouter.policies.securityPolicy && (
                      <div>
                        <dt className="text-figma-sm font-medium text-fw-bodyLight">Security Policy</dt>
                        <dd className="mt-1 text-figma-base font-medium text-fw-heading">{cloudRouter.policies.securityPolicy}</dd>
                      </div>
                    )}
                    {cloudRouter.policies.qosPolicy && (
                      <div>
                        <dt className="text-figma-sm font-medium text-fw-bodyLight">QoS Policy</dt>
                        <dd className="mt-1 text-figma-base font-medium text-fw-heading">{cloudRouter.policies.qosPolicy}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <Card>
            <div className="p-6">
              <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em] mb-4">Links</h3>
              {routerLinks.length === 0 ? (
                <div className="text-center py-12">
                  <Network className="mx-auto h-12 w-12 text-fw-bodyLight" />
                  <h3 className="mt-2 text-figma-base font-medium text-fw-heading">No links</h3>
                  <p className="mt-1 text-figma-sm font-medium text-fw-bodyLight">
                    This router has no associated links.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {routerLinks.map((link: any) => (
                    <div
                      key={link.id}
                      className="border border-fw-secondary rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-fw-heading">{link.name}</h4>
                            <StatusBadge
                              status={link.status}
                              label={link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                            />
                          </div>
                          <div className="mt-2 flex items-center gap-6 text-figma-sm font-medium text-fw-bodyLight">
                            <span>VLAN {link.vlanId}</span>
                            {link.bandwidth && <span>{link.bandwidth}</span>}
                            {link.ipSubnet && <span>{link.ipSubnet}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em] mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">Latency</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {cloudRouter.performance?.latency || 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">Throughput</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {cloudRouter.performance?.throughput || 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">CPU Usage</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {cloudRouter.performance?.cpuUsage || 0}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">Memory Usage</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {cloudRouter.performance?.memoryUsage || 0}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">Routing Table Size</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {cloudRouter.performance?.routingTableSize?.toLocaleString() || 0}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-figma-sm font-medium text-fw-bodyLight">Packet Forwarding Rate</dt>
                    <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                      {cloudRouter.performance?.packetForwardingRate || 0} Mpps
                    </dd>
                  </div>
                </div>
              </div>
            </Card>

            {cloudRouter.performance?.bgpSessions && (
              <Card>
                <div className="p-6">
                  <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em] mb-4">BGP Sessions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <dt className="text-figma-sm font-medium text-fw-bodyLight">Total</dt>
                      <dd className="mt-2 text-3xl font-semibold text-fw-heading">
                        {cloudRouter.performance.bgpSessions.total}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-figma-sm font-medium text-fw-bodyLight">Active</dt>
                      <dd className="mt-2 text-3xl font-semibold text-fw-success">
                        {cloudRouter.performance.bgpSessions.active}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-figma-sm font-medium text-fw-bodyLight">Idle</dt>
                      <dd className="mt-2 text-3xl font-semibold text-fw-bodyLight">
                        {cloudRouter.performance.bgpSessions.idle}
                      </dd>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Cloud Router"
        message={`Are you sure you want to delete "${cloudRouter.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
