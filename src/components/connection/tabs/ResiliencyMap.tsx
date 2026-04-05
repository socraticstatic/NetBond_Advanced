import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { Connection } from '../../../types';

interface ResiliencyMapProps {
  connection: Connection;
}

type Scenario = 'normal' | 'site1-failure' | 'site2-failure' | 'single-path';

interface PathNode {
  id: string;
  label: string;
  site: string;
  status: 'active' | 'standby' | 'down';
}

function getTier(connection: Connection): 'standard' | 'maximum' | 'geodiversity' {
  const cfg = connection.configuration as any;
  if (cfg?.resiliencyLevel === 'geodiversity') return 'geodiversity';
  if (cfg?.resiliencyLevel === 'maximum' || cfg?.isLmcc) return 'maximum';
  return 'standard';
}

function getPaths(connection: Connection, scenario: Scenario): PathNode[] {
  const tier = getTier(connection);
  const provider = connection.provider || 'AWS';
  const loc = connection.location || 'US East';

  if (tier === 'standard') {
    return [{ id: 'p1', label: `${provider} Path 1`, site: loc, status: scenario === 'single-path' ? 'down' : 'active' }];
  }

  if (tier === 'maximum') {
    const isLmcc = (connection.configuration as any)?.isLmcc;
    if (isLmcc) {
      // LMCC 4-path architecture
      const metro = (connection.configuration as any)?.lmccMetro || 'San Jose';
      return [
        { id: 'ipe-1a', label: 'IPE-1A (MX-304)', site: `Site 1`, status: scenario === 'site1-failure' ? 'down' : 'active' },
        { id: 'ipe-1b', label: 'IPE-1B (MX-304)', site: `Site 1`, status: scenario === 'site1-failure' ? 'down' : scenario === 'single-path' ? 'down' : 'active' },
        { id: 'ipe-2a', label: 'IPE-2A (MX-304)', site: `Site 2`, status: scenario === 'site2-failure' ? 'down' : 'active' },
        { id: 'ipe-2b', label: 'IPE-2B (MX-304)', site: `Site 2`, status: scenario === 'site2-failure' ? 'down' : 'active' },
      ];
    }
    // Generic maximum: 2 paths, 2 sites
    return [
      { id: 'p1', label: `${provider} Path 1`, site: 'Site 1', status: scenario === 'site1-failure' ? 'down' : 'active' },
      { id: 'p2', label: `${provider} Path 2`, site: 'Site 2', status: scenario === 'site2-failure' ? 'down' : 'active' },
    ];
  }

  // Geodiversity: 4 paths, 2 metros
  return [
    { id: 'p1', label: `${provider} Metro 1 - Path A`, site: 'Metro 1', status: scenario === 'site1-failure' ? 'down' : 'active' },
    { id: 'p2', label: `${provider} Metro 1 - Path B`, site: 'Metro 1', status: scenario === 'site1-failure' ? 'down' : scenario === 'single-path' ? 'down' : 'active' },
    { id: 'p3', label: `${provider} Metro 2 - Path A`, site: 'Metro 2', status: scenario === 'site2-failure' ? 'down' : 'active' },
    { id: 'p4', label: `${provider} Metro 2 - Path B`, site: 'Metro 2', status: scenario === 'site2-failure' ? 'down' : 'active' },
  ];
}

const STATUS_COLORS = {
  active: { dot: 'bg-fw-success', line: 'stroke-green-500', text: 'text-fw-success', bg: 'bg-fw-successLight' },
  standby: { dot: 'bg-complementary-amber', line: 'stroke-amber-400', text: 'text-fw-warn', bg: 'bg-fw-warn/10' },
  down: { dot: 'bg-fw-error', line: 'stroke-red-400', text: 'text-fw-error', bg: 'bg-fw-errorLight' },
};

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: 'normal', label: 'Normal Operation' },
  { id: 'site1-failure', label: 'Site 1 Failure' },
  { id: 'site2-failure', label: 'Site 2 Failure' },
  { id: 'single-path', label: 'Single Path Failure' },
];

