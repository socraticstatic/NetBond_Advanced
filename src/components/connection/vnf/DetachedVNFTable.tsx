import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VNFTable } from './VNFTable';
import { VNF } from '../../../types/vnf';
import { CloudRouter } from '../../../types/cloudrouter';
import { VNFModal } from '../modals/VNFModal';
import { DeleteVNFModal } from '../modals/DeleteVNFModal';

interface DetachedVNFTableProps {
  connectionId?: string;
}

export function DetachedVNFTable({ connectionId: initialConnectionId }: DetachedVNFTableProps) {
  const { windowId, connectionId: routeConnectionId } = useParams<{ windowId: string; connectionId: string }>();
  const connectionId = initialConnectionId || routeConnectionId;

  // Initialize with mock data for immediate display
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
      connectionId: connectionId || ''
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
      connectionId: connectionId || ''
    }
  ]);

  const [cloudRouters, setCloudRouters] = useState<CloudRouter[]>([
    {
      id: 'cr-1',
      name: 'Primary Cloud Router',
      description: 'Main cloud router for US-East region',
      status: 'active',
      location: 'US-East',
      links: [],
      policies: {
        routingPolicy: 'default',
        securityPolicy: 'standard',
        qosPolicy: 'standard'
      },
      connectionId: connectionId || '',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    }
  ]);

  const [editingVNF, setEditingVNF] = useState<VNF | undefined>();
  const [deletingVNF, setDeletingVNF] = useState<VNF | undefined>();
  const [showAddVNFModal, setShowAddVNFModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Listen for data updates from parent window via BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('vnf-sync');

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'VNF_UPDATED':
          setVnfs(payload.vnfs);
          break;
        case 'CLOUD_ROUTERS_UPDATED':
          setCloudRouters(payload.cloudRouters);
          break;
        case 'FULL_SYNC':
          setVnfs(payload.vnfs || []);
          setCloudRouters(payload.cloudRouters || []);
          break;
      }
    };

    channel.addEventListener('message', handleMessage);

    // Request initial data from parent
    channel.postMessage({ type: 'REQUEST_SYNC', windowId });

    return () => {
      // Notify parent that this window is closing
      channel.postMessage({ type: 'DETACHED_CLOSED', windowId });
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [windowId]);

  // Sync changes back to parent window
  const syncToParent = (updatedVnfs: VNF[]) => {
    const channel = new BroadcastChannel('vnf-sync');
    channel.postMessage({
      type: 'VNF_UPDATED_FROM_DETACHED',
      payload: { vnfs: updatedVnfs },
      windowId
    });
    channel.close();
  };

  const handleEditVNF = (vnf: VNF) => {
    setEditingVNF(vnf);
    setShowAddVNFModal(true);
  };

  const handleDeleteVNF = (vnf: VNF) => {
    setDeletingVNF(vnf);
  };

  const handleSaveVNF = (vnfData: VNF) => {
    let updatedVnfs: VNF[];
    if (editingVNF) {
      updatedVnfs = vnfs.map((v) => (v.id === vnfData.id ? vnfData : v));
    } else {
      updatedVnfs = [...vnfs, vnfData];
    }

    setVnfs(updatedVnfs);
    syncToParent(updatedVnfs);
    setShowAddVNFModal(false);
    setEditingVNF(undefined);

    window.addToast?.({
      type: 'success',
      title: editingVNF ? 'VNF Updated' : 'VNF Created',
      message: `${vnfData.name} has been ${editingVNF ? 'updated' : 'created'} successfully.`,
      duration: 3000
    });
  };

  const handleConfirmDeleteVNF = () => {
    if (deletingVNF) {
      const updatedVnfs = vnfs.filter((v) => v.id !== deletingVNF.id);
      setVnfs(updatedVnfs);
      syncToParent(updatedVnfs);

      window.addToast?.({
        type: 'success',
        title: 'VNF Deleted',
        message: `${deletingVNF.name} has been deleted successfully.`,
        duration: 3000
      });
      setDeletingVNF(undefined);
    }
  };

  const getAllLinks = () => {
    return cloudRouters.flatMap((router) => router.links || []);
  };

  // Filter VNFs by search query
  const filteredVnfs = vnfs.filter(vnf => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      vnf.name.toLowerCase().includes(searchLower) ||
      vnf.vendor?.toLowerCase().includes(searchLower) ||
      vnf.type.toLowerCase().includes(searchLower) ||
      vnf.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-white overflow-hidden m-0 p-0">
      {/* Search Bar - Fixed at top */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search VNFs by name, vendor, type, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Table - Takes remaining space */}
      <div className="flex-1 overflow-auto">
        <VNFTable
          vnfs={filteredVnfs}
          cloudRouters={cloudRouters}
          onEdit={handleEditVNF}
          onDelete={handleDeleteVNF}
        />
      </div>

      {/* Modals */}
      <VNFModal
        isOpen={showAddVNFModal}
        onClose={() => {
          setShowAddVNFModal(false);
          setEditingVNF(undefined);
        }}
        onSave={handleSaveVNF}
        vnf={editingVNF}
        connectionId={connectionId || ''}
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
