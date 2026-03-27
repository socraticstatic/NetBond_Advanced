import type { NetworkNode, NetworkEdge } from '../components/network-designer/types/designer';
import type { CloudProvider } from '../types/connection';

interface WizardState {
  cloudRouterName?: string;
  providers: CloudProvider[];
  selectedLocations: Record<string, string[]>;
  bandwidthSettings: Record<string, number>;
  connectionType?: string;
  resiliencyLevel?: string;
}

const EDGE_TYPE_MAP: Record<string, string> = {
  'AWS': 'direct-connect',
  'Azure': 'expressroute',
  'Google': 'cloud-interconnect',
  'Oracle': 'fastconnect',
  'IBM': 'direct-link',
  'Equinix': 'ethernet',
  'Digital Realty': 'ethernet',
  'Centersquare': 'ethernet',
  'CoreSite': 'ethernet',
  'DataBank': 'ethernet',
  'Cisco Jasper': 'ethernet',
};

const PROVIDER_ICONS: Record<string, string> = {
  'AWS': 'cloud',
  'Azure': 'cloud',
  'Google': 'cloud',
  'Oracle': 'cloud',
  'IBM': 'cloud',
  'Equinix': 'server',
  'Digital Realty': 'server',
  'Centersquare': 'server',
  'CoreSite': 'server',
  'DataBank': 'server',
  'Cisco Jasper': 'radio',
};

export function wizardToDesigner(state: WizardState): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
  const nodes: NetworkNode[] = [];
  const edges: NetworkEdge[] = [];

  // AT&T Core node (left side)
  const coreNode: NetworkNode = {
    id: 'wizard-core',
    type: 'network',
    functionType: 'ipe',
    x: 100,
    y: 300,
    name: 'AT&T Core',
    icon: 'radio',
    status: 'active',
    config: {},
  };
  nodes.push(coreNode);

  // Cloud Router node (center)
  const routerNode: NetworkNode = {
    id: 'wizard-router',
    type: 'function',
    functionType: 'cloudRouter',
    x: 350,
    y: 300,
    name: state.cloudRouterName || 'Cloud Router',
    icon: 'cloudRouter',
    status: 'configured-inactive',
    config: {},
  };
  nodes.push(routerNode);

  // Core to Router edge
  const coreEdge: NetworkEdge = {
    id: 'wizard-edge-core',
    source: 'wizard-core',
    target: 'wizard-router',
    type: 'mpls',
    bandwidth: '10 Gbps',
    status: 'active',
  };
  edges.push(coreEdge);

  // Provider destination nodes (right side, distributed vertically)
  let nodeIndex = 0;
  const allLocations: { provider: string; location: string }[] = [];

  state.providers.forEach(provider => {
    const locations = state.selectedLocations[provider] || [];
    locations.forEach(location => {
      allLocations.push({ provider, location });
    });
  });

  const totalNodes = Math.max(allLocations.length, 1);
  const ySpacing = 120;
  const yStart = 300 - ((totalNodes - 1) * ySpacing) / 2;

  allLocations.forEach(({ provider, location }) => {
    const nodeId = `wizard-dest-${nodeIndex}`;
    const y = yStart + nodeIndex * ySpacing;

    const destNode: NetworkNode = {
      id: nodeId,
      type: 'destination',
      functionType: 'cloud',
      cloudProvider: provider,
      x: 600,
      y,
      name: `${provider} (${location})`,
      icon: PROVIDER_ICONS[provider] || 'cloud',
      status: 'unconfigured',
      config: {
        provider,
        region: location,
      },
    };
    nodes.push(destNode);

    // Router to destination edge
    const bwKey = `${provider}:${location}`;
    const bandwidth = state.bandwidthSettings[bwKey] || 1000;
    const bwLabel = bandwidth >= 1000 ? `${(bandwidth / 1000).toFixed(0)} Gbps` : `${bandwidth} Mbps`;

    const destEdge: NetworkEdge = {
      id: `wizard-edge-${nodeIndex}`,
      source: 'wizard-router',
      target: nodeId,
      type: EDGE_TYPE_MAP[provider] || 'ethernet',
      bandwidth: bwLabel,
      status: 'inactive',
    };
    edges.push(destEdge);

    nodeIndex++;
  });

  return { nodes, edges };
}
