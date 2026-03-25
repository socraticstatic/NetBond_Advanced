import { useMemo } from 'react';
import { Cloud } from 'lucide-react';
import { AttIcon } from '../icons/AttIcon';
import type { Connection } from '../../types';

interface MiniTopologyProps {
  connection: Connection;
  cloudRoutersCount?: number;
  linksCount?: number;
  vnfsCount?: number;
}

interface MiniNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  icon: 'cloudRouter' | 'cloud' | 'ipe';
  isActive: boolean;
  cloudProvider?: string;
}

interface MiniEdge {
  from: string;
  to: string;
  isActive: boolean;
}

const NODE_W = 64;
const NODE_H = 64;

function getProviderLabel(connection: Connection): string {
  if (connection.provider) return connection.provider;
  if (connection.providers && connection.providers.length > 0) return connection.providers[0];
  return 'Cloud';
}

export function MiniTopology({ connection, cloudRoutersCount = 2, linksCount = 0, vnfsCount = 0 }: MiniTopologyProps) {
  const isActive = connection.status === 'Active';

  const { nodes, edges } = useMemo(() => {
    const n: MiniNode[] = [];
    const e: MiniEdge[] = [];
    const hasMultiCloud = connection.providers && connection.providers.length > 1;
    const centerY = 80;

    // AT&T Core (source)
    n.push({
      id: 'core',
      x: 60,
      y: centerY,
      label: connection.location || 'AT&T Core',
      sublabel: connection.type === 'Internet to Cloud' ? 'Internet' : 'MPLS',
      icon: 'ipe',
      isActive,
    });

    // Cloud Router (center)
    n.push({
      id: 'router',
      x: 260,
      y: centerY,
      label: 'Cloud Router',
      sublabel: cloudRoutersCount > 0 ? `${cloudRoutersCount} active` : undefined,
      icon: 'cloudRouter',
      isActive,
    });

    e.push({ from: 'core', to: 'router', isActive });

    // Primary cloud destination
    const provider = getProviderLabel(connection);
    n.push({
      id: 'cloud1',
      x: 460,
      y: hasMultiCloud ? centerY - 50 : centerY,
      label: `${provider} Cloud`,
      sublabel: connection.bandwidth,
      icon: 'cloud',
      isActive,
      cloudProvider: provider.toLowerCase(),
    });
    e.push({ from: 'router', to: 'cloud1', isActive });

    // Secondary cloud if multi-cloud
    if (hasMultiCloud && connection.providers && connection.providers[1]) {
      n.push({
        id: 'cloud2',
        x: 460,
        y: centerY + 50,
        label: `${connection.providers[1]} Cloud`,
        sublabel: connection.bandwidth,
        icon: 'cloud',
        isActive: false,
        cloudProvider: connection.providers[1].toLowerCase(),
      });
      e.push({ from: 'router', to: 'cloud2', isActive: false });
    }

    return { nodes: n, edges: e };
  }, [connection, cloudRoutersCount, isActive]);

  // Compute SVG edge lines
  const edgeLines = edges.map((edge) => {
    const fromNode = nodes.find((n) => n.id === edge.from);
    const toNode = nodes.find((n) => n.id === edge.to);
    if (!fromNode || !toNode) return null;

    const x1 = fromNode.x + NODE_W;
    const y1 = fromNode.y + NODE_H / 2;
    const x2 = toNode.x;
    const y2 = toNode.y + NODE_H / 2;

    // Curved path
    const midX = (x1 + x2) / 2;
    const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

    return (
      <path
        key={`${edge.from}-${edge.to}`}
        d={d}
        fill="none"
        stroke={edge.isActive ? '#0057b8' : '#9ca3af'}
        strokeWidth={2}
        strokeDasharray={edge.isActive ? 'none' : '6 4'}
      />
    );
  });

  return (
    <div className="relative bg-fw-base rounded-xl" style={{ height: '220px' }}>
      {/* Edge lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edgeLines}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute flex flex-col items-center"
          style={{ left: node.x, top: node.y }}
        >
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-shadow ${
              node.isActive
                ? node.icon === 'cloudRouter'
                  ? 'bg-pink-50 border-pink-300'
                  : node.icon === 'ipe'
                    ? 'bg-purple-50 border-purple-300'
                    : 'bg-blue-50 border-blue-300'
                : 'bg-white border-gray-200 border-dashed'
            }`}
          >
            {node.icon === 'cloudRouter' ? (
              <AttIcon name="cloudRouter" className="w-8 h-8 text-fw-heading" />
            ) : node.icon === 'ipe' ? (
              <AttIcon name="cloudRouter" className="w-8 h-8 text-fw-heading" />
            ) : (
              <Cloud className="w-6 h-6 text-fw-heading" />
            )}
            {/* Status dot */}
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                node.isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          </div>
          <span className="text-figma-xs font-medium text-fw-heading mt-1.5 text-center max-w-[100px] truncate">
            {node.label}
          </span>
          {node.sublabel && (
            <span className="text-[11px] text-fw-bodyLight text-center">
              {node.sublabel}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
