import { useState } from 'react';
import { User, MoreVertical, UserPlus, Search, Filter, Download, Shield, Eye, Lock, Globe } from 'lucide-react';
import { ConnectionAccessModal } from './ConnectionAccessModal';
import { AddUserModal } from './AddUserModal';
import { UserType } from '../types';
import { BaseTable } from '../../common/BaseTable';
import { OverflowMenu } from '../../common/OverflowMenu';
import { useStore } from '../../../store/useStore';
import { Button } from '../../common/Button';
import { PermissionBadge } from '../../common/PermissionBadge';
import { ScopeBadge } from '../../common/ScopeBadge';
import { permissionChecker } from '../../../utils/permissionChecker';
import { Role } from '../../../types/permissions';

interface UserListProps {
  searchQuery: string;
}

export function UserList({ searchQuery }: UserListProps) {
  const users = useStore(state => state.users);
  const { currentRole } = useStore();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  // Check if current user can manage users
  const canManageUsers = permissionChecker.hasPermission(currentRole, {
    permission: 'manage_users',
    resource: 'user'
  });

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

  // Map user role to our RBAC roles
  const mapUserRole = (role: string): Role => {
    if (role.toLowerCase().includes('admin') || role.toLowerCase().includes('administrator')) {
      return 'admin';
    }
    return 'user';
  };

  const getRoleColor = (role: string) => {
    if (role.toLowerCase().includes('admin')) return 'purple';
    return 'blue';
  };

  const getScopeForUser = (user: UserType): 'own' | 'department' | 'pool' | 'tenant' => {
    if (user.role.toLowerCase().includes('admin')) return 'tenant';
    if (user.department) return 'department';
    return 'own';
  };

  const columns = [
    {
      id: 'user',
      label: 'User',
      sortable: true,
      sortKey: 'name' as keyof UserType,
      render: (user: UserType) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-blue-200">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-600">{user.email}</div>
            {user.department && (
              <div className="text-xs text-gray-500 mt-0.5">{user.department}</div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'role',
      label: 'Role & Permissions',
      sortable: true,
      sortKey: 'role' as keyof UserType,
      render: (user: UserType) => {
        const mappedRole = mapUserRole(user.role);
        const roleColor = getRoleColor(user.role);
        const colorClasses = {
          purple: 'bg-purple-100 text-purple-800 border-purple-300',
          blue: 'bg-blue-100 text-blue-800 border-blue-300'
        }[roleColor];

        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Shield className={`h-3.5 w-3.5 ${roleColor === 'purple' ? 'text-purple-600' : 'text-blue-600'}`} />
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${colorClasses}`}>
                {user.role}
              </span>
            </div>
            <PermissionBadge
              requirement={{ permission: 'view', role: mappedRole }}
              variant="compact"
              showTooltip={true}
            />
          </div>
        );
      }
    },
    {
      id: 'scope',
      label: 'Access Scope',
      render: (user: UserType) => {
        const scope = getScopeForUser(user);
        return (
          <div className="space-y-1">
            <ScopeBadge scope={scope} variant="detailed" />
            <div className="text-xs text-gray-500">
              {scope === 'tenant' && 'Full tenant access'}
              {scope === 'department' && `${user.department || 'Department'} only`}
              {scope === 'own' && 'Own resources only'}
            </div>
          </div>
        );
      }
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      sortKey: 'status' as keyof UserType,
      render: (user: UserType) => (
        <div className="space-y-1">
          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            user.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
          <div className="text-xs text-gray-500">
            Last active: {new Date(user.lastActive).toLocaleDateString()}
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      {/* Permission Status Banner */}
      {!canManageUsers.allowed && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">Limited User Management Access</h3>
              <p className="text-xs text-yellow-700 mb-2">
                {canManageUsers.reason}. You can view users but cannot add, edit, or delete them.
              </p>
              <div className="flex items-center gap-2">
                <PermissionBadge requirement={{ permission: 'manage_users', resource: 'user' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RBAC Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Role-Based Access Control</h3>
            <p className="text-xs text-blue-700 mb-3">
              Users are assigned roles that determine their permissions. Each role has a defined scope limiting what resources they can access.
            </p>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-blue-900 font-medium">{users.length} Total Users</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-purple-600" />
                <span className="text-blue-900 font-medium">
                  {users.filter(u => u.role.toLowerCase().includes('admin')).length} Admins
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-green-600" />
                <span className="text-blue-900 font-medium">
                  {users.filter(u => u.status === 'active').length} Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value || '')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              icon={UserPlus}
              onClick={() => setShowAddModal(true)}
              disabled={!canManageUsers.allowed}
            >
              Add User
            </Button>
            <Button
              variant="outline"
              icon={Filter}
              onClick={() => {
                window.addToast({
                  type: 'info',
                  title: 'Filter Users',
                  message: 'Advanced filtering coming soon',
                  duration: 3000
                });
              }}
            >
              Filters
            </Button>
            <Button
              variant="outline"
              icon={Download}
              onClick={() => {
                window.addToast({
                  type: 'success',
                  title: 'Export Users',
                  message: 'User list exported successfully',
                  duration: 3000
                });
              }}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
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
                  icon: <Eye className="h-4 w-4" />,
                  onClick: () => {
                    setSelectedUser(user);
                    setShowAccessModal(true);
                  },
                  disabled: !canManageUsers.allowed
                },
                {
                  id: 'edit',
                  label: 'Edit User',
                  icon: <User className="h-4 w-4" />,
                  onClick: () => {
                    window.addToast({
                      type: 'info',
                      title: 'Edit User',
                      message: 'User editing coming soon',
                      duration: 3000
                    });
                  },
                  disabled: !canManageUsers.allowed
                },
                {
                  id: 'permissions',
                  label: 'View Permissions',
                  icon: <Shield className="h-4 w-4" />,
                  onClick: () => {
                    const mappedRole = mapUserRole(user.role);
                    const permissions = permissionChecker.hasPermission(mappedRole, { permission: 'view' });
                    window.addToast({
                      type: 'info',
                      title: `${user.name}'s Permissions`,
                      message: `Role: ${user.role}\nScope: ${getScopeForUser(user)}`,
                      duration: 5000
                    });
                  }
                }
              ]}
            />
          )}
          emptyState={
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">No users found</h3>
              <p className="text-sm text-gray-500">
                {localSearchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first user'}
              </p>
            </div>
          }
        />
      </div>

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
