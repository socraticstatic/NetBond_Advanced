import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, RefreshCw, Maximize2 } from 'lucide-react';
import { VNFTable } from './VNFTable';
import { VNF } from '../../../types/vnf';
import { CloudRouter } from '../../../types/cloudrouter';
import { VNFModal } from '../modals/VNFModal';
import { DeleteVNFModal } from '../modals/DeleteVNFModal';
import { Button } from '../../common/Button';

interface DetachedVNFTableProps {
  connectionId?: string;
}

export function DetachedVNFTable({ connectionId: initialConnectionId }: DetachedVNFTableProps) {
  const { windowId, connectionId: routeConnectionId } = useParams<{ windowId: string; connectionId: string }>();
  const navigate = useNavigate();
  const connectionId = initialConnectionId || routeConnectionId;

  const [vnfs, setVnfs] = useState<VNF[]>([]);
  const [cloudRouters, setCloudRouters] = useState<CloudRouter[]>([]);
  const [editingVNF, setEditingVNF] = useState<VNF | undefined>();
  const [deletingVNF, setDeletingVNF] = useState<VNF | undefined>();
  const [showAddVNFModal, setShowAddVNFModal] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // Listen for data updates from parent window via BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('vnf-sync');

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'VNF_UPDATED':
          setVnfs(payload.vnfs);
          setLastSync(new Date());
          break;
        case 'CLOUD_ROUTERS_UPDATED':
          setCloudRouters(payload.cloudRouters);
          setLastSync(new Date());
          break;
        case 'FULL_SYNC':
          setVnfs(payload.vnfs || []);
          setCloudRouters(payload.cloudRouters || []);
          setLastSync(new Date());
          break;
        case 'PARENT_CLOSED':
          setIsConnected(false);
          break;
      }
    };

    channel.addEventListener('message', handleMessage);

    // Request initial data from parent
    channel.postMessage({ type: 'REQUEST_SYNC', windowId });

    // Check connection status periodically
    const connectionCheck = setInterval(() => {
      try {
        if (window.opener && window.opener.closed) {
          setIsConnected(false);
          clearInterval(connectionCheck);
        }
      } catch {
        setIsConnected(false);
        clearInterval(connectionCheck);
      }
    }, 2000);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
      clearInterval(connectionCheck);
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

  const handleClose = () => {
    // Notify parent that this window is closing
    const channel = new BroadcastChannel('vnf-sync');
    channel.postMessage({ type: 'DETACHED_CLOSED', windowId });
    channel.close();
    window.close();
  };

  const handleRefresh = () => {
    const channel = new BroadcastChannel('vnf-sync');
    channel.postMessage({ type: 'REQUEST_SYNC', windowId });
    channel.close();
  };

  const handleReturnToMain = () => {
    if (window.opener && !window.opener.closed) {
      window.opener.focus();
    }
    handleClose();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Maximize2 className="h-5 w-5 text-gray-400" />
              <h1 className="text-lg font-semibold text-gray-900">VNF Table - Detached View</h1>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {isConnected && (
                <span className="text-xs text-gray-400">
                  Last sync: {lastSync.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={handleRefresh}
              disabled={!isConnected}
              size="sm"
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleReturnToMain}
              size="sm"
            >
              Return to Main
            </Button>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Close window"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!isConnected && (
          <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
            <p className="text-sm text-yellow-800">
              Connection to main window lost. Data may be out of sync.
            </p>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <VNFTable
              vnfs={vnfs}
              cloudRouters={cloudRouters}
              onEdit={handleEditVNF}
              onDelete={handleDeleteVNF}
            />
          </div>
        </div>
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
