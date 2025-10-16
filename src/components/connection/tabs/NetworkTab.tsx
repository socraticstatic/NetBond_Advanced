import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Router, Network, Shield, Settings, Activity, Info, List, GitBranch } from 'lucide-react';
import { Button } from '../../common/Button';
import { Connection } from '../../../types';
import { VNF } from '../../../types/vnf';
import { VNFModal } from '../modals/VNFModal';
import { DeleteVNFModal } from '../modals/DeleteVNFModal';
import { CloudRouter } from '../../../types/cloudrouter';
import { CloudRouterModal } from '../cloudrouter/CloudRouterModal';
import { DeleteCloudRouterModal } from '../cloudrouter/DeleteCloudRouterModal';
import { VLANModal } from '../modals/VLANModal';
import { DeleteVLANModal } from '../modals/DeleteVLANModal';
import { Link } from '../../../types';
import { CloudRouterTable } from '../cloudrouter/CloudRouterTable';
import { VNFTable } from '../vnf/VNFTable';
import { LinkTable } from '../links/LinkTable';
import { VerticalTabGroup } from '../../navigation/VerticalTabGroup';
import { TabItem } from '../../../types/navigation';

interface NetworkTabProps {
  connection: Connection;
  isEditing?: boolean;
}

export function NetworkTab({ connection, isEditing = false }: NetworkTabProps) {
  // View mode: 'hierarchy' or 'table'
  const [viewMode, setViewMode] = useState<'hierarchy' | 'table'>('hierarchy');

  // Active section in table view
  const [activeTableSection, setActiveTableSection] = useState<'cloudrouters' | 'links' | 'vnfs'>('cloudrouters');

  // Expansion state for hierarchical view
  const [expandedRouters, setExpandedRouters] = useState<Set<string>>(new Set());
  const [expandedLinks, setExpandedLinks] = useState<Set<string>>(new Set());

  // VNF state for the modal
  const [showAddVNFModal, setShowAddVNFModal] = useState(false);
  const [editingVNF, setEditingVNF] = useState<VNF | undefined>();
  const [deletingVNF, setDeletingVNF] = useState<VNF | undefined>();

  // Cloud Router state for the modal
  const [showAddCloudRouterModal, setShowAddCloudRouterModal] = useState(false);
  const [editingCloudRouter, setEditingCloudRouter] = useState<CloudRouter | undefined>();
  const [deletingCloudRouter, setDeletingCloudRouter] = useState<CloudRouter | undefined>();

  // Link state for the modal
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | undefined>();
  const [deletingLink, setDeletingLink] = useState<Link | undefined>();
  const [selectedCloudRouterId, setSelectedCloudRouterId] = useState<string | undefined>();

  // Sample VNF data with linkIds to show associations
  const [vnfs, setVnfs] = useState<(VNF & { linkIds?: string[] })[]>([
    {
      id: 'vnf-1',
      name: 'Edge Firewall',
      type: 'firewall',
      vendor: 'Palo Alto Networks',
      model: 'VM-Series',
      version: '10.2.3',
      status: 'active',
      throughput: '5 Gbps',
      licenseExpiry: '2025-06-30T00:00:00Z',
      linkIds: ['link-1', 'link-2'],
      configuration: {
        interfaces: [
          { id: 'if-1', name: 'WAN1', type: 'wan', ipAddress: '203.0.113.10', subnetMask: '255.255.255.0', status: 'up' },
          { id: 'if-2', name: 'LAN1', type: 'lan', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', status: 'up' }
        ],
        routingProtocols: ['BGP', 'OSPF'],
        highAvailability: true,
        managementIP: '192.168.1.10'
      },
      createdAt: '2024-01-10T12:00:00Z',
      updatedAt: '2024-03-15T09:30:00Z',
      description: 'Primary edge firewall for cloud connectivity',
      connectionId: connection.id.toString()
    },
    {
      id: 'vnf-2',
      name: 'Branch SD-WAN',
      type: 'sdwan',
      vendor: 'Versa Networks',
      model: 'FlexVNF',
      version: '21.1.2',
      status: 'active',
      throughput: '2 Gbps',
      linkIds: ['link-3'],
      configuration: {
        interfaces: [
          { id: 'if-1', name: 'WAN1', type: 'wan', ipAddress: '203.0.113.20', subnetMask: '255.255.255.0', status: 'up' },
          { id: 'if-2', name: 'WAN2', type: 'wan', ipAddress: '198.51.100.20', subnetMask: '255.255.255.0', status: 'up' }
        ],
        routingProtocols: ['BGP'],
        highAvailability: false,
        managementIP: '192.168.1.20'
      },
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-02-20T10:15:00Z',
      description: 'SD-WAN for branch office connectivity',
      connectionId: connection.id.toString()
    },
    {
      id: 'vnf-3',
      name: 'Virtual Router',
      type: 'router',
      vendor: 'Cisco',
      model: 'CSR 1000v',
      version: '17.3.1a',
      status: 'active',
      throughput: '10 Gbps',
      linkIds: ['link-1', 'link-4'],
      configuration: {
        interfaces: [
          { id: 'if-1', name: 'GigabitEthernet0/0', type: 'wan', ipAddress: '203.0.113.30', subnetMask: '255.255.255.0', status: 'up' },
          { id: 'if-2', name: 'GigabitEthernet0/1', type: 'lan', ipAddress: '10.1.0.1', subnetMask: '255.255.255.0', status: 'up' }
        ],
        routingProtocols: ['BGP', 'OSPF', 'EIGRP'],
        highAvailability: true,
        managementIP: '192.168.1.30'
      },
      createdAt: '2024-02-15T10:30:00Z',
      updatedAt: '2024-03-10T08:15:00Z',
      description: 'Virtual router for multi-protocol routing',
      connectionId: connection.id.toString()
    },
    {
      id: 'vnf-4',
      name: 'Virtual NAT Gateway',
      type: 'vnat',
      vendor: 'Fortinet',
      model: 'FortiGate-VM',
      version: '7.2.4',
      status: 'active',
      throughput: '1.5 Gbps',
      linkIds: ['link-2'],
      configuration: {
        interfaces: [
          { id: 'if-1', name: 'port1', type: 'wan', ipAddress: '203.0.113.40', subnetMask: '255.255.255.0', status: 'up' },
          { id: 'if-2', name: 'port2', type: 'lan', ipAddress: '10.2.0.1', subnetMask: '255.255.255.0', status: 'up' }
        ],
        routingProtocols: ['Static'],
        highAvailability: false,
        managementIP: '192.168.1.40'
      },
      createdAt: '2024-02-20T14:45:00Z',
      updatedAt: '2024-03-12T11:30:00Z',
      description: 'Virtual NAT for address translation',
      connectionId: connection.id.toString()
    }
  ]);

  // Sample Cloud Router data
  const [cloudRouters, setCloudRouters] = useState<CloudRouter[]>([
    {
      id: 'cr-1',
      name: 'Cloud Router A',
      description: 'Main cloud router for production workloads',
      status: 'active',
      location: 'US East',
      locations: ['New York', 'Boston', 'Washington DC'],
      vendors: ['Cisco', 'Juniper'],
      pool: 'Production',
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-03-10T15:30:00Z',
      connectionId: connection.id.toString(),
      policies: {
        routingPolicy: 'default',
        securityPolicy: 'strict',
        qosPolicy: 'business-critical'
      },
      links: [
        {
          id: 'link-1',
          name: 'Production Traffic',
          vlanId: 100,
          status: 'active',
          description: 'Main production network traffic',
          tags: ['production', 'primary'],
          ipSubnet: '10.100.0.0/24',
          mtu: 1500,
          qosPriority: 3,
          type: 'data',
          createdAt: '2024-01-15T09:30:00Z',
          updatedAt: '2024-03-20T14:22:00Z',
          linkBandwidth: '5 Gbps'
        },
        {
          id: 'link-2',
          name: 'Development Environment',
          vlanId: 200,
          status: 'active',
          description: 'Development and testing workloads',
          tags: ['development', 'testing'],
          ipSubnet: '10.200.0.0/24',
          mtu: 1500,
          qosPriority: 1,
          type: 'data',
          createdAt: '2024-01-20T10:45:00Z',
          updatedAt: '2024-02-18T11:30:00Z',
          linkBandwidth: '2 Gbps'
        }
      ]
    },
    {
      id: 'cr-2',
      name: 'Cloud Router B',
      description: 'Backup cloud router for disaster recovery',
      status: 'active',
      location: 'US West',
      locations: ['San Francisco', 'Los Angeles', 'Seattle'],
      vendors: ['Arista', 'Nokia'],
      pool: 'DR',
      createdAt: '2024-01-07T11:30:00Z',
      updatedAt: '2024-03-05T09:15:00Z',
      connectionId: connection.id.toString(),
      policies: {
        routingPolicy: 'backup',
        securityPolicy: 'standard',
        qosPolicy: 'standard'
      },
      links: [
        {
          id: 'link-3',
          name: 'Management Traffic',
          vlanId: 300,
          status: 'active',
          description: 'Network management and control plane',
          tags: ['management', 'control'],
          ipSubnet: '10.0.0.0/24',
          mtu: 1500,
          qosPriority: 5,
          type: 'management',
          createdAt: '2024-01-25T08:15:00Z',
          updatedAt: '2024-03-05T16:10:00Z',
          linkBandwidth: '1 Gbps'
        },
        {
          id: 'link-4',
          name: 'Voice Systems',
          vlanId: 400,
          status: 'active',
          description: 'VoIP and communication systems',
          tags: ['voice', 'comms'],
          ipSubnet: '10.40.0.0/24',
          mtu: 1500,
          qosPriority: 5,
          type: 'voice',
          createdAt: '2024-02-10T13:20:00Z',
          linkBandwidth: '1 Gbps'
        }
      ]
    }
  ]);

  // Toggle expansion handlers
  const toggleRouter = (routerId: string) => {
    const newExpanded = new Set(expandedRouters);
    if (newExpanded.has(routerId)) {
      newExpanded.delete(routerId);
    } else {
      newExpanded.add(routerId);
    }
    setExpandedRouters(newExpanded);
  };

  const toggleLink = (linkId: string) => {
    const newExpanded = new Set(expandedLinks);
    if (newExpanded.has(linkId)) {
      newExpanded.delete(linkId);
    } else {
      newExpanded.add(linkId);
    }
    setExpandedLinks(newExpanded);
  };

  // Expand all / collapse all
  const expandAll = () => {
    const allRouters = new Set(cloudRouters.map(r => r.id));
    const allLinks = new Set(cloudRouters.flatMap(r => r.links.map(l => l.id)));
    setExpandedRouters(allRouters);
    setExpandedLinks(allLinks);
  };

  const collapseAll = () => {
    setExpandedRouters(new Set());
    setExpandedLinks(new Set());
  };

  // Get VNFs for a specific link
  const getVNFsForLink = (linkId: string) => {
    return vnfs.filter(vnf => vnf.linkIds?.includes(linkId));
  };

  // VNF handlers
  const handleAddVNF = (linkId?: string) => {
    setSelectedCloudRouterId(linkId);
    setShowAddVNFModal(true);
  };

  const handleEditVNF = (vnf: VNF) => {
    setEditingVNF(vnf);
  };

  const handleDeleteVNF = (vnf: VNF) => {
    setDeletingVNF(vnf);
  };

  const handleSaveVNF = (vnfData: VNF & { linkIds?: string[] }) => {
    if (editingVNF) {
      setVnfs(vnfs.map(v => v.id === editingVNF.id ? vnfData : v));
      window.addToast({
        type: 'success',
        title: 'VNF Updated',
        message: `VNF ${vnfData.name} has been updated successfully`,
        duration: 3000
      });
    } else {
      const newVnf = {
        ...vnfData,
        id: `vnf-${Date.now()}`,
        createdAt: new Date().toISOString(),
        connectionId: connection.id.toString()
      };
      setVnfs([...vnfs, newVnf]);
      window.addToast({
        type: 'success',
        title: 'VNF Created',
        message: `VNF ${newVnf.name} has been created successfully`,
        duration: 3000
      });
    }
    setEditingVNF(undefined);
    setShowAddVNFModal(false);
  };

  const handleConfirmDeleteVNF = () => {
    if (deletingVNF) {
      setVnfs(vnfs.filter(v => v.id !== deletingVNF.id));
      window.addToast({
        type: 'success',
        title: 'VNF Deleted',
        message: `VNF ${deletingVNF.name} has been deleted successfully`,
        duration: 3000
      });
      setDeletingVNF(undefined);
    }
  };

  // Cloud Router handlers
  const handleAddCloudRouter = () => {
    setShowAddCloudRouterModal(true);
  };

  const handleEditCloudRouter = (cloudRouter: CloudRouter) => {
    setEditingCloudRouter(cloudRouter);
  };

  const handleDeleteCloudRouter = (cloudRouter: CloudRouter) => {
    setDeletingCloudRouter(cloudRouter);
  };

  const handleSaveCloudRouter = (cloudRouterData: CloudRouter) => {
    if (editingCloudRouter) {
      setCloudRouters(cloudRouters.map(cr => cr.id === editingCloudRouter.id ? cloudRouterData : cr));
      window.addToast({
        type: 'success',
        title: 'Cloud Router Updated',
        message: `Cloud Router ${cloudRouterData.name} has been updated successfully`,
        duration: 3000
      });
    } else {
      const newCloudRouter: CloudRouter = {
        ...cloudRouterData,
        id: `cr-${Date.now()}`,
        createdAt: new Date().toISOString(),
        connectionId: connection.id.toString(),
        links: cloudRouterData.links || []
      };
      setCloudRouters([...cloudRouters, newCloudRouter]);
      window.addToast({
        type: 'success',
        title: 'Cloud Router Created',
        message: `Cloud Router ${newCloudRouter.name} has been created successfully`,
        duration: 3000
      });
    }
    setEditingCloudRouter(undefined);
    setShowAddCloudRouterModal(false);
  };

  const handleConfirmDeleteCloudRouter = () => {
    if (deletingCloudRouter) {
      setCloudRouters(cloudRouters.filter(cr => cr.id !== deletingCloudRouter.id));
      setVnfs(vnfs.filter(vnf => {
        const router = cloudRouters.find(r => r.id === deletingCloudRouter.id);
        const linkIds = router?.links.map(l => l.id) || [];
        return !vnf.linkIds?.some(id => linkIds.includes(id));
      }));
      window.addToast({
        type: 'success',
        title: 'Cloud Router Deleted',
        message: `Cloud Router ${deletingCloudRouter.name} has been deleted successfully`,
        duration: 3000
      });
      setDeletingCloudRouter(undefined);
    }
  };

  // Link handlers
  const handleAddLink = (cloudRouterId: string) => {
    setSelectedCloudRouterId(cloudRouterId);
    setShowAddLinkModal(true);
  };

  const handleEditLink = (link: Link, cloudRouterId: string) => {
    setSelectedCloudRouterId(cloudRouterId);
    setEditingLink(link);
  };

  const handleDeleteLink = (link: Link) => {
    setDeletingLink(link);
  };

  const handleSaveLink = (linkData: Link) => {
    if (!selectedCloudRouterId) return;

    if (editingLink) {
      setCloudRouters(cloudRouters.map(cr => {
        if (cr.id === selectedCloudRouterId) {
          return {
            ...cr,
            links: cr.links.map(l => l.id === editingLink.id ? linkData : l)
          };
        }
        return cr;
      }));
      window.addToast({
        type: 'success',
        title: 'Link Updated',
        message: `Link ${linkData.name} has been updated successfully`,
        duration: 3000
      });
    } else {
      const newLink: Link = {
        ...linkData,
        id: `link-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setCloudRouters(cloudRouters.map(cr => {
        if (cr.id === selectedCloudRouterId) {
          return {
            ...cr,
            links: [...cr.links, newLink]
          };
        }
        return cr;
      }));
      window.addToast({
        type: 'success',
        title: 'Link Created',
        message: `Link ${newLink.name} has been created successfully`,
        duration: 3000
      });
    }
    setEditingLink(undefined);
    setShowAddLinkModal(false);
    setSelectedCloudRouterId(undefined);
  };

  const handleConfirmDeleteLink = () => {
    if (deletingLink) {
      setCloudRouters(cloudRouters.map(cr => ({
        ...cr,
        links: cr.links.filter(l => l.id !== deletingLink.id)
      })));
      setVnfs(vnfs.map(vnf => ({
        ...vnf,
        linkIds: vnf.linkIds?.filter(id => id !== deletingLink.id)
      })));
      window.addToast({
        type: 'success',
        title: 'Link Deleted',
        message: `Link ${deletingLink.name} has been deleted successfully`,
        duration: 3000
      });
      setDeletingLink(undefined);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      provisioning: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || styles.inactive;
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'firewall': return <Shield className="h-4 w-4" />;
      case 'router': return <Router className="h-4 w-4" />;
      case 'sdwan': return <Network className="h-4 w-4" />;
      case 'vnat': return <Settings className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  // Flatten all links for table view
  const allLinks = cloudRouters.flatMap(router =>
    router.links.map(link => ({
      ...link,
      cloudRouterName: router.name,
      cloudRouterId: router.id,
      bandwidth: link.linkBandwidth
    }))
  );

  // Map VNFs to cloud routers for table view
  const vnfsWithRouters = vnfs.map(vnf => ({
    ...vnf,
    cloudRouterId: vnf.linkIds?.[0] ?
      cloudRouters.find(r => r.links.some(l => l.id === vnf.linkIds?.[0]))?.id :
      undefined
  }));

  // Vertical tabs for table view
  const tableTabs: TabItem[] = [
    {
      id: 'cloudrouters',
      label: 'Cloud Routers',
      icon: <Router className="h-5 w-5" />,
      count: cloudRouters.length
    },
    {
      id: 'links',
      label: 'Links (VLANs)',
      icon: <Network className="h-5 w-5" />,
      count: allLinks.length
    },
    {
      id: 'vnfs',
      label: 'VNF Functions',
      icon: <Shield className="h-5 w-5" />,
      count: vnfs.length
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {viewMode === 'hierarchy' ? 'Network Hierarchy' : 'Network Components'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {viewMode === 'hierarchy'
              ? 'Connection → Cloud Routers → Links (VLANs) → VNF Functions'
              : 'Tabular view of all network components with pagination'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'hierarchy'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <GitBranch className="h-4 w-4" />
              <span>Hierarchy</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
              <span>Tables</span>
            </button>
          </div>

          {viewMode === 'hierarchy' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={expandAll}
              >
                Expand All
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={collapseAll}
              >
                Collapse All
              </Button>
            </>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddCloudRouter}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Cloud Router
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Router className="h-8 w-8 text-blue-600" />
            <span className="text-3xl font-bold text-blue-900">{cloudRouters.length}</span>
          </div>
          <p className="text-sm font-medium text-blue-700">Cloud Routers</p>
          {cloudRouters.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.from(new Set(cloudRouters.flatMap(cr => cr.locations || [cr.location]).filter(Boolean))).slice(0, 3).map((loc, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded">
                  {loc}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Network className="h-8 w-8 text-green-600" />
            <span className="text-3xl font-bold text-green-900">
              {cloudRouters.reduce((sum, cr) => sum + cr.links.length, 0)}
            </span>
          </div>
          <p className="text-sm font-medium text-green-700">Links (VLANs)</p>
          {cloudRouters.length > 0 && (
            <p className="text-xs text-green-600 mt-2">
              Across {cloudRouters.length} router{cloudRouters.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-8 w-8 text-orange-600" />
            <span className="text-3xl font-bold text-orange-900">{vnfs.length}</span>
          </div>
          <p className="text-sm font-medium text-orange-700">VNF Functions</p>
          {vnfs.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.from(new Set(vnfs.map(vnf => vnf.vendor).filter(Boolean))).slice(0, 2).map((vendor, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 bg-orange-200 text-orange-800 rounded">
                  {vendor}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-8 w-8 text-purple-600" />
            <span className="text-3xl font-bold text-purple-900">
              {Array.from(new Set(cloudRouters.map(cr => cr.pool).filter(Boolean))).length || 1}
            </span>
          </div>
          <p className="text-sm font-medium text-purple-700">
            {Array.from(new Set(cloudRouters.map(cr => cr.pool).filter(Boolean))).length > 1 ? 'Pools' : 'Pool'}
          </p>
          {cloudRouters.some(cr => cr.pool) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.from(new Set(cloudRouters.map(cr => cr.pool).filter(Boolean))).slice(0, 2).map((pool, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded">
                  {pool}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Network Organization</h4>
            <p className="text-sm text-blue-700">
              {viewMode === 'hierarchy'
                ? 'This view shows your network hierarchy. Each Cloud Router can have multiple Links (VLANs), and each Link can have multiple VNF functions associated with it. Click the arrows to expand/collapse sections.'
                : 'This view shows all network components in sortable, paginated tables. Use the Tables view to efficiently browse and manage large numbers of components.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="flex gap-6">
          {/* Vertical Navigation */}
          <VerticalTabGroup
            tabs={tableTabs}
            activeTab={activeTableSection}
            onChange={(id) => setActiveTableSection(id as 'cloudrouters' | 'links' | 'vnfs')}
          />

          {/* Table Content */}
          <div className="flex-1">
            {/* Cloud Routers Table */}
            {activeTableSection === 'cloudrouters' && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Router className="h-5 w-5 text-brand-blue mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Cloud Routers</h3>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddCloudRouter}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cloud Router
                  </Button>
                </div>
                <CloudRouterTable
                  cloudRouters={cloudRouters}
                  vnfs={vnfsWithRouters}
                  onEdit={handleEditCloudRouter}
                  onDelete={handleDeleteCloudRouter}
                  connectionBandwidth={connection.bandwidth}
                />
              </div>
            )}

            {/* Links/VLANs Table */}
            {activeTableSection === 'links' && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Network className="h-5 w-5 text-brand-blue mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Links (VLANs)</h3>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (cloudRouters.length > 0) {
                        handleAddLink(cloudRouters[0].id);
                      }
                    }}
                    disabled={cloudRouters.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </div>
                <LinkTable
                  links={allLinks}
                  sortField="vlanId"
                  sortDirection="asc"
                  onSort={() => {}}
                  onEdit={(link) => {
                    const router = cloudRouters.find(r => r.id === link.cloudRouterId);
                    if (router) {
                      handleEditLink(link, router.id);
                    }
                  }}
                  onDelete={handleDeleteLink}
                  searchQuery=""
                  showCloudRouter={true}
                />
              </div>
            )}

            {/* VNFs Table */}
            {activeTableSection === 'vnfs' && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-brand-blue mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">VNF Functions</h3>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (cloudRouters.length > 0) {
                        handleAddVNF(cloudRouters[0].id);
                      }
                    }}
                    disabled={cloudRouters.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add VNF
                  </Button>
                </div>
                <VNFTable
                  vnfs={vnfsWithRouters}
                  cloudRouters={cloudRouters}
                  onEdit={handleEditVNF}
                  onDelete={handleDeleteVNF}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hierarchical Tree View */}
      {viewMode === 'hierarchy' && (
        <div className="bg-white rounded-lg border border-gray-200">
        {/* Connection Level */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Network className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{connection.name}</h3>
                <p className="text-sm text-gray-600">{connection.type} • {connection.bandwidth}</p>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(connection.status.toLowerCase())}`}>
              {connection.status}
            </span>
          </div>
        </div>

        {/* Cloud Routers */}
        <div className="divide-y divide-gray-200">
          {cloudRouters.map((router, routerIndex) => (
            <div key={router.id} className="hover:bg-gray-50 transition-colors">
              {/* Cloud Router Row */}
              <div className="p-4 pl-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => toggleRouter(router.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {expandedRouters.has(router.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Router className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{router.name}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(router.status)}`}>
                          {router.status}
                        </span>
                        {router.pool && (
                          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                            Pool: {router.pool}
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {router.links.length} Link{router.links.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {router.description}
                        {router.locations && router.locations.length > 0 ? (
                          <span> • {router.locations.join(', ')}</span>
                        ) : (
                          <span> • {router.location}</span>
                        )}
                        {router.vendors && router.vendors.length > 0 && (
                          <span> • {router.vendors.join(', ')}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddLink(router.id)}
                    >
                      Add Link
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditCloudRouter(router)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteCloudRouter(router)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              {/* Links (when router is expanded) */}
              {expandedRouters.has(router.id) && (
                <div className="bg-gray-50 border-t border-gray-200">
                  {router.links.map((link, linkIndex) => {
                    const linkVNFs = getVNFsForLink(link.id);
                    return (
                      <div key={link.id} className="border-b border-gray-200 last:border-b-0">
                        {/* Link Row */}
                        <div className="p-4 pl-20 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <button
                                onClick={() => toggleLink(link.id)}
                                className="p-1 hover:bg-gray-300 rounded transition-colors"
                              >
                                {expandedLinks.has(link.id) ? (
                                  <ChevronDown className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-600" />
                                )}
                              </button>
                              <div className="p-1.5 bg-green-50 rounded">
                                <Network className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium text-gray-900">{link.name}</h5>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(link.status)}`}>
                                    {link.status}
                                  </span>
                                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                    VLAN {link.vlanId}
                                  </span>
                                  {linkVNFs.length > 0 && (
                                    <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
                                      {linkVNFs.length} VNF{linkVNFs.length !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  {link.ipSubnet} • {link.linkBandwidth || 'No bandwidth set'} • MTU: {link.mtu} • QoS Priority: {link.qosPriority}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleAddVNF(link.id)}
                              >
                                Add VNF
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleEditLink(link, router.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteLink(link)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* VNFs (when link is expanded) */}
                        {expandedLinks.has(link.id) && linkVNFs.length > 0 && (
                          <div className="bg-white border-t border-gray-200">
                            {linkVNFs.map((vnf) => (
                              <div key={vnf.id} className="p-4 pl-32 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-1.5 rounded ${
                                      vnf.type === 'firewall' ? 'bg-orange-50' :
                                      vnf.type === 'router' ? 'bg-blue-50' :
                                      vnf.type === 'sdwan' ? 'bg-green-50' :
                                      'bg-gray-50'
                                    }`}>
                                      {getTypeIcon(vnf.type)}
                                    </div>
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <h6 className="font-medium text-gray-900 text-sm">{vnf.name}</h6>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(vnf.status)}`}>
                                          {vnf.status}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full capitalize">
                                          {vnf.type}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 mt-0.5">
                                        {vnf.vendor} {vnf.model} • {vnf.throughput}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => handleEditVNF(vnf)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleDeleteVNF(vnf)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Empty state for links with no VNFs */}
                        {expandedLinks.has(link.id) && linkVNFs.length === 0 && (
                          <div className="p-8 pl-32 bg-white border-t border-gray-200 text-center">
                            <Shield className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-3">No VNF functions associated with this link</p>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAddVNF(link.id)}
                              icon={<Plus className="h-4 w-4" />}
                            >
                              Add VNF Function
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Empty state for routers with no links */}
                  {router.links.length === 0 && (
                    <div className="p-8 pl-20 text-center">
                      <Network className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">No links configured for this cloud router</p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddLink(router.id)}
                        icon={<Plus className="h-4 w-4" />}
                      >
                        Add Link (VLAN)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Empty state for no cloud routers */}
          {cloudRouters.length === 0 && (
            <div className="p-12 text-center">
              <Router className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Cloud Routers</h3>
              <p className="text-sm text-gray-600 mb-4">Get started by creating your first cloud router</p>
              <Button
                variant="primary"
                onClick={handleAddCloudRouter}
                icon={<Plus className="h-4 w-4" />}
              >
                Add Cloud Router
              </Button>
            </div>
          )}
        </div>
        </div>
      )}

      {/* Modals */}
      <VNFModal
        isOpen={showAddVNFModal || !!editingVNF}
        onClose={() => {
          setShowAddVNFModal(false);
          setEditingVNF(undefined);
        }}
        onSave={handleSaveVNF}
        vnf={editingVNF}
        connectionId={connection.id.toString()}
        cloudRouters={cloudRouters}
        selectedLinkId={selectedCloudRouterId}
      />

      {deletingVNF && (
        <DeleteVNFModal
          isOpen={!!deletingVNF}
          onClose={() => setDeletingVNF(undefined)}
          onConfirm={handleConfirmDeleteVNF}
          vnfName={deletingVNF.name}
          vnfType={deletingVNF.type}
        />
      )}

      <CloudRouterModal
        isOpen={showAddCloudRouterModal || !!editingCloudRouter}
        onClose={() => {
          setShowAddCloudRouterModal(false);
          setEditingCloudRouter(undefined);
        }}
        onSave={handleSaveCloudRouter}
        cloudRouter={editingCloudRouter}
        connectionId={connection.id.toString()}
      />

      {deletingCloudRouter && (
        <DeleteCloudRouterModal
          isOpen={!!deletingCloudRouter}
          onClose={() => setDeletingCloudRouter(undefined)}
          onConfirm={handleConfirmDeleteCloudRouter}
          cloudRouterName={deletingCloudRouter.name}
        />
      )}

      <VLANModal
        isOpen={showAddLinkModal || !!editingLink}
        onClose={() => {
          setShowAddLinkModal(false);
          setEditingLink(undefined);
          setSelectedCloudRouterId(undefined);
        }}
        onSave={handleSaveLink}
        vlan={editingLink}
        cloudRouterId={selectedCloudRouterId}
      />

      {deletingLink && (
        <DeleteVLANModal
          isOpen={!!deletingLink}
          onClose={() => setDeletingLink(undefined)}
          onConfirm={handleConfirmDeleteLink}
          vlanName={deletingLink.name}
          vlanId={deletingLink.vlanId}
        />
      )}
    </div>
  );
}
