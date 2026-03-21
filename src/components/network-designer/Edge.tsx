import { memo } from 'react';
import { EDGE_TYPE_COLORS } from './constants/edgeTypes';
import { CANVAS_BOUNDS } from './constants/canvasBounds';
import type { NetworkNode, NetworkEdge } from './types/designer';

interface EdgeProps {
  edge: NetworkEdge;
  nodes: NetworkNode[];
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const Edge = memo(function Edge({ edge, nodes, isSelected, onClick }: EdgeProps) {
  const source = nodes.find((n) => n.id === edge.source);
  const target = nodes.find((n) => n.id === edge.target);
  if (!source || !target) return null;

  const half = CANVAS_BOUNDS.NODE_SIZE / 2;
  const sx = source.x + half;
  const sy = source.y + half;
  const tx = target.x + half;
  const ty = target.y + half;
  const mx = (sx + tx) / 2;
  const my = (sy + ty) / 2;

  const serviceColor = EDGE_TYPE_COLORS[edge.type] || '#9ca3af';
  const color = isSelected ? '#3b82f6' : edge.status === 'active' ? serviceColor : '#d1d5db';
  const strokeWidth = isSelected ? 3 : 2;

  // Quadratic bezier control point
  const dx = tx - sx;
  const dy = ty - sy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offset = Math.min(dist * 0.2, 50);
  const perpX = dist > 0 ? (-dy / dist) * offset : 0;
  const perpY = dist > 0 ? (dx / dist) * offset : 0;
  const cx = mx + perpX;
  const cy = my + perpY;
  const curvePath = `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;

  // Arrow rotation
  const angle = Math.atan2(ty - sy, tx - sx);
  const angleDeg = angle * (180 / Math.PI);

  // Label rotation (keep readable)
  const labelAngle = (angleDeg > 90 || angleDeg < -90) ? angleDeg + 180 : angleDeg;

  // Label offset perpendicular to line
  const perpAngle = angle - Math.PI / 2;
  const offsetDist = 14;
  const labelX = mx + Math.cos(perpAngle) * offsetDist;
  const labelY = my + Math.sin(perpAngle) * offsetDist;

  const label = `${edge.type} - ${edge.bandwidth}`;

  return (
    <g style={{ pointerEvents: 'auto' }} onClick={() => onClick(edge.id)}>
      {/* Hit area */}
      <path
        d={curvePath}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        style={{ cursor: 'pointer' }}
      />

      {/* Visible line - quadratic bezier */}
      <path
        d={curvePath}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={edge.type === 'VPN' ? '6,4' : undefined}
        style={{ pointerEvents: 'none' }}
      />

      {/* Arrow */}
      <polygon
        points="-10,-4 0,0 -10,4"
        fill={color}
        transform={`translate(${tx},${ty}) rotate(${angleDeg})`}
        style={{ pointerEvents: 'none' }}
      />

      {/* Status dot at midpoint */}
      <circle
        cx={mx}
        cy={my}
        r={4}
        fill={edge.status === 'active' ? '#22c55e' : '#9ca3af'}
        stroke="white"
        strokeWidth={1.5}
        style={{ pointerEvents: 'none' }}
      />

      {/* Label */}
      <g transform={`translate(${labelX},${labelY}) rotate(${labelAngle})`}>
        <rect
          x={-label.length * 3}
          y={-8}
          width={label.length * 6}
          height={14}
          rx={3}
          fill="white"
          fillOpacity={0.95}
          stroke={isSelected ? '#3b82f6' : serviceColor}
          strokeWidth={0.5}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={9}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight={500}
          fill={isSelected ? '#3b82f6' : '#374151'}
        >
          {label}
        </text>
      </g>
    </g>
  );
});
