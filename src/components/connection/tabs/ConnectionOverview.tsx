import { useState } from 'react';
import { Activity, Wifi, Signal, Clock, Network, Shield, Globe, Server, TrendingUp, ArrowUpDown, Group as UserGroup, Share2, Link2, Box } from 'lucide-react';
import { Connection } from '../../../types';

import { IPEInfoTooltip } from '../../common/IPEInfoTooltip';
import { BandwidthAdjuster } from '../BandwidthAdjuster';

interface ConnectionOverviewProps {
  connection: Connection;
  cloudRoutersCount?: number;
  linksCount?: number;
  vnfsCount?: number;
}

export function ConnectionOverview({ connection, cloudRoutersCount = 0, linksCount = 0, vnfsCount = 0 }: ConnectionOverviewProps) {
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
                <Share2 className="h-5 w-5 text-fw-bodyLight mr-2" />
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
          <button className="tab-button text-[14px] font-medium text-fw-link hover:text-fw-linkHover transition-colors">
            Edit Topology
          </button>
        </div>
        {/* Mini topology diagram */}
        <div className="px-6 pb-6">
          <div className="bg-fw-base rounded-xl p-6" style={{ minHeight: '200px' }}>
            <div className="flex items-center justify-center gap-0">
              {/* Connection source */}
              <div className="flex flex-col items-center" style={{ width: '120px' }}>
                <div className="w-12 h-12 rounded-xl bg-fw-accent flex items-center justify-center border border-fw-active">
                  <Globe className="h-6 w-6 text-fw-link" />
                </div>
                <div className="text-[12px] font-medium text-fw-heading mt-2">{connection.location || 'Source'}</div>
                <div className="text-[11px] text-fw-bodyLight">{connection.type}</div>
              </div>
              {/* Arrow */}
              <div className="flex items-center self-start" style={{ marginTop: '20px' }}>
                <div className="h-0.5 w-6 bg-fw-link" />
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-fw-link" />
              </div>
              {/* Cloud Routers */}
              <div className="flex flex-col items-center" style={{ width: '120px' }}>
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center border border-green-300">
                  <Server className="h-6 w-6 text-fw-success" />
                </div>
                <div className="text-[12px] font-medium text-fw-heading mt-2">Cloud Routers</div>
                <div className="text-[11px] text-fw-bodyLight">{cloudRoutersCount} active</div>
              </div>
              {/* Arrow */}
              <div className="flex items-center self-start" style={{ marginTop: '20px' }}>
                <div className="h-0.5 w-6 bg-fw-link" />
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-fw-link" />
              </div>
              {/* Links */}
              <div className="flex flex-col items-center" style={{ width: '120px' }}>
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-300">
                  <Link2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-[12px] font-medium text-fw-heading mt-2">Links (VLANs)</div>
                <div className="text-[11px] text-fw-bodyLight">{linksCount} segments</div>
              </div>
              {/* Arrow */}
              <div className="flex items-center self-start" style={{ marginTop: '20px' }}>
                <div className="h-0.5 w-6 bg-fw-link" />
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-fw-link" />
              </div>
              {/* VNFs */}
              <div className="flex flex-col items-center" style={{ width: '120px' }}>
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-300">
                  <Shield className="h-6 w-6 text-fw-warn" />
                </div>
                <div className="text-[12px] font-medium text-fw-heading mt-2">VNFs</div>
                <div className="text-[11px] text-fw-bodyLight">{vnfsCount} functions</div>
              </div>
              {/* Arrow */}
              <div className="flex items-center self-start" style={{ marginTop: '20px' }}>
                <div className="h-0.5 w-6 bg-fw-link" />
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-fw-link" />
              </div>
              {/* Cloud destination */}
              <div className="flex flex-col items-center" style={{ width: '120px' }}>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-300">
                  <Box className="h-6 w-6 text-fw-link" />
                </div>
                <div className="text-[12px] font-medium text-fw-heading mt-2">{connection.vendor || 'Cloud'}</div>
                <div className="text-[11px] text-fw-bodyLight">{connection.bandwidth}</div>
              </div>
            </div>
          </div>
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
                connection.status === 'Active' ? 'bg-green-50 text-fw-success' : 'bg-fw-neutral text-fw-heading'
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
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
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
                    <Share2 className="h-4 w-4 text-white" />
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

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
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
                  value === true ? 'bg-green-50 text-fw-success' : 'bg-fw-accent text-fw-linkHover'
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
