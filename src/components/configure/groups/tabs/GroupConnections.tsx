import { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter, Download, X } from 'lucide-react';
import { Connection, Group } from '../../../../types';
import { Button } from '../../../common/Button';
import { useStore } from '../../../../store/useStore';
import { BaseTable } from '../../../common/BaseTable';
import { ConfirmDialog } from '../../../common/ConfirmDialog';

interface GroupConnectionsProps {
  group: Group;
  connections: Connection[];
  allConnections: Connection[];
}

export function GroupConnections({ group, connections, allConnections }: GroupConnectionsProps) {
  const addConnectionToGroup = useStore(state => state.addConnectionToGroup);
  const removeConnectionFromGroup = useStore(state => state.removeConnectionFromGroup);
  
  const [selectedConnectionIds, setSelectedConnectionIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [filteredConnections, setFilteredConnections] = useState(connections);

  // Available connections (not already in this group)
  const availableConnections = allConnections.filter(
    conn => !group.connectionIds.includes(conn.id.toString())
  );
  
  // Update filtered connections when connections change
  useEffect(() => {
    setFilteredConnections(
      connections.filter(conn => 
        conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conn.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conn.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [connections, searchQuery]);
  
  const handleAddConnections = async () => {
    try {
      for (const connectionId of selectedConnectionIds) {
        await addConnectionToGroup(group.id, connectionId);
      }
      setSelectedConnectionIds([]);
      setShowAddModal(false);
      
      window.addToast({
        type: 'success',
        title: 'Connections Added',
        message: `${selectedConnectionIds.length} connection${selectedConnectionIds.length !== 1 ? 's' : ''} added to group`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error adding connections to group:', error);
      window.addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to add connections to group',
        duration: 3000
      });
    }
  };
  
  const handleRemoveConnection = async (connectionId: string) => {
    try {
      await removeConnectionFromGroup(group.id, connectionId);
      setShowRemoveConfirm(null);
    } catch (error) {
      console.error('Error removing connection from group:', error);
      window.addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to remove connection from group',
        duration: 3000
      });
    }
  };
  
  // Get connection status display
  const getStatusDisplay = (status: string) => {
    const statusColor = status === 'Active' 
      ? 'bg-green-50 text-fw-success' 
      : 'bg-fw-neutral text-fw-body';
      
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-figma-sm font-medium ${statusColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search and Controls */}
      <div className="bg-fw-base p-4 rounded-lg border border-fw-secondary">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fw-bodyLight h-5 w-5" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-fw-secondary rounded-full focus:ring-2 focus:ring-fw-active focus:border-fw-active"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="primary"
              icon={PlusCircle}
              onClick={() => setShowAddModal(true)}
            >
              Add Connection
            </Button>
            <Button
              variant="outline"
              icon={Download}
              onClick={() => {
                const csv = [
                  ['Name', 'Type', 'Status', 'Bandwidth', 'Location'].join(','),
                  ...filteredConnections.map(conn =>
                    [conn.name, conn.type, conn.status, conn.bandwidth, conn.location].join(',')
                  )
                ].join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${group.name}_connections.csv`;
                link.click();
                URL.revokeObjectURL(url);

                window.addToast({
                  type: 'success',
                  title: 'Export Complete',
                  message: 'Connections exported successfully',
                  duration: 3000
                });
              }}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Connections Table */}
      <div className="bg-fw-base rounded-2xl overflow-hidden">
        {filteredConnections.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-fw-bodyLight mb-4">No connections in this group yet</p>
            <Button
              variant="primary"
              icon={PlusCircle}
              onClick={() => setShowAddModal(true)}
            >
              Add Connection
            </Button>
          </div>
        ) : (
          <BaseTable
            columns={[
              {
                id: 'name',
                label: 'Name',
                render: (item: Connection) => (
                  <div>
                    <div className="text-figma-base font-medium text-fw-heading">{item.name}</div>
                    <div className="text-figma-sm text-fw-bodyLight">{item.type}</div>
                  </div>
                )
              },
              {
                id: 'status',
                label: 'Status',
                render: (item: Connection) => getStatusDisplay(item.status)
              },
              {
                id: 'bandwidth',
                label: 'Bandwidth',
                render: (item: Connection) => (
                  <div className="text-figma-base text-fw-heading">{item.bandwidth}</div>
                )
              },
              {
                id: 'location',
                label: 'Location',
                render: (item: Connection) => (
                  <div className="text-figma-base text-fw-heading">{item.location}</div>
                )
              }
            ]}
            data={filteredConnections}
            keyField="id"
            tableId="group-connections"
            showColumnManager={true}
            onRowClick={(item) => window.location.href = `/connections/${item.id}`}
            actions={(item) => (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRemoveConfirm(item.id.toString());
                }}
                className="text-fw-error hover:bg-red-50 hover:border-red-300"
              >
                Remove
              </Button>
            )}
            emptyState={
              <div className="text-center py-8">
                <p className="text-fw-bodyLight">No connections match your search criteria</p>
              </div>
            }
          />
        )}
      </div>
      
      {/* Add Connections Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-fw-neutral bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-fw-base rounded-lg max-w-2xl w-full mx-4 sm:mx-auto shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-fw-secondary flex justify-between items-center">
              <h3 className="text-lg font-medium text-fw-heading">Add Connections to Group</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-fw-bodyLight hover:text-fw-body"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fw-bodyLight h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search available connections..."
                    className="pl-10 pr-4 h-9 w-full border border-fw-secondary rounded-lg text-figma-base focus:ring-2 focus:ring-fw-active focus:border-fw-active"
                  />
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {availableConnections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-fw-bodyLight">No available connections to add</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableConnections.map(conn => (
                      <div 
                        key={conn.id} 
                        className={`
                          flex items-center justify-between p-3 rounded-lg border
                          ${selectedConnectionIds.includes(conn.id.toString()) 
                            ? 'border-fw-active bg-fw-accent' 
                            : 'border-fw-secondary hover:bg-fw-wash'
                          }
                        `}
                      >
                        <label className="flex items-center w-full cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedConnectionIds.includes(conn.id.toString())}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedConnectionIds([...selectedConnectionIds, conn.id.toString()]);
                              } else {
                                setSelectedConnectionIds(
                                  selectedConnectionIds.filter(id => id !== conn.id.toString())
                                );
                              }
                            }}
                            className="rounded border-fw-secondary text-fw-cobalt-600 focus:ring-fw-active h-4 w-4"
                          />
                          <div className="ml-3">
                            <div className="text-figma-base font-medium text-fw-heading">{conn.name}</div>
                            <div className="text-figma-sm text-fw-bodyLight">
                              {conn.type} • {conn.location} • {conn.bandwidth}
                            </div>
                          </div>
                        </label>
                        <div>
                          {getStatusDisplay(conn.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddConnections}
                  disabled={selectedConnectionIds.length === 0}
                >
                  Add Selected Connections
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Remove Connection Confirmation */}
      <ConfirmDialog
        isOpen={!!showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(null)}
        onConfirm={() => {
          if (showRemoveConfirm) {
            handleRemoveConnection(showRemoveConfirm);
          }
        }}
        title="Remove Connection"
        message="Are you sure you want to remove this connection from the group? This won't delete the connection itself."
        confirmText="Remove"
        confirmVariant="danger"
      />
    </div>
  );
}