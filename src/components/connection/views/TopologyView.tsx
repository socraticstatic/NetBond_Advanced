import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Connection } from '../../../types';
import { Group } from '../../../types/group';
import { ConnectionVisualization } from '../ConnectionVisualization';
import { ConnectionOverflowMenu } from '../ConnectionOverflowMenu';
import { useStore } from '../../../store/useStore';
import { getGroupsForConnection } from '../../../utils/groups';
import { Group as GroupIcon, ChevronRight } from 'lucide-react';

interface TopologyViewProps {
  connections: Connection[];
  groups: Group[];
}

export function TopologyView({ connections, groups }: TopologyViewProps) {
  const navigate = useNavigate();
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const removeConnection = useStore(state => state.removeConnection);

  const handleDelete = (id: string) => {
    removeConnection(id);
    window.addToast({
      type: 'success',
      title: 'Connection Deleted',
      message: 'Connection has been removed successfully',
      duration: 3000
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {connections.map((connection) => {
        // Get groups for this connection
        const connectionGroups = getGroupsForConnection(groups, connection.id);
        
        return (
          <div
            key={connection.id}
            className={`
              bg-fw-base rounded-xl border border-fw-secondary overflow-visible
              transition-all duration-300 ease-in-out
              ${hoveredConnection === connection.id.toString() 
                ? 'shadow-lg ring-2 ring-[#009fdb] ring-opacity-50 transform scale-[1.02]' 
                : 'hover:shadow-md'
              }
            `}
            onMouseEnter={() => setHoveredConnection(connection.id.toString())}
            onMouseLeave={() => setHoveredConnection(null)}
            onClick={() => navigate(`/connections/${connection.id}`)}
          >
            {/* Header Section */}
            <div className="px-6 py-4 border-b border-fw-secondary">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg font-medium text-fw-heading truncate">{connection.name}</h3>
                  <p className="text-figma-base text-fw-bodyLight truncate">{connection.type}</p>
                  
                  {/* Show group badges */}
                  {connectionGroups.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {connectionGroups.slice(0, 2).map(group => (
                        <span key={group.id} className="inline-flex items-center px-2 py-1 rounded-full text-figma-sm bg-fw-neutral text-fw-body">
                          <GroupIcon className="h-3 w-3 mr-1.5" />
                          {group.name}
                        </span>
                      ))}
                      {connectionGroups.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-figma-sm bg-fw-neutral text-fw-body">
                          +{connectionGroups.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <ConnectionOverflowMenu
                    connection={connection}
                    onDelete={() => handleDelete(connection.id.toString())}
                  />
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 p-3 bg-fw-wash rounded-lg">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    connection.status === 'Active' ? 'bg-fw-successLight0' : 'bg-fw-bodyLight'
                  }`} />
                  <span className="text-figma-base font-medium text-fw-body">{connection.status}</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-fw-wash rounded-lg">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    connection.performance?.latency ?
                      parseFloat(connection.performance.latency) < 10 ? 'bg-fw-successLight0' :
                      parseFloat(connection.performance.latency) < 20 ? 'bg-fw-warn' :
                      'bg-fw-errorLight0' : 'bg-fw-bodyLight'
                  }`} />
                  <span className="text-figma-base font-medium text-fw-body">
                    {connection.performance?.latency || 'No Data'}
                  </span>
                </div>
              </div>

              {/* Topology Visualization */}
              <div className="h-[400px] rounded-xl overflow-hidden mb-6 border border-fw-secondary shadow-sm">
                <ConnectionVisualization connection={connection} standalone />
              </div>

              {/* Connection Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-fw-wash rounded-lg">
                  <span className="text-figma-base text-fw-bodyLight">Bandwidth</span>
                  <p className="text-figma-base font-medium text-fw-heading mt-1">{connection.bandwidth}</p>
                </div>
                <div className="p-3 bg-fw-wash rounded-lg">
                  <span className="text-figma-base text-fw-bodyLight">Location</span>
                  <p className="text-figma-base font-medium text-fw-heading mt-1">{connection.location}</p>
                </div>
              </div>
            </div>
            
            {/* Action Footer - Similar to ConnectionCardAction */}
            <div className="p-4 border-t border-fw-secondary">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/connections/${connection.id}`);
                }}
                className="w-full flex items-center justify-center px-4 py-2 bg-fw-base border border-fw-secondary rounded-lg text-figma-base font-medium text-fw-body hover:bg-fw-wash transition-colors"
              >
                Manage Connection
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}