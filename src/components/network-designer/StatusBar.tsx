import { Activity } from 'lucide-react';
import type { NetworkNode } from './types/designer';
import type { NetworkEdge } from './types/designer';

interface StatusBarProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export function StatusBar({ nodes, edges }: StatusBarProps) {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full shadow-sm border border-fw-secondary bg-fw-base whitespace-nowrap">
      <Activity className="h-4 w-4 text-fw-link" />
      <span className="text-figma-base text-fw-body font-medium">
        {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'}
      </span>
      <span className="text-fw-bodyLight">·</span>
      <span className="text-figma-base text-fw-body font-medium">
        {edges.length} {edges.length === 1 ? 'edge' : 'edges'}
      </span>
    </div>
  );
}