export function ResiliencyMap({ connection }: ResiliencyMapProps) {
  const [scenario, setScenario] = useState<Scenario>('normal');
  const tier = getTier(connection);
  const paths = getPaths(connection, scenario);
  const activePaths = paths.filter(p => p.status === 'active').length;
  const totalPaths = paths.length;
  const allUp = activePaths === totalPaths;
  const sites = [...new Set(paths.map(p => p.site))];

  const failoverTime = tier === 'standard' ? 'N/A' : '0.8s';
  const packetLoss = scenario === 'normal' ? '0' : tier === 'standard' ? 'Total loss' : '0 packets';
  const bgpReconvergence = tier === 'standard' ? 'N/A' : '1.2s';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-figma-lg font-bold text-fw-heading">Resiliency Architecture</h3>
          <p className="text-figma-sm text-fw-bodyLight mt-1">
            {tier === 'standard' && 'Single path, no site diversity. Device-level redundancy only.'}
            {tier === 'maximum' && 'Dual-site within metro. Protects against single-site failure.'}
            {tier === 'geodiversity' && 'Dual-metro diversity. Protects against metro-wide outage.'}
          </p>
        </div>
        {tier !== 'standard' && (
          <div className="relative">
            <select
              value={scenario}
              onChange={e => setScenario(e.target.value as Scenario)}
              className="appearance-none pl-4 pr-10 h-9 rounded-full border border-fw-secondary text-figma-sm font-medium text-fw-heading bg-fw-base hover:bg-fw-wash cursor-pointer focus:ring-2 focus:ring-fw-active"
            >
              {SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fw-bodyLight pointer-events-none" />
          </div>
        )}
      </div>

      {/* Status banner */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
        allUp ? 'bg-fw-successLight border-fw-success/20' : 'bg-fw-errorLight border-fw-error/20'
      }`}>
        {allUp ? <CheckCircle className="h-5 w-5 text-fw-success" /> : <AlertTriangle className="h-5 w-5 text-fw-error" />}
        <div>
          <p className={`text-figma-base font-medium ${allUp ? 'text-fw-success' : 'text-fw-error'}`}>
            {allUp ? 'All paths operational' : `${totalPaths - activePaths} of ${totalPaths} paths down`}
          </p>
          <p className="text-figma-sm text-fw-bodyLight">
            {activePaths}/{totalPaths} active paths
            {!allUp && scenario !== 'normal' && ` | Failover: ${failoverTime} | Packet loss: ${packetLoss}`}
          </p>
        </div>
      </div>

      {/* Path diagram */}
      <div className="bg-fw-base border border-fw-secondary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Customer side */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-xl bg-fw-heading flex items-center justify-center">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-figma-xs font-medium text-fw-heading">Your Network</span>
          </div>

          {/* Paths */}
          <div className="flex-1 mx-8">
            {sites.map(site => {
              const sitePaths = paths.filter(p => p.site === site);
              return (
                <div key={site} className="mb-4 last:mb-0">
                  <p className="text-[10px] font-bold text-fw-bodyLight uppercase tracking-wider mb-2">{site}</p>
                  <div className="space-y-2">
                    {sitePaths.map(path => {
                      const sc = STATUS_COLORS[path.status];
                      return (
                        <div key={path.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${sc.bg} border-${path.status === 'down' ? 'fw-error/20' : 'fw-secondary'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${sc.dot} ${path.status === 'active' ? 'animate-pulse' : ''}`} />
                          <div className="flex-1 h-0.5 bg-current opacity-20" />
                          <span className={`text-figma-xs font-medium ${sc.text}`}>{path.label}</span>
                          <div className="flex-1 h-0.5 bg-current opacity-20" />
                          <span className={`text-[10px] font-bold uppercase ${sc.text}`}>{path.status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cloud side */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-xl bg-fw-link flex items-center justify-center">
              <span className="text-white text-figma-xs font-bold">{connection.provider || 'Cloud'}</span>
            </div>
            <span className="text-figma-xs font-medium text-fw-heading">{connection.provider} Cloud</span>
          </div>
        </div>
      </div>

      {/* Failover metrics */}
      {tier !== 'standard' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-fw-base border border-fw-secondary rounded-xl p-4 text-center">
            <p className="text-figma-2xl font-bold text-fw-heading">{failoverTime}</p>
            <p className="text-figma-xs text-fw-bodyLight mt-1">BFD Failover Time</p>
          </div>
          <div className="bg-fw-base border border-fw-secondary rounded-xl p-4 text-center">
            <p className="text-figma-2xl font-bold text-fw-heading">{packetLoss}</p>
            <p className="text-figma-xs text-fw-bodyLight mt-1">Packet Loss (failover)</p>
          </div>
          <div className="bg-fw-base border border-fw-secondary rounded-xl p-4 text-center">
            <p className="text-figma-2xl font-bold text-fw-heading">{bgpReconvergence}</p>
            <p className="text-figma-xs text-fw-bodyLight mt-1">BGP Reconvergence</p>
          </div>
        </div>
      )}

      {tier === 'standard' && (
        <div className="flex items-start gap-3 p-4 bg-fw-warn/5 border border-fw-warn/20 rounded-xl">
          <AlertTriangle className="h-5 w-5 text-fw-warn mt-0.5 shrink-0" />
          <div>
            <p className="text-figma-base font-medium text-fw-warn">No path diversity</p>
            <p className="text-figma-sm text-fw-bodyLight">This connection has a single path with no site or metro redundancy. Upgrade to Maximum or Geodiversity for automatic failover protection.</p>
          </div>
        </div>
      )}
    </div>
  );
}
