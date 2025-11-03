import { useState } from 'react';
import { Plus, GitBranch, Network, Shield, Users } from 'lucide-react';
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
import { CloudRouterSection } from '../cloudrouter/CloudRouterSection';
import { LinkSection } from '../links/LinkSection';
import { VNFSection } from '../vnf/VNFSection';
import { VerticalTabGroup } from '../../navigation/VerticalTabGroup';
import { TabItem } from '../../../types/navigation';

interface NetworkTabProps {
  connection: Connection;
  isEditing?: boolean;
}

export function NetworkTab({ connection, isEditing = false }: NetworkTabProps) {
  // Active section in vertical tab view
  const [activeSection, setActiveSection] = useState<'cloudrouters' | 'links' | 'vnfs' | 'pools'>('cloudrouters');

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

  // Sample VNF data
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
    }
  ]);

  // Sample Cloud Router data
  const [cloudRouters, setCloudRouters] = useState<CloudRouter[]>([
    {
      id: 'cr-1',
      name: 'Primary Cloud Router',
      description: 'Main cloud router for US-East region',
      status: 'active',
      location: 'US-East',
      links: [
        {
          id: 'link-1',
          name: 'Production VLAN',
          vlanId: 100,
          status: 'active',
          ipSubnet: '10.1.0.0/24',
          bandwidth: '5 Gbps',
          description: 'Production traffic',
          cloudRouterIds: ['cr-1'],
          createdAt: '2024-01-10T00:00:00Z'
        },
        {
          id: 'link-2',
          name: 'Development VLAN',
          vlanId: 200,
          status: 'active',
          ipSubnet: '10.2.0.0/24',
          bandwidth: '2 Gbps',
          description: 'Development environment',
          cloudRouterIds: ['cr-1'],
          createdAt: '2024-01-15T00:00:00Z'
        }
      ],
      policies: {
        routingPolicy: 'default',
        securityPolicy: 'standard',
        qosPolicy: 'standard'
      },
      connectionId: connection.id.toString(),
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    },
    {
      id: 'cr-2',
      name: 'Secondary Cloud Router',
      description: 'Backup router for redundancy',
      status: 'active',
      location: 'US-West',
      links: [
        {
          id: 'link-3',
          name: 'Backup VLAN',
          vlanId: 300,
          status: 'active',
          ipSubnet: '10.3.0.0/24',
          bandwidth: '3 Gbps',
          description: 'Backup link',
          cloudRouterIds: ['cr-2'],
          createdAt: '2024-02-01T00:00:00Z'
        }
      ],
      policies: {
        routingPolicy: 'default',
        securityPolicy: 'standard',
        qosPolicy: 'standard'
      },
      connectionId: connection.id.toString(),
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-03-10T00:00:00Z'
    }
  ]);

  // Get all links from cloud routers
  const getAllLinks = (): Link[] => {
    return cloudRouters.flatMap((router) => router.links || []);
  };

  // Handler functions for Cloud Routers
  const handleAddCloudRouter = () => {
    setEditingCloudRouter(undefined);
    setShowAddCloudRouterModal(true);
  };

  const handleEditCloudRouter = (cloudRouter: CloudRouter) => {
    setEditingCloudRouter(cloudRouter);
    setShowAddCloudRouterModal(true);
  };

  const handleDeleteCloudRouter = (cloudRouter: CloudRouter) => {
    setDeletingCloudRouter(cloudRouter);
  };

  const handleSaveCloudRouter = (cloudRouter: CloudRouter) => {
    if (editingCloudRouter) {
      setCloudRouters(cloudRouters.map((cr) => (cr.id === cloudRouter.id ? cloudRouter : cr)));
      window.addToast({
        type: 'success',
        title: 'Cloud Router Updated',
        message: `${cloudRouter.name} has been updated successfully.`,
        duration: 3000
      });
    } else {
      setCloudRouters([...cloudRouters, cloudRouter]);
      window.addToast({
        type: 'success',
        title: 'Cloud Router Created',
        message: `${cloudRouter.name} has been created successfully.`,
        duration: 3000
      });
    }
    setShowAddCloudRouterModal(false);
    setEditingCloudRouter(undefined);
  };

  const handleConfirmDeleteCloudRouter = () => {
    if (deletingCloudRouter) {
      setCloudRouters(cloudRouters.filter((cr) => cr.id !== deletingCloudRouter.id));
      window.addToast({
        type: 'success',
        title: 'Cloud Router Deleted',
        message: `${deletingCloudRouter.name} has been deleted successfully.`,
        duration: 3000
      });
      setDeletingCloudRouter(undefined);
    }
  };

  // Handler functions for Links
  const handleAddLink = (cloudRouterId?: string) => {
    setEditingLink(undefined);
    setSelectedCloudRouterId(cloudRouterId);
    setShowAddLinkModal(true);
  };

  const handleEditLink = (link: Link, cloudRouterId: string) => {
    setEditingLink(link);
    setSelectedCloudRouterId(cloudRouterId);
    setShowAddLinkModal(true);
  };

  const handleDeleteLink = (link: Link) => {
    setDeletingLink(link);
  };

  const handleSaveLink = (linkData: Partial<Link>) => {
    // Links now have cloudRouterIds array, so we need to update all associated cloud routers
    const cloudRouterIdsToUpdate = linkData.cloudRouterIds || [];

    if (cloudRouterIdsToUpdate.length === 0) return;

    setCloudRouters(
      cloudRouters.map((router) => {
        // If this router should have this link
        if (cloudRouterIdsToUpdate.includes(router.id)) {
          const updatedLinks = editingLink
            ? (router.links || []).map((l) => (l.id === editingLink.id ? { ...l, ...linkData } : l))
            : [...(router.links || []), linkData as Link];
          return { ...router, links: updatedLinks };
        } else {
          // Remove link from routers that should no longer have it
          const filteredLinks = (router.links || []).filter(l => l.id !== linkData.id);
          return { ...router, links: filteredLinks };
        }
      })
    );

    window.addToast({
      type: 'success',
      title: editingLink ? 'Link Updated' : 'Link Created',
      message: `Link ${linkData.name} has been ${editingLink ? 'updated' : 'created'} successfully.`,
      duration: 3000
    });

    setShowAddLinkModal(false);
    setEditingLink(undefined);
    setSelectedCloudRouterId(undefined);
  };

  const handleConfirmDeleteLink = () => {
    if (!deletingLink) return;

    setCloudRouters(
      cloudRouters.map((router) => ({
        ...router,
        links: (router.links || []).filter((l) => l.id !== deletingLink.id)
      }))
    );

    window.addToast({
      type: 'success',
      title: 'Link Deleted',
      message: `Link ${deletingLink.name} has been deleted successfully.`,
      duration: 3000
    });

    setDeletingLink(undefined);
  };

  // Handler functions for VNFs
  const handleAddVNF = () => {
    setEditingVNF(undefined);
    setShowAddVNFModal(true);
  };

  const handleEditVNF = (vnf: VNF) => {
    setEditingVNF(vnf);
    setShowAddVNFModal(true);
  };

  const handleDeleteVNF = (vnf: VNF) => {
    setDeletingVNF(vnf);
  };

  const handleSaveVNF = (vnfData: VNF) => {
    if (editingVNF) {
      setVnfs(vnfs.map((v) => (v.id === vnfData.id ? vnfData : v)));
      window.addToast({
        type: 'success',
        title: 'VNF Updated',
        message: `${vnfData.name} has been updated successfully.`,
        duration: 3000
      });
    } else {
      setVnfs([...vnfs, vnfData]);
      window.addToast({
        type: 'success',
        title: 'VNF Created',
        message: `${vnfData.name} has been created successfully.`,
        duration: 3000
      });
    }
    setShowAddVNFModal(false);
    setEditingVNF(undefined);
  };

  const handleConfirmDeleteVNF = () => {
    if (deletingVNF) {
      setVnfs(vnfs.filter((v) => v.id !== deletingVNF.id));
      window.addToast({
        type: 'success',
        title: 'VNF Deleted',
        message: `${deletingVNF.name} has been deleted successfully.`,
        duration: 3000
      });
      setDeletingVNF(undefined);
    }
  };

  // Vertical tabs configuration
  const tabs: TabItem[] = [
    {
      id: 'cloudrouters',
      label: 'Cloud Routers',
      icon: <GitBranch className="h-5 w-5 mr-2" />,
      count: cloudRouters.length
    },
    {
      id: 'links',
      label: 'Links',
      icon: <Network className="h-5 w-5 mr-2" />,
      count: getAllLinks().length
    },
    {
      id: 'vnfs',
      label: 'VNF Functions',
      icon: <Shield className="h-5 w-5 mr-2" />,
      count: vnfs.length
    },
    {
      id: 'pools',
      label: 'Pools',
      icon: <Users className="h-5 w-5 mr-2" />,
      count: 0
    }
  ];

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Vertical Tab Navigation */}
        <VerticalTabGroup
          tabs={tabs}
          activeTab={activeSection}
          onChange={(id) => setActiveSection(id as typeof activeSection)}
        />

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Cloud Routers Section */}
          {activeSection === 'cloudrouters' && (
            <CloudRouterSection
              cloudRouters={cloudRouters}
              vnfs={vnfs}
              onAdd={handleAddCloudRouter}
              onEdit={handleEditCloudRouter}
              onDelete={handleDeleteCloudRouter}
              connectionId={connection.id.toString()}
              connection={connection}
            />
          )}

          {/* Links Section */}
          {activeSection === 'links' && (
            <LinkSection
              connection={connection}
              cloudRouters={cloudRouters}
              allLinks={getAllLinks()}
            />
          )}

          {/* VNFs Section */}
          {activeSection === 'vnfs' && (
            <VNFSection
              vnfs={vnfs}
              cloudRouters={cloudRouters}
              onAdd={handleAddVNF}
              onEdit={handleEditVNF}
              onDelete={handleDeleteVNF}
              connectionId={connection.id.toString()}
            />
          )}

          {/* Pools Section */}
          {activeSection === 'pools' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Pools</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage resource pools for this connection
                  </p>
                </div>
                <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
                  Add to Pool
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pools assigned to this connection</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CloudRouterModal
        isOpen={showAddCloudRouterModal}
        onClose={() => {
          setShowAddCloudRouterModal(false);
          setEditingCloudRouter(undefined);
        }}
        onSave={handleSaveCloudRouter}
        cloudRouter={editingCloudRouter}
        connectionId={connection.id.toString()}
      />

      <DeleteCloudRouterModal
        isOpen={!!deletingCloudRouter}
        onClose={() => setDeletingCloudRouter(undefined)}
        onConfirm={handleConfirmDeleteCloudRouter}
        cloudRouterName={deletingCloudRouter?.name || ''}
      />

      <VLANModal
        isOpen={showAddLinkModal}
        onClose={() => {
          setShowAddLinkModal(false);
          setEditingLink(undefined);
          setSelectedCloudRouterId(undefined);
        }}
        onSave={handleSaveLink}
        vlan={editingLink as any}
        connectionId={connection.id.toString()}
        availableBandwidth={10}
        cloudRouters={cloudRouters}
        selectedCloudRouterId={selectedCloudRouterId}
      />

      <DeleteVLANModal
        isOpen={!!deletingLink}
        onClose={() => setDeletingLink(undefined)}
        onConfirm={handleConfirmDeleteLink}
        vlanName={deletingLink?.name || ''}
      />

      <VNFModal
        isOpen={showAddVNFModal}
        onClose={() => {
          setShowAddVNFModal(false);
          setEditingVNF(undefined);
        }}
        onSave={handleSaveVNF}
        vnf={editingVNF}
        connectionId={connection.id.toString()}
        links={getAllLinks()}
      />

      <DeleteVNFModal
        isOpen={!!deletingVNF}
        onClose={() => setDeletingVNF(undefined)}
        onConfirm={handleConfirmDeleteVNF}
        vnfName={deletingVNF?.name || ''}
      />
    </div>
  );
}
