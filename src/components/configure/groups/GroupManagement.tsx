import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Plus, Edit2, Trash2, User, Network as NetworkIcon, Filter, Download, Building, CreditCard, Activity, Globe } from 'lucide-react';
import { BaseTable } from '../../common/BaseTable';
import { Button } from '../../common/Button';
import { OverflowMenu } from '../../common/OverflowMenu';
import { Group } from '../../../types/group';
import { useStore } from '../../../store/useStore';
import { AddGroupModal } from './AddGroupModal';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { formatAddress } from '../../../utils/groups';

interface GroupManagementProps {
  searchQuery: string;
}

export function GroupManagement({ searchQuery }: GroupManagementProps) {
  const navigate = useNavigate();
  const groups = useStore(state => state.groups);
  const removeGroup = useStore(state => state.removeGroup);
  const connections = useStore(state => state.connections);
  const users = useStore(state => state.users);
  const addGroup = useStore(state => state.addGroup);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: [] as Array<Group['type']>,
    status: [] as Array<Group['status']>
  });

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Filter groups based on search query and filters
  const filteredGroups = groups.filter(group => {
    const searchLower = (localSearchQuery || '').toLowerCase();
    const matchesSearch = !searchLower || 
      group.name.toLowerCase().includes(searchLower) ||
      (group.description || '').toLowerCase().includes(searchLower);
    
    if (!matchesSearch) return false;

    // Type filter
    const matchesType = !filters.type.length || filters.type.includes(group.type);
    
    // Status filter
    const matchesStatus = !filters.status.length || filters.status.includes(group.status);
    
    return matchesType && matchesStatus;
  });

  const handleDeleteGroup = (id: string) => {
    removeGroup(id);
    setShowConfirmDelete(null);
    
    window.addToast({
      type: 'success',
      title: 'Group Deleted',
      message: 'Group has been removed successfully.',
      duration: 3000
    });
  };

  const handleViewGroup = (id: string) => {
    navigate(`/configure/groups/${id}`);
  };

  const handleAddGroup = async (newGroup: Omit<Group, 'id' | 'createdAt'>) => {
    // Generate ID and createdAt
    const groupToAdd = {
      ...newGroup,
      id: `group-${Date.now()}`,
      createdAt: new Date().toISOString()
    } as Group;
    
    try {
      await addGroup(groupToAdd);
      setShowAddModal(false);
      
      window.addToast({
        type: 'success',
        title: 'Group Created',
        message: 'Group has been created successfully',
        duration: 3000
      });
    } catch (error) {
      console.error('Error creating group:', error);
      window.addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to create group. Please try again.',
        duration: 3000
      });
    }
  };

  // Get group type color
  const getGroupTypeColor = (type: Group['type']) => {
    switch (type) {
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'department':
        return 'bg-purple-100 text-purple-800';
      case 'project':
        return 'bg-green-100 text-green-800';
      case 'team':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      width: '30%',
      render: (group: Group) => (
        <div className="max-w-[200px]">
          <div className="text-sm font-medium text-gray-900 truncate">{group.name}</div>
          <div className="text-sm text-gray-500 truncate">{group.description || 'No description'}</div>
        </div>
      )
    },
    {
      id: 'type',
      label: 'Type',
      sortable: true,
      width: '15%',
      render: (group: Group) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGroupTypeColor(group.type)} capitalize`}>
          {group.type}
        </span>
      )
    },
    {
      id: 'connections',
      label: 'Connections',
      sortable: true,
      width: '17%',
      render: (group: Group) => (
        <div className="flex items-center">
          <NetworkIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{group.connectionIds.length}</span>
        </div>
      )
    },
    {
      id: 'members',
      label: 'Members',
      sortable: true,
      width: '17%',
      render: (group: Group) => (
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{group.userIds.length}</span>
        </div>
      )
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      width: '21%',
      render: (group: Group) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          group.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : group.status === 'inactive'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-red-100 text-red-800'
        } capitalize`}>
          {group.status}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* Search and Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search groups..."
              value={localSearchQuery || ''}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddModal(true)}
            >
              Create Pool
            </Button>
            <Button
              variant="outline"
              icon={Download}
              onClick={() => {
                window.addToast({
                  type: 'success',
                  title: 'Export Complete',
                  message: 'Groups have been exported successfully',
                  duration: 3000
                });
              }}
            >
              Export
            </Button>
            <Button
              variant="outline"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Group Type</h4>
                <div className="space-y-2">
                  {['business', 'department', 'project', 'team', 'custom'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type as Group['type'])}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, type: [...filters.type, type as Group['type']]});
                          } else {
                            setFilters({...filters, type: filters.type.filter(t => t !== type)});
                          }
                        }}
                        className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                <div className="space-y-2">
                  {['active', 'inactive', 'suspended'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status as Group['status'])}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, status: [...filters.status, status as Group['status']]});
                          } else {
                            setFilters({...filters, status: filters.status.filter(s => s !== status)});
                          }
                        }}
                        className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Advanced Filters</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Has Connections</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Has Members</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Has Addresses</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BaseTable
        columns={columns}
        data={filteredGroups}
        keyField="id"
        onRowClick={(group) => handleViewGroup(group.id)}
        actions={(group) => (
          <OverflowMenu
            items={[
              {
                id: 'view',
                label: 'View Details',
                icon: <Users className="h-4 w-4" />,
                onClick: () => handleViewGroup(group.id)
              },
              {
                id: 'edit',
                label: 'Edit Group',
                icon: <Edit2 className="h-4 w-4" />,
                onClick: () => handleViewGroup(group.id)
              },
              {
                id: 'delete',
                label: 'Delete Group',
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => setShowConfirmDelete(group.id),
                variant: 'danger'
              }
            ]}
          />
        )}
        emptyState={
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No groups found</p>
          </div>
        }
      />
      
      {/* Add Group Modal */}
      <AddGroupModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddGroup}
        users={users}
        connections={connections}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!showConfirmDelete}
        onClose={() => setShowConfirmDelete(null)}
        onConfirm={() => showConfirmDelete && handleDeleteGroup(showConfirmDelete)}
        title="Delete Group"
        message="Are you sure you want to delete this group? This action cannot be undone and will remove all group associations."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}