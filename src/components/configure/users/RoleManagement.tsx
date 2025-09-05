import { useState } from 'react';
import { Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { Role } from '../types';
import { Button } from '../../common/Button';

export function RoleManagement() {
  const [roles] = useState<Role[]>([
    {
      id: '1',
      name: 'Administrator',
      description: 'Full system access and management capabilities',
      permissions: [
        'manage_users',
        'manage_connections',
        'manage_billing',
        'manage_reports',
        'system_settings'
      ]
    },
    {
      id: '2',
      name: 'Network Engineer',
      description: 'Manage and monitor network connections',
      permissions: [
        'view_connections',
        'manage_connections',
        'view_reports'
      ]
    },
    {
      id: '3',
      name: 'Security Analyst',
      description: 'Monitor and analyze security events',
      permissions: [
        'view_connections',
        'view_security_logs',
        'manage_security_settings'
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Role Management</h3>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            window.addToast({
              type: 'info',
              title: 'Add Role',
              message: 'Role creation coming soon',
              duration: 3000
            });
          }}
        >
          Add Role
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{role.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Permissions</h5>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-brand-lightBlue text-brand-blue"
                        >
                          {permission.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => {
                    window.addToast({
                      type: 'info',
                      title: 'Edit Role',
                      message: 'Role editing coming soon',
                      duration: 3000
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Trash2}
                  onClick={() => {
                    window.addToast({
                      type: 'info',
                      title: 'Delete Role',
                      message: 'Role deletion coming soon',
                      duration: 3000
                    });
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}