import { useState } from 'react';
import { User, MoreVertical, UserPlus, Search, Filter, Download } from 'lucide-react';
import { ConnectionAccessModal } from './ConnectionAccessModal';
import { AddUserModal } from './AddUserModal';
import { UserType } from '../types';
import { BaseTable } from '../../common/BaseTable';
import { OverflowMenu } from '../../common/OverflowMenu';
import { useStore } from '../../../store/useStore';
import { Button } from '../../common/Button';

interface UserListProps {
  searchQuery: string;
}

export function UserList({ searchQuery }: UserListProps) {
  const users = useStore(state => state.users);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  const filteredUsers = users.filter(user => {
    const query = (localSearchQuery || '').toLowerCase();
    const userName = (user.name || '').toLowerCase();
    const userEmail = (user.email || '').toLowerCase();
    const userRole = (user.role || '').toLowerCase();
    
    return userName.includes(query) || userEmail.includes(query) || userRole.includes(query);
  });

  const handleUpdateAccess = (userId: string, connectionAccess: any[]) => {
    window.addToast({
      type: 'success',
      title: 'Access Updated',
      message: 'User connection access has been updated successfully.',
      duration: 3000
    });
    setShowAccessModal(false);
  };

  const handleAddUser = (userData: Omit<UserType, 'id' | 'lastActive'>) => {
    window.addToast({
      type: 'success',
      title: 'User Added',
      message: 'New user has been added successfully.',
      duration: 3000
    });
    setShowAddModal(false);
  };

  const columns = [
    {
      id: 'user',
      label: 'User',
      sortable: true,
      sortKey: 'name' as keyof UserType,
      render: (user: UserType) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-9 w-9">
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
            <div className="text-xs text-gray-400">{user.role}</div>
          </div>
        </div>
      )
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      sortKey: 'status' as keyof UserType,
      render: (user: UserType) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
          user.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      )
    },
    {
      id: 'lastActive',
      label: 'Last Active',
      sortable: true,
      sortKey: 'lastActive' as keyof UserType,
      render: (user: UserType) => (
        <div className="text-sm text-gray-500">
          {new Date(user.lastActive).toLocaleString()}
        </div>
      )
    }
  ];

  return (
    <>
      {/* Search and Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value || '')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="primary"
              icon={UserPlus}
              onClick={() => setShowAddModal(true)}
            >
              Add User
            </Button>
            <Button
              variant="outline"
              icon={Filter}
              onClick={() => {}}
            >
              Filters
            </Button>
            <Button
              variant="outline"
              icon={Download}
              onClick={() => {}}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <BaseTable
        columns={columns}
        data={filteredUsers}
        keyField="id"
        tableId="users"
        showColumnManager={true}
        actions={(user) => (
          <OverflowMenu
            items={[
              {
                id: 'access',
                label: 'Manage Access',
                icon: <User className="h-4 w-4" />,
                onClick: () => {
                  setSelectedUser(user);
                  setShowAccessModal(true);
                }
              }
            ]}
          />
        )}
        emptyState="No users found"
      />

      {/* Modals */}
      {selectedUser && (
        <ConnectionAccessModal
          isOpen={showAccessModal}
          onClose={() => setShowAccessModal(false)}
          user={selectedUser}
          onSave={handleUpdateAccess}
        />
      )}
      
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddUser}
      />
    </>
  );
}