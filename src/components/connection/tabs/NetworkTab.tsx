import { useState } from 'react';
import { Plus, Filter, Download, Activity, Shield, Settings, Globe, Router, Network } from 'lucide-react';
import { Button } from '../../common/Button';
import { Connection } from '../../../types';
import { VNFSection } from '../vnf/VNFSection';
import { CloudRouterSection } from '../cloudrouter/CloudRouterSection';
import { LinkSection } from '../links/LinkSection';
import { VNF } from '../../../types/vnf';
import { VNFModal } from '../modals/VNFModal';
import { DeleteVNFModal } from '../modals/DeleteVNFModal';
import { CloudRouter } from '../../../types/cloudrouter';
import { CloudRouterModal } from '../cloudrouter/CloudRouterModal';
import { DeleteCloudRouterModal } from '../cloudrouter/DeleteCloudRouterModal';

interface NetworkTabProps {
  connection: Connection;
  isEditing?: boolean;
}

export function NetworkTab({ connection, isEditing = false }: NetworkTabProps) {
  // Active tab state (Links, VNFs or Cloud Routers)
  const [activeTabSection, setActiveTabSection] = useState<'cloudrouters' | 'links' | 'vnfs'>('cloudrouters');
  
  // VNF state for the modal
  const [showAddVNFModal, setShowAddVNFModal] = useState(false);
  const [editingVNF, setEditingVNF] = useState<VNF | undefined>();
  const [deletingVNF, setDeletingVNF] = useState<VNF | undefined>();

  // Cloud Router state for the modal
  const [showAddCloudRouterModal, setShowAddCloudRouterModal] = useState(false);
  const [editingCloudRouter, setEditingCloudRouter] = useState<CloudRouter | undefined>();
  const [deletingCloudRouter, setDeletingCloudRouter] = useState<CloudRouter | undefined>();

  // Sample VNF data
  const [vnfs, setVnfs] = useState<VNF[]>([
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
      configuration: {
        interfaces: [
          { 
            id: 'if-1', 
            name: 'WAN1', 
            type: 'wan', 
            ipAddress: '203.0.113.10', 
            subnetMask: '255.255.255.0', 
            status: 'up' 
          },
          { 
            id: 'if-2', 
            name: 'LAN1', 
            type: 'lan', 
            ipAddress: '10.0.0.1', 
            subnetMask: '255.255.255.0', 
            status: 'up' 
          }
        ],
        routingProtocols: ['BGP', 'OSPF'],
        highAvailability: true,
        managementIP: '192.168.1.10'
      },
      createdAt: '2024-01-10T12:00:00Z',
      updatedAt: '2024-03-15T09:30:00Z',
      description: 'Primary edge firewall for cloud connectivity',
      connectionId: connection.id.toString(),
      cloudRouterId: 'cr-1'
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
      configuration: {
        interfaces: [
          { 
            id: 'if-1', 
            name: 'WAN1', 
            type: 'wan', 
            ipAddress: '203.0.113.20', 
            subnetMask: '255.255.255.0', 
            status: 'up' 
          },
          { 
            id: 'if-2', 
            name: 'WAN2', 
            type: 'wan', 
            ipAddress: '198.51.100.20', 
            subnetMask: '255.255.255.0', 
            status: 'up' 
          }
        ],
        routingProtocols: ['BGP'],
        highAvailability: false,
        managementIP: '192.168.1.20'
      },
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-02-20T10:15:00Z',
      description: 'SD-WAN for branch office connectivity',
      connectionId: connection.id.toString(),
      cloudRouterId: 'cr-2'
    },
    // Add a router VNF function
    {
      id: 'vnf-3',
      name: 'Virtual Router',
      type: 'router',
      vendor: 'Cisco',
      model: 'CSR 1000v',
      version: '17.3.1a',
      status: 'active',
      throughput: '10 Gbps',
      configuration: {
        interfaces: [
          { 
            id: 'if-1', 
            name: 'GigabitEthernet0/0', 
            type: 'wan', 
            ipAddress: '203.0.113.30', 
            subnetMask: '255.255.255.0', 
            status: 'up' 
          },
          { 
            id: 'if-2', 
            name: 'GigabitEthernet0/1', 
            type: 'lan', 
            ipAddress: '10.1.0.1', 
            subnetMask: '255.255.255.0', 
            status: 'up' 
          }
        ],
        routingProtocols: ['BGP', 'OSPF', 'EIGRP'],
        highAvailability: true,
        managementIP: '192.168.1.30'
      },
      createdAt: '2024-02-15T10:30:00Z',
      updatedAt: '2024-03-10T08:15:00Z',
      description: 'Virtual router for multi-protocol routing',
      connectionId: connection.id.toString(),
      cloudRouterId: 'cr-1'
    },
    // Add a vNAT function
    {
      id: 'vnf-4',
      name: 'Virtual NAT Gateway',
      type: 'vnat',
      vendor: 'Fortinet',
      model: 'FortiGate-VM',
      version: '7.2.4',
      status: 'active',
      throughput: '1.5 Gbps',
      configuration: {
        interfaces: [
          { 
            id: 'if-1', 
            name: 'port1', 
            type: 'wan', 
            ipAddress: '203.0.113.40', 
            subnetMask: '255.255.255.0', 
            status: 'up' 
          },
          { 
            id: 'if-2', 
            name: 'port2', 
            type: 'lan', 
            ipAddress: '10.2.0.1', 
            subnetMask: '255.255.255.0', 
            status: 'up' 
          }
        ],
        routingProtocols: ['Static'],
        highAvailability: false,
        managementIP: '192.168.1.40'
      },
      createdAt: '2024-02-20T14:45:00Z',
      updatedAt: '2024-03-12T11:30:00Z',
      description: 'Virtual NAT for address translation',
      connectionId: connection.id.toString(),
      cloudRouterId: 'cr-2'
    }
  ]);

  // Sample Cloud Router data with expanded states default to true
  const [cloudRouters, setCloudRouters] = useState<CloudRouter[]>([
    {
      id: 'cr-1',
      name: 'Cloud Router A',
      description: 'Main cloud router for production workloads',
      status: 'active',
      location: 'US East',
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
          bandwidth: '5 Gbps'
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
          bandwidth: '2 Gbps'
        }
      ]
    },
    {
      id: 'cr-2',
      name: 'Cloud Router B',
      description: 'Backup cloud router for disaster recovery',
      status: 'active',
      location: 'US West',
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
          bandwidth: '1 Gbps'
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
          bandwidth: '1 Gbps'
        }
      ]
    }
  ]);

  // VNF handlers
  const handleAddVNF = () => {
    setShowAddVNFModal(true);
  };

  const handleEditVNF = (vnf: VNF) => {
    setEditingVNF(vnf);
  };

  const handleDeleteVNF = (vnf: VNF) => {
    setDeletingVNF(vnf);
  };

  const handleSaveVNF = (vnfData: VNF) => {
    if (editingVNF) {
      // Update existing VNF
      setVnfs(vnfs.map(v => v.id === editingVNF.id ? vnfData : v));
      
      window.addToast({
        type: 'success',
        title: 'VNF Updated',
        message: `VNF ${vnfData.name} has been updated successfully`,
        duration: 3000
      });
    } else {
      // Add new VNF with generated ID and timestamps
      const newVnf: VNF = {
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
      // Update existing Cloud Router
      setCloudRouters(cloudRouters.map(cr => cr.id === editingCloudRouter.id ? cloudRouterData : cr));
      
      window.addToast({
        type: 'success',
        title: 'Cloud Router Updated',
        message: `Cloud Router ${cloudRouterData.name} has been updated successfully`,
        duration: 3000
      });
    } else {
      // Add new Cloud Router with generated ID and timestamps
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
      // Remove the cloud router
      setCloudRouters(cloudRouters.filter(cr => cr.id !== deletingCloudRouter.id));
      
      // Also remove any VNFs associated with this cloud router
      setVnfs(vnfs.filter(vnf => vnf.cloudRouterId !== deletingCloudRouter.id));
      
      window.addToast({
        type: 'success',
        title: 'Cloud Router Deleted',
        message: `Cloud Router ${deletingCloudRouter.name} has been deleted successfully`,
        duration: 3000
      });
      
      setDeletingCloudRouter(undefined);
    }
  };

  // Get all links from all cloud routers
  const getAllLinks = () => {
    return cloudRouters.flatMap(router => 
      (router.links || []).map(link => ({
        ...link,
        cloudRouterName: router.name,
        cloudRouterId: router.id
      }))
    );
  };

  // Calculate total used bandwidth across all cloud routers
  const calculateTotalUsedBandwidth = () => {
    let totalUsed = 0;
    
    cloudRouters.forEach(router => {
      if (router.links && router.links.length > 0) {
        router.links.forEach(link => {
          // Extract numeric value from bandwidth if available
          if (link.bandwidth) {
            const bandwidthMatch = link.bandwidth.match(/(\d+(\.\d+)?)/);
            if (bandwidthMatch) {
              totalUsed += parseFloat(bandwidthMatch[0]);
            }
          }
        });
      }
    });
    
    return totalUsed;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Section Tabs */}
      <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
        <button
          onClick={() => setActiveTabSection('cloudrouters')}
          className={`
            flex items-center px-4 py-2 text-sm font-medium rounded-full
            transition-colors duration-200
            ${activeTabSection === 'cloudrouters'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          <Router className="h-5 w-5 mr-2" />
          Cloud Routers
        </button>
        <button
          onClick={() => setActiveTabSection('links')}
          className={`
            flex items-center px-4 py-2 text-sm font-medium rounded-full
            transition-colors duration-200
            ${activeTabSection === 'links'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          <Network className="h-5 w-5 mr-2" />
          Links
        </button>
        <button
          onClick={() => setActiveTabSection('vnfs')}
          className={`
            flex items-center px-4 py-2 text-sm font-medium rounded-full
            transition-colors duration-200
            ${activeTabSection === 'vnfs'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          <Shield className="h-5 w-5 mr-2" />
          VNF Functions
        </button>
      </div>

      {/* Cloud Router Section */}
      {activeTabSection === 'cloudrouters' && (
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
      {activeTabSection === 'links' && (
        <LinkSection
          connection={connection}
          allLinks={getAllLinks()}
          cloudRouters={cloudRouters}
          isEditing={isEditing}
        />
      )}

      {/* VNF Section */}
      {activeTabSection === 'vnfs' && (
        <VNFSection 
          vnfs={vnfs} 
          cloudRouters={cloudRouters}
          onAdd={handleAddVNF} 
          onEdit={handleEditVNF} 
          onDelete={handleDeleteVNF}
          connectionId={connection.id.toString()}
        />
      )}

      {/* VNF Modals */}
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
      />

      {/* Delete VNF Confirmation Modal */}
      {deletingVNF && (
        <DeleteVNFModal
          isOpen={!!deletingVNF}
          onClose={() => setDeletingVNF(undefined)}
          onConfirm={handleConfirmDeleteVNF}
          vnfName={deletingVNF.name}
          vnfType={deletingVNF.type}
        />
      )}

      {/* Cloud Router Modals */}
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

      {/* Delete Cloud Router Confirmation Modal */}
      {deletingCloudRouter && (
        <DeleteCloudRouterModal
          isOpen={!!deletingCloudRouter}
          onClose={() => setDeletingCloudRouter(undefined)}
          onConfirm={handleConfirmDeleteCloudRouter}
          cloudRouterName={deletingCloudRouter.name}
        />
      )}
    </div>
  );
}