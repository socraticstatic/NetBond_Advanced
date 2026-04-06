import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network } from 'lucide-react';
import { CopyButton } from '../../common/CopyButton';
import { Connection } from '../../../types';
import { MiniTopology } from '../MiniTopology';
import { LMCCStatusPanel } from '../lmcc/LMCCStatusPanel';
import { MOCK_LMCC_CONNECTIONS } from '../../../data/lmccService';
import { ResiliencyMap } from './ResiliencyMap';

interface ConnectionOverviewProps {
  connection: Connection;
  cloudRoutersCount?: number;
  linksCount?: number;
  vnfsCount?: number;
}

function Row({ label, value, copy }: { label: string; value: string | React.ReactNode; copy?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-fw-secondary/50 last:border-b-0">
      <span className="text-figma-sm text-fw-bodyLight">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-figma-sm font-medium text-fw-heading">{value}</span>
        {copy && <CopyButton value={copy} />}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'Active' ? 'text-fw-success' : status === 'Pending' ? 'text-fw-warn' : 'text-fw-bodyLight';
  return <span className={`text-figma-sm font-medium ${color}`}>{status}</span>;
}

export function ConnectionOverview({ connection, cloudRoutersCount = 0, linksCount = 0, vnfsCount = 0 }: ConnectionOverviewProps) {
  const navigate = useNavigate();
  const isLmcc = connection.configuration?.isLmcc;
  const lmccConnection = isLmcc ? MOCK_LMCC_CONNECTIONS.find(c => c.status === 'active') : null;
  const isActive = connection.status === 'Active';
  const isPending = connection.status === 'Pending' || connection.status === 'Provisioning';
  const providers = connection.providers?.join(', ') || connection.provider || 'N/A';
  const locations = connection.locations?.join(', ') || connection.location || 'N/A';

  return (
    <div className="space-y-6">
      {/* LMCC 4-path panel (only for LMCC connections) */}
      {isLmcc && lmccConnection && (
        <div className="bg-fw-base rounded-xl border border-fw-secondary p-5">
          <LMCCStatusPanel connection={lmccConnection} />
        </div>
      )}

      {/* Area 1: Two columns - Details + Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Connection Details */}
        <div className="bg-fw-base rounded-xl border border-fw-secondary p-5">
          <h3 className="text-figma-base font-bold text-fw-heading mb-3">Connection Details</h3>
          <Row label="Type" value={connection.type} />
          <Row label="Provider" value={providers} />
          <Row label="Location" value={locations} copy={locations} />
          <Row label="Bandwidth" value={connection.bandwidth} />
          <Row label="Plan" value={connection.billing?.planId?.replace(/-/g, ' ') || 'Pay as you go'} />
          {connection.primaryIPE && connection.primaryIPE !== 'Not provisioned' && connection.primaryIPE !== 'Not configured' && (
            <Row label="Primary IPE" value={connection.primaryIPE} copy={connection.primaryIPE} />
          )}
          {connection.secondaryIPE && (
            <Row label="Secondary IPE" value={connection.secondaryIPE} copy={connection.secondaryIPE} />
          )}
          {connection.security?.encryption && (
            <Row label="Encryption" value={connection.security.encryption} />
          )}
          {connection.security?.firewall !== undefined && (
            <Row label="Firewall" value={connection.security.firewall ? 'Enabled' : 'Disabled'} />
          )}
          {connection.security?.ddosProtection !== undefined && (
            <Row label="DDoS Protection" value={connection.security.ddosProtection ? 'Enabled' : 'Disabled'} />
          )}
        </div>

        {/* Right: Performance + Cost */}
        <div className="bg-fw-base rounded-xl border border-fw-secondary p-5">
          {isActive && connection.performance ? (
            <>
              <h3 className="text-figma-base font-bold text-fw-heading mb-3">Performance</h3>
              <Row label="Latency" value={connection.performance.latency} />
              <Row label="Packet Loss" value={connection.performance.packetLoss} />
              <Row label="Uptime" value={connection.performance.uptime} />
              <Row label="Utilization" value={`${connection.performance.bandwidthUtilization}%`} />
              <Row label="Current Usage" value={connection.performance.currentUsage} />
              <div className="mt-4 pt-3 border-t border-fw-secondary">
                <Row label="Monthly Cost" value={`$${connection.billing?.total?.toLocaleString() || '999'}/mo`} />
              </div>
            </>
          ) : isPending ? (
            <>
              <h3 className="text-figma-base font-bold text-fw-heading mb-3">Status</h3>
              <Row label="Status" value={<StatusBadge status={connection.status} />} />
              <Row label="Estimated Cost" value={`$${connection.billing?.total?.toLocaleString() || '999'}/mo`} />
              <p className="text-figma-sm text-fw-bodyLight mt-4">Performance metrics available after activation.</p>
            </>
          ) : (
            <>
              <h3 className="text-figma-base font-bold text-fw-heading mb-3">Status</h3>
              <Row label="Status" value={<StatusBadge status={connection.status} />} />
              <Row label="Monthly Cost" value={`$${connection.billing?.total?.toLocaleString() || '999'}/mo`} />
            </>
          )}
        </div>
      </div>

      {/* Area 2: Network Topology */}
      <div className="bg-fw-base rounded-xl border border-fw-secondary overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between border-b border-fw-secondary">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-fw-bodyLight" />
            <h3 className="text-figma-base font-bold text-fw-heading">Network Topology</h3>
          </div>
          <button
            onClick={() => navigate('/create', { state: { editMode: true, connectionId: connection.id, connectionName: connection.name, connectionStatus: connection.status } })}
            className="text-figma-sm font-medium text-fw-link hover:text-fw-linkHover transition-colors"
          >
            Edit Topology
          </button>
        </div>
        <div className="p-5">
          <MiniTopology
            connection={connection}
            cloudRoutersCount={cloudRoutersCount}
            linksCount={linksCount}
            vnfsCount={vnfsCount}
          />
        </div>
      </div>

      {/* Area 3: Resiliency (conditional) */}
      {connection.status !== 'Pending' && connection.status !== 'Provisioning' && (
        <div className="bg-fw-base rounded-xl border border-fw-secondary p-5">
          <ResiliencyMap connection={connection} />
        </div>
      )}
    </div>
  );
}
