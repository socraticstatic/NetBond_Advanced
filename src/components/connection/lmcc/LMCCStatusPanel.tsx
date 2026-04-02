/**
 * LMCCStatusPanel - 4-path health display for LMCC connections
 *
 * Shows the 4 hosted connections across 2 diverse datacenters
 * within a metro, with per-path BGP state, VLAN ID, and status.
 */

import { Activity, Server, Wifi, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { LMCCConnection, LMCCPath, BGPState } from '../../../types/lmcc';
import { formatBandwidth } from '../../../data/lmccService';

interface LMCCStatusPanelProps {
  connection: LMCCConnection;
}

function getBgpColor(state: BGPState): string {
  switch (state) {
    case 'established': return 'text-fw-success';
    case 'open-confirm':
    case 'open-sent': return 'text-fw-warn';
    default: return 'text-fw-bodyLight';
  }
}

function getStatusIcon(path: LMCCPath) {
  switch (path.status) {
    case 'active':
      return <CheckCircle2 className="h-4 w-4 text-fw-success" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-fw-warn" />;
    case 'down':
      return <AlertTriangle className="h-4 w-4 text-fw-error" />;
  }
}

function getConnectionStatusBadge(status: LMCCConnection['status']) {
  const styles: Record<LMCCConnection['status'], { bg: string; text: string; label: string }> = {
    'pending-acceptance': { bg: 'rgba(204,122,0,0.16)', text: '#cc7a00', label: 'Pending Acceptance' },
    'provisioning': { bg: 'rgba(0,87,184,0.16)', text: '#0057b8', label: 'Provisioning' },
    'active': { bg: 'rgba(45,126,36,0.16)', text: '#2d7e24', label: 'Active' },
    'degraded': { bg: 'rgba(204,122,0,0.16)', text: '#cc7a00', label: 'Degraded' },
    'disconnected': { bg: 'rgba(204,51,51,0.16)', text: '#cc3333', label: 'Disconnected' },
  };
  const s = styles[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[10px] font-medium"
      style={{ color: s.text, backgroundColor: s.bg }}
    >
      {s.label}
    </span>
  );
}

export function LMCCStatusPanel({ connection }: LMCCStatusPanelProps) {
  const activePaths = connection.paths.filter(p => p.status === 'active').length;

  // Group paths by datacenter
  const dcGroups = connection.paths.reduce<Record<string, LMCCPath[]>>((acc, path) => {
    if (!acc[path.datacenter]) acc[path.datacenter] = [];
    acc[path.datacenter].push(path);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em]">
              LMCC - {connection.metro.name}
            </h3>
            {getConnectionStatusBadge(connection.status)}
          </div>
          <p className="text-figma-sm text-fw-bodyLight">
            {activePaths}/4 paths active - {formatBandwidth(connection.bandwidth)} per path - {connection.transport.toUpperCase()} transport
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[10px] font-medium"
            style={{ color: '#0057b8', backgroundColor: 'rgba(0,87,184,0.16)' }}>
            Maximum Resiliency
          </span>
          <p className="text-figma-xs text-fw-bodyLight mt-1">
            Contract: {connection.contractType === 'trial' ? 'Trial (Preview)' : connection.contractType.replace('fixed-', '') + ' month'}
          </p>
        </div>
      </div>

      {/* 4-Path Health Diagram */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(dcGroups).map(([dc, paths]) => (
          <div key={dc} className="border border-fw-secondary rounded-xl overflow-hidden">
            {/* Datacenter header */}
            <div className="px-4 py-3 bg-fw-wash border-b border-fw-secondary">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-fw-bodyLight" />
                <span className="text-figma-sm font-semibold text-fw-heading">{dc}</span>
              </div>
            </div>

            {/* Paths in this datacenter */}
            <div className="divide-y divide-fw-secondary">
              {paths.map((path) => (
                <div key={path.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(path)}
                    <div>
                      <p className="text-figma-sm font-medium text-fw-heading">{path.ipeId}</p>
                      <p className="text-figma-xs text-fw-bodyLight">{path.physicalPort}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <Wifi className={`h-3 w-3 ${getBgpColor(path.bgpState)}`} />
                      <span className={`text-figma-xs font-medium ${getBgpColor(path.bgpState)}`}>
                        BGP: {path.bgpState}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-figma-xs text-fw-bodyLight">
                        VLAN {path.vlanId}
                      </span>
                      <span className="text-figma-xs text-fw-bodyLight">
                        {path.awsConnectionId}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BGP / BFD Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-fw-wash border border-fw-secondary">
          <p className="text-figma-xs text-fw-bodyLight mb-1">Partner ASN</p>
          <p className="text-figma-sm font-semibold text-fw-heading">{connection.bgp.partnerASN}</p>
        </div>
        <div className="p-3 rounded-lg bg-fw-wash border border-fw-secondary">
          <p className="text-figma-xs text-fw-bodyLight mb-1">Customer ASN</p>
          <p className="text-figma-sm font-semibold text-fw-heading">{connection.bgp.customerASN}</p>
        </div>
        <div className="p-3 rounded-lg bg-fw-wash border border-fw-secondary">
          <p className="text-figma-xs text-fw-bodyLight mb-1">BFD Failover</p>
          <p className="text-figma-sm font-semibold text-fw-heading">
            {connection.bfd.multiplier}x{connection.bfd.interval}ms = {connection.bfd.multiplier * connection.bfd.interval}ms
          </p>
        </div>
      </div>

      {/* Speed change note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-fw-accent border border-fw-active/20">
        <Activity className="h-4 w-4 text-fw-link mt-0.5 shrink-0" />
        <p className="text-figma-xs text-fw-body">
          AWS does not support dynamic speed change for hosted connections. To change bandwidth: provision 4 new paths at the new speed, customer accepts in AWS Console, then delete the 4 legacy paths.
        </p>
      </div>
    </div>
  );
}
