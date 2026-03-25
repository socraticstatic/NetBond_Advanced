import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Wifi, Signal, Clock, Network, Shield, Globe, Server, TrendingUp, ArrowUpDown, Group as UserGroup, Link2, Box } from 'lucide-react';
import { AttIcon } from '../../icons/AttIcon';
import { Connection } from '../../../types';
import { MiniTopology } from '../MiniTopology';

import { IPEInfoTooltip } from '../../common/IPEInfoTooltip';
import { BandwidthAdjuster } from '../BandwidthAdjuster';

interface ConnectionOverviewProps {
  connection: Connection;
  cloudRoutersCount?: number;
  linksCount?: number;
  vnfsCount?: number;
}

export function ConnectionOverview({ connection, cloudRoutersCount = 0, linksCount = 0, vnfsCount = 0 }: ConnectionOverviewProps) {
  const navigate = useNavigate();
  const [currentBandwidth, setCurrentBandwidth] = useState(connection.bandwidth);

  const handleBandwidthChange = (newBandwidth: string) => {
    setCurrentBandwidth(newBandwidth);
    // In a real app, this would update the store and trigger an API call
  };
  return (
    <div className="space-y-6">
      {/* Quick Bandwidth Adjuster */}
      <BandwidthAdjuster
        currentBandwidth={currentBandwidth}
        onBandwidthChange={handleBandwidthChange}
        connectionId={connection.id}
        connectionName={connection.name}
        connectionStatus={connection.status}
      />

      {/* Network Architecture Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-fw-wash rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <AttIcon name="cloudRouter" className="h-6 w-6 text-fw-bodyLight mr-2" />
                <p className="text-figma-lg font-bold text-fw-heading">Cloud Routers</p>
              </div>
              <p className="text-figma-xl font-bold text-fw-heading">{connection.cloudRouterCount || cloudRoutersCount}</p>
              <p className="text-figma-sm text-fw-bodyLight mt-1">Virtual routing instances</p>
            </div>
          </div>
        </div>

        <div className="bg-fw-wash rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Link2 className="h-5 w-5 text-fw-bodyLight mr-2" />
                <p className="text-figma-lg font-bold text-fw-heading">Links (VLANs)</p>
              </div>
              <p className="text-figma-xl font-bold text-fw-heading">{connection.linkCount || linksCount}</p>
              <p className="text-figma-sm text-fw-bodyLight mt-1">Virtual network segments</p>
            </div>
          </div>
        </div>

        <div className="bg-fw-wash rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Box className="h-5 w-5 text-fw-bodyLight mr-2" />
                <p className="text-figma-lg font-bold text-fw-heading">VNFs</p>
              </div>
              <p className="text-figma-xl font-bold text-fw-heading">{vnfsCount}</p>
              <p className="text-figma-sm text-fw-bodyLight mt-1">Virtual network functions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Network Topology Preview */}
      <div className="bg-fw-wash rounded-2xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-fw-heading" />
              <h3 className="text-[14px] font-medium text-fw-heading">Network Topology</h3>
            </div>
            <p className="text-[12px] text-fw-bodyLight mt-0.5">Interactive visualization of your network connection</p>
          </div>
          <button
            onClick={() => navigate('/create', { state: { editMode: true, connectionId: connection.id, connectionName: connection.name, connectionStatus: connection.status } })}
            className="tab-button text-[14px] font-medium text-fw-link hover:text-fw-linkHover transition-colors"
          >
            Edit Topology
          </button>
        </div>
        {/* Mini topology canvas */}
        <div className="px-6 pb-6">
          <MiniTopology
            connection={connection}
            cloudRoutersCount={cloudRoutersCount}
            linksCount={linksCount}
            vnfsCount={vnfsCount}
          />
        </div>
      </div>

      {/* Connection Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Information */}
        <div className="bg-fw-wash rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Network className="h-5 w-5 text-fw-bodyLight mr-2" />
            <h3 className="text-figma-lg font-medium text-fw-heading">Connection Information</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-fw-wash rounded-lg">
              <span className="text-figma-base text-fw-body">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-figma-sm font-medium ${
                connection.status === 'Active' ? 'bg-fw-successLight text-fw-success' : 'bg-fw-neutral text-fw-heading'
              }`}>
                {connection.status}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-fw-wash rounded-lg">
              <span className="text-figma-base text-fw-body">Type</span>
              <span className="text-figma-base font-medium text-fw-heading">{connection.type}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-fw-wash rounded-lg">
              <span className="text-figma-base text-fw-body">Bandwidth</span>
              <span className="text-figma-base font-medium text-fw-heading">{currentBandwidth}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-fw-wash rounded-lg">
              <span className="text-figma-base text-fw-body">Location</span>
              <span className="text-figma-base font-medium text-fw-heading">{connection.location}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-fw-wash rounded-lg">
              <span className="text-figma-base text-fw-body">Cloud Provider</span>
              <span className="text-figma-base font-medium text-fw-heading">{connection.provider || 'N/A'}</span>
            </div>

            {connection.primaryIPE && (
              <>
                <div className="flex items-center justify-between p-3 bg-fw-wash rounded-lg border border-fw-secondary">
                  <div className="flex items-center">
                    <Server className="h-4 w-4 text-fw-link mr-2" />
                    <span className="text-figma-base text-fw-body">Primary IPE</span>
                  </div>
                  <span className="text-figma-base font-medium text-fw-heading">{connection.primaryIPE}</span>
                </div>
                {connection.secondaryIPE && (
                  <div className="flex items-center justify-between p-3 bg-fw-successLight rounded-lg border border-fw-success">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 text-fw-success mr-2" />
                      <span className="text-figma-base text-fw-body">Secondary IPE (Redundant)</span>
                    </div>
                    <span className="text-figma-base font-medium text-fw-heading">{connection.secondaryIPE}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {connection.primaryIPE && (
            <div className="mt-4 pt-4 border-t border-fw-secondary flex items-start space-x-2">
              <IPEInfoTooltip variant="connection" className="flex-shrink-0 mt-0.5" />
              <p className="text-figma-base text-fw-bodyLight">
                <strong>IPE (Infrastructure Provider Edge Router)</strong> is the physical router at the data center where your virtual connection runs. It provides the actual network capacity and cloud provider on-ramps.
              </p>
            </div>
          )}
        </div>

        {/* Network Architecture Explanation */}
        <div className="bg-fw-wash rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Network className="h-5 w-5 text-fw-bodyLight mr-2" />
            <h3 className="text-figma-lg font-medium text-fw-heading">Network Architecture</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-fw-accent rounded-lg border border-fw-active">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-fw-bodyLight flex items-center justify-center">
                    <AttIcon name="cloudRouter" className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-figma-base font-semibold text-fw-heading tracking-[-0.03em] mb-1">Cloud Routers</h4>
                  <p className="text-figma-base text-fw-bodyLight">
                    Virtual routing instances that provide connectivity to cloud providers and other networks. Each cloud router can be associated with multiple links.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-fw-bodyLight">↓</div>
            </div>

            <div className="p-4 bg-fw-successLight rounded-lg border border-fw-successLight">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-fw-success flex items-center justify-center">
                    <Link2 className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-figma-base font-semibold text-fw-heading tracking-[-0.03em] mb-1">Links (VLANs)</h4>
                  <p className="text-figma-base text-fw-bodyLight">
                    Virtual network segments that connect to one or more cloud routers. Links provide Layer 2/3 connectivity and can carry traffic for multiple VNFs.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-fw-bodyLight">↓</div>
            </div>

            <div className="p-4 bg-fw-wash rounded-lg border border-fw-secondary">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-fw-bodyLight flex items-center justify-center">
                    <Box className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-figma-base font-semibold text-fw-heading tracking-[-0.03em] mb-1">Virtual Network Functions</h4>
                  <p className="text-figma-base text-fw-bodyLight">
                    Software-based network services (firewalls, load balancers, SD-WAN) that run on one or more links. VNFs provide advanced networking capabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-fw-secondary">
            <p className="text-figma-sm text-fw-bodyLight">
              <strong>Hierarchy:</strong> Connection → Cloud Routers ← Links (many-to-many) → VNFs (many-to-many)
            </p>
          </div>
        </div>

        {/* Security Overview */}
        <div className="bg-fw-wash rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-fw-bodyLight mr-2" />
            <h3 className="text-figma-lg font-medium text-fw-heading">Security Overview</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(connection.security || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-fw-wash rounded-lg">
                <span className="text-figma-base text-fw-body">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-figma-sm font-medium ${
                  value === true ? 'bg-fw-successLight text-fw-success' : 'bg-fw-accent text-fw-linkHover'
                }`}>
                  {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-fw-secondary">
            <p className="text-figma-base text-fw-bodyLight">
              Security features protect your data during transit through encryption, firewall rules, and DDoS protection mechanisms.
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-fw-wash rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-fw-bodyLight mr-2" />
            <h3 className="text-figma-lg font-medium text-fw-heading">Performance Metrics</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-fw-wash rounded-lg">
              <div className="flex flex-col">
                <span className="text-figma-sm text-fw-bodyLight mb-1">Latency</span>
                <span className="text-figma-lg font-medium text-fw-heading">{connection.performance?.latency || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 bg-fw-wash rounded-lg">
              <div className="flex flex-col">
                <span className="text-figma-sm text-fw-bodyLight mb-1">Packet Loss</span>
                <span className="text-figma-lg font-medium text-fw-heading">{connection.performance?.packetLoss || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 bg-fw-wash rounded-lg">
              <div className="flex flex-col">
                <span className="text-figma-sm text-fw-bodyLight mb-1">Uptime</span>
                <span className="text-figma-lg font-medium text-fw-heading">{connection.performance?.uptime || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 bg-fw-wash rounded-lg">
              <div className="flex flex-col">
                <span className="text-figma-sm text-fw-bodyLight mb-1">Bandwidth Utilization</span>
                <span className="text-figma-lg font-medium text-fw-heading">{connection.performance?.bandwidthUtilization || 0}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-fw-secondary">
            <p className="text-figma-base text-fw-bodyLight">
              Performance metrics are updated every 5 minutes. These metrics help you monitor the health and efficiency of your connection.
            </p>
          </div>
        </div>

        {/* Connection Features */}
        <div className="bg-fw-wash rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Server className="h-5 w-5 text-fw-bodyLight mr-2" />
            <h3 className="text-figma-lg font-medium text-fw-heading">Connection Features</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {Object.entries(connection.features || {}).map(([key, value]) => (
              <div key={key} className="flex items-center p-3 bg-fw-wash rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-fw-accent flex items-center justify-center">
                    <Server className="h-4 w-4 text-fw-link" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-figma-base font-medium text-fw-heading">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-figma-base text-fw-bodyLight">
                    {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-fw-secondary">
            <p className="text-figma-base text-fw-bodyLight">
              Connection features define capabilities like redundancy, load balancing, and auto-scaling that enhance your network's resilience and performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
