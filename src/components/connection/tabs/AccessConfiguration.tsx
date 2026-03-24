import { useState } from 'react';
import { Users, UserPlus, Key, Shield } from 'lucide-react';
import { Button } from '../../common/Button';

interface AccessRule {
  id: string;
  user: string;
  role: string;
  permissions: string[];
  lastAccess: string;
}

export function AccessConfiguration() {
  const [accessRules] = useState<AccessRule[]>([
    {
      id: '1',
      user: 'Sarah Chen',
      role: 'Administrator',
      permissions: ['view', 'edit', 'delete'],
      lastAccess: '2024-03-10T15:30:00Z'
    },
    {
      id: '2',
      user: 'John Smith',
      role: 'Network Engineer',
      permissions: ['view', 'edit'],
      lastAccess: '2024-03-10T14:45:00Z'
    },
    {
      id: '3',
      user: 'Maria Garcia',
      role: 'Read Only',
      permissions: ['view'],
      lastAccess: '2024-03-09T11:20:00Z'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em]">Access Control</h3>
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => {
              window.addToast({
                type: 'info',
                title: 'Add User',
                message: 'User management coming soon',
                duration: 3000
              });
            }}
          >
            Add User
          </Button>
        </div>

        <div className="space-y-4">
          {accessRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 bg-fw-wash rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-fw-blue-light flex items-center justify-center border border-fw-secondary">
                  <Users className="h-5 w-5 text-fw-bodyLight" />
                </div>
                <div>
                  <p className="text-figma-base font-medium text-fw-heading">{rule.user}</p>
                  <p className="text-figma-sm text-fw-bodyLight">{rule.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-figma-sm text-fw-bodyLight">Last access</p>
                  <p className="text-figma-base font-medium text-fw-heading">
                    {new Date(rule.lastAccess).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Key}
                  onClick={() => {
                    window.addToast({
                      type: 'info',
                      title: 'Edit Permissions',
                      message: 'Permission management coming soon',
                      duration: 3000
                    });
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em] mb-6">Role Permissions</h3>
        <div className="space-y-4">
          <div className="p-4 bg-fw-wash rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-brand-blue" />
              <h4 className="text-figma-base font-medium text-fw-heading">Administrator</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-figma-sm font-medium bg-fw-accent text-fw-linkHover rounded-lg">Full Access</span>
              <span className="px-2 py-1 text-figma-sm font-medium bg-fw-accent text-fw-linkHover rounded-lg">View</span>
              <span className="px-2 py-1 text-figma-sm font-medium bg-fw-accent text-fw-linkHover rounded-lg">Edit</span>
              <span className="px-2 py-1 text-figma-sm font-medium bg-fw-accent text-fw-linkHover rounded-lg">Delete</span>
            </div>
          </div>
          <div className="p-4 bg-fw-wash rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-fw-success" />
              <h4 className="text-figma-base font-medium text-fw-heading">Network Engineer</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-figma-sm font-medium bg-fw-successLight text-fw-success rounded-lg">View</span>
              <span className="px-2 py-1 text-figma-sm font-medium bg-fw-successLight text-fw-success rounded-lg">Edit</span>
            </div>
          </div>
          <div className="p-4 bg-fw-wash rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-fw-bodyLight" />
              <h4 className="text-figma-base font-medium text-fw-heading">Read Only</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-figma-sm font-medium bg-fw-neutral text-fw-heading rounded-lg">View</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}