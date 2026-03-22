import { useMemo, useState } from 'react';
import { Activity, AlertCircle, AlertTriangle, Info, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { NetworkNode, NetworkEdge } from './types/designer';
import { validateTopology } from './engine/validationEngine';

interface StatusBarProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export function StatusBar({ nodes, edges }: StatusBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const issues = useMemo(
    () => validateTopology(nodes, edges),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, edges, refreshKey]
  );

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  const hasIssues = issues.length > 0;

  return (
    <div className="relative">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full shadow-sm border border-fw-secondary bg-fw-base whitespace-nowrap">
        <Activity className="h-4 w-4 text-fw-link" />

        <span className="text-figma-base text-fw-body font-medium">
          {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'}
        </span>

        <span className="text-fw-bodyLight">·</span>

        <span className="text-figma-base text-fw-body font-medium">
          {edges.length} {edges.length === 1 ? 'edge' : 'edges'}
        </span>

        {hasIssues && (
          <>
            <span className="text-fw-bodyLight">·</span>

            {errors.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-figma-sm font-medium border border-red-200">
                <AlertCircle className="h-3 w-3" />
                {errors.length}
              </span>
            )}

            {warnings.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-figma-sm font-medium border border-yellow-200">
                <AlertTriangle className="h-3 w-3" />
                {warnings.length}
              </span>
            )}

            {infos.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-figma-sm font-medium border border-blue-200">
                <Info className="h-3 w-3" />
                {infos.length}
              </span>
            )}

            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-fw-bodyLight hover:text-fw-body transition-colors"
              title={expanded ? 'Hide issues' : 'Show issues'}
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </>
        )}

        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="text-fw-bodyLight hover:text-fw-body transition-colors"
          title="Refresh validation"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Expanded issue list */}
      {expanded && hasIssues && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 bg-fw-base border border-fw-secondary rounded-xl shadow-lg p-3 space-y-1 z-40">
          {errors.length > 0 && (
            <div className="mb-2">
              <span className="text-figma-sm font-semibold text-red-600 block mb-1">Errors</span>
              {errors.map((issue) => (
                <div key={issue.id} className="flex items-start gap-2 py-1 text-figma-sm text-fw-body">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                  {issue.message}
                </div>
              ))}
            </div>
          )}

          {warnings.length > 0 && (
            <div className="mb-2">
              <span className="text-figma-sm font-semibold text-yellow-700 block mb-1">Warnings</span>
              {warnings.map((issue) => (
                <div key={issue.id} className="flex items-start gap-2 py-1 text-figma-sm text-fw-body">
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 mt-0.5 shrink-0" />
                  {issue.message}
                </div>
              ))}
            </div>
          )}

          {infos.length > 0 && (
            <div>
              <span className="text-figma-sm font-semibold text-blue-600 block mb-1">Info</span>
              {infos.map((issue) => (
                <div key={issue.id} className="flex items-start gap-2 py-1 text-figma-sm text-fw-body">
                  <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                  {issue.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
