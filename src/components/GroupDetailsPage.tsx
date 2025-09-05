import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, User, Network, CreditCard, Activity, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SubNav } from './navigation/SubNav';
import { GroupDetailHeader } from './group-detail/GroupDetailHeader';
import { GroupMetricsPanel } from './group-detail/GroupMetricsPanel';
import { GroupContactsSection } from './group-detail/GroupContactsSection';
import { VerticalTabGroup } from './navigation/VerticalTabGroup';
import { ConfirmDialog } from './common/ConfirmDialog';
import { GroupOverview } from './configure/groups/tabs/GroupOverview';
import { GroupMembers } from './configure/groups/tabs/GroupMembers';
import { GroupConnections } from './configure/groups/tabs/GroupConnections';
import { GroupBilling } from './configure/groups/tabs/GroupBilling';
import { GroupPerformance } from './configure/groups/tabs/GroupPerformance';
import { GroupSettings } from './configure/groups/tabs/GroupSettings';
import { GroupNetworkTab } from './configure/groups/tabs/GroupNetworkTab';
import { TabItem } from '../types/navigation';
import { GroupConnectionSummaryWidget } from './group/widgets/GroupConnectionSummaryWidget';
import { GroupPerformanceWidget } from './group/widgets/GroupPerformanceWidget';
import { AsyncBoundary } from './common/AsyncBoundary';

export function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const groups = useStore(state => state.groups);
  const users = useStore(state => state.users);
  const connections = useStore(state => state.connections);
  const removeGroup = useStore(state => state.removeGroup);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Find the group by ID
  const group = groups.find(g => g.id === id);
  
  // Map connection IDs to actual connection objects
  const groupConnections = connections.filter(conn => 
    group?.connectionIds.includes(conn.id)
  );
  
  // Map user IDs to actual user objects
  const groupUsers = users.filter(user => 
    group?.userIds.includes(user.id)
  );

  // If group not found, navigate back to groups page
  useEffect(() => {
    if (!group && id) {
      navigate('/groups');
      
      window.addToast({
        type: 'error',
        title: 'Pool Not Found',
        message: 'The requested pool could not be found.',
        duration: 3000
      });
    }
  }, [group, id, navigate]);

  if (!group) {
    return null; // Will redirect due to the useEffect
  }

  const handleDeleteGroup = async () => {
    try {
      await removeGroup(group.id);
      navigate('/groups');
    } catch (error) {
      console.error('Failed to delete pool:', error);
    }
  };

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: <Layers className="h-5 w-5 mr-2" /> },
    { id: 'members', label: 'Members', icon: <User className="h-5 w-5 mr-2" /> },
    { id: 'connections', label: 'Connections', icon: <Network className="h-5 w-5 mr-2" /> },
    { id: 'network', label: 'Network', icon: <Layers className="h-5 w-5 mr-2" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="h-5 w-5 mr-2" /> },
    { id: 'performance', label: 'Performance', icon: <Activity className="h-5 w-5 mr-2" /> },
    { id: 'settings', label: 'Settings', icon: <Edit2 className="h-5 w-5 mr-2" /> }
  ];

  return (
    <>
      <SubNav
        title={group.name}
        description={group.description}
        action={{
          label: 'Back to Pools',
          icon: <ArrowLeft className="h-5 w-5 mr-2" />,
          to: "/groups"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GroupDetailHeader 
          group={group} 
          onDeleteClick={() => setShowDeleteConfirm(true)} 
        />
        
        {/* Group Connection Widgets - New Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AsyncBoundary>
            <GroupConnectionSummaryWidget
              group={group}
              connections={connections}
            />
          </AsyncBoundary>
          
          <AsyncBoundary>
            <GroupPerformanceWidget
              group={group}
              connections={connections}
            />
          </AsyncBoundary>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <GroupMetricsPanel 
            group={group} 
            connections={groupConnections} 
            users={groupUsers} 
          />
        </div>

        {/* Contact & Address Cards */}
        <GroupContactsSection group={group} />

        {/* Tabs and Content Area */}
        <div className="flex">
          <VerticalTabGroup
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex-1 pl-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {activeTab === 'overview' && (
                <GroupOverview 
                  group={group} 
                  connections={groupConnections} 
                  users={groupUsers}
                />
              )}
              {activeTab === 'members' && (
                <GroupMembers 
                  group={group} 
                  users={groupUsers}
                  allUsers={users}
                />
              )}
              {activeTab === 'connections' && (
                <GroupConnections 
                  group={group} 
                  connections={groupConnections}
                  allConnections={connections}
                />
              )}
              {activeTab === 'network' && (
                <GroupNetworkTab
                  group={group}
                  connections={groupConnections}
                />
              )}
              {activeTab === 'billing' && (
                <GroupBilling 
                  group={group} 
                  connections={groupConnections}
                />
              )}
              {activeTab === 'performance' && (
                <GroupPerformance 
                  group={group} 
                  connections={groupConnections}
                />
              )}
              {activeTab === 'settings' && (
                <GroupSettings 
                  group={group}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteGroup}
        title="Delete Pool"
        message={`Are you sure you want to delete the pool "${group.name}"? This will remove all associations but won't delete the actual users or connections.`}
        icon={<Trash2 className="w-6 h-6 text-red-600" />}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  );
}