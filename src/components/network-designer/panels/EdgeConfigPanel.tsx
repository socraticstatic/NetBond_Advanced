import type { NetworkEdge } from '../types/designer';
import { EDGE_TYPE_OPTIONS, BANDWIDTH_OPTIONS } from '../constants/edgeTypes';
import { FloatingPanel } from './FloatingPanel';

interface EdgeConfigPanelProps {
  edge: NetworkEdge;
  onUpdate: (id: string, updates: Partial<NetworkEdge>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const FIELD_CLASS = 'h-9 px-3 rounded-lg border border-fw-secondary text-figma-base bg-fw-base w-full focus:outline-none focus:border-fw-link';
const SELECT_CLASS = 'h-9 px-3 rounded-lg border border-fw-secondary text-figma-base bg-fw-base w-full focus:outline-none focus:border-fw-link';
const LABEL_CLASS = 'block text-figma-sm text-fw-bodyLight mb-1';

const RESILIENCE_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'redundant', label: 'Redundant' },
  { value: 'ha', label: 'HA' },
  { value: 'dual-diverse', label: 'Dual-Diverse' },
] as const;

export function EdgeConfigPanel({ edge, onUpdate, onDelete, onClose }: EdgeConfigPanelProps) {
  const updateConfig = (key: string, value: unknown) => {
    onUpdate(edge.id, { config: { ...edge.config, [key]: value } });
  };

  return (
    <FloatingPanel
      isOpen={true}
      onClose={onClose}
      title="Link Configuration"
      onDelete={() => onDelete(edge.id)}
    >
      <div className="space-y-4">
        {/* Connection Type */}
        <div>
          <label className={LABEL_CLASS}>Connection Type</label>
          <select
            className={SELECT_CLASS}
            value={edge.type}
            onChange={(e) => onUpdate(edge.id, { type: e.target.value })}
          >
            {EDGE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Bandwidth */}
        <div>
          <label className={LABEL_CLASS}>Bandwidth</label>
          <select
            className={SELECT_CLASS}
            value={edge.bandwidth}
            onChange={(e) => onUpdate(edge.id, { bandwidth: e.target.value })}
          >
            {BANDWIDTH_OPTIONS.map((bw) => (
              <option key={bw} value={bw}>{bw}</option>
            ))}
          </select>
        </div>

        {/* Resilience */}
        <div>
          <label className={LABEL_CLASS}>Resilience</label>
          <select
            className={SELECT_CLASS}
            value={edge.config?.resilience || 'single'}
            onChange={(e) =>
              updateConfig('resilience', e.target.value as 'single' | 'redundant' | 'ha' | 'dual-diverse')
            }
          >
            {RESILIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-figma-sm text-fw-bodyLight">Status</span>
          <button
            onClick={() =>
              onUpdate(edge.id, { status: edge.status === 'active' ? 'inactive' : 'active' })
            }
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              edge.status === 'active' ? 'bg-green-500' : 'bg-fw-secondary'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                edge.status === 'active' ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* VLAN ID */}
        <div>
          <label className={LABEL_CLASS}>VLAN ID</label>
          <input
            type="number"
            className={FIELD_CLASS}
            value={edge.vlan ?? ''}
            onChange={(e) =>
              onUpdate(edge.id, { vlan: e.target.value ? parseInt(e.target.value, 10) : undefined })
            }
          />
        </div>

        {/* Metrics (read-only, mock) */}
        <div className="rounded-lg border border-fw-secondary p-3 bg-fw-wash space-y-2">
          <span className="text-figma-sm font-medium text-fw-heading block mb-2">Live Metrics</span>
          <div className="flex justify-between text-figma-sm">
            <span className="text-fw-bodyLight">Latency</span>
            <span className="text-fw-body font-medium">4.2 ms</span>
          </div>
          <div className="flex justify-between text-figma-sm">
            <span className="text-fw-bodyLight">Throughput</span>
            <span className="text-fw-body font-medium">8.7 Gbps</span>
          </div>
          <div className="flex justify-between text-figma-sm">
            <span className="text-fw-bodyLight">Packet Loss</span>
            <span className="text-fw-body font-medium">0.001%</span>
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
