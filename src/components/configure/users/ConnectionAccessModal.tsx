import { useState } from 'react';
import { X, Network } from 'lucide-react';
import { UserType } from '../types';

interface ConnectionAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onSave: (userId: string, connectionAccess: any[]) => void;
}

const AVAILABLE_CONNECTIONS = [
  { id: '1', name: 'AWS Direct Connect' },
  { id: '2', name: 'Azure ExpressRoute' },
  { id: '3', name: 'Google Cloud Interconnect' },
  { id: '4', name: 'Site-to-Site VPN' }
];

const PERMISSIONS = [
  { id: 'view', label: 'View' },
  { id: 'manage', label: 'Manage' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'configure', label: 'Configure' }
];

export function ConnectionAccessModal({ isOpen, onClose, user, onSave }: ConnectionAccessModalProps) {
  const [accessConfig, setAccessConfig] = useState(
    user.connectionAccess.reduce((acc, curr) => ({
      ...acc,
      [curr.connectionId]: curr.permissions
    }), {})
  );

  if (!isOpen) return null;

  const handlePermissionToggle = (connectionId: string, permission: string) => {
    setAccessConfig(prev => {
      const current = prev[connectionId] || [];
      const updated = current.includes(permission)
        ? current.filter(p => p !== permission)
        : [...current, permission];

      return {
        ...prev,
        [connectionId]: updated
      };
    });
  };

  const handleSave = () => {
    const formattedAccess = Object.entries(accessConfig)
      .filter(([_, permissions]) => permissions.length > 0)
      .map(([connectionId, permissions]) => ({
        connectionId,
        name: AVAILABLE_CONNECTIONS.find(c => c.id === connectionId)?.name || '',
        permissions
      }));

    onSave(user.id, formattedAccess);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-fw-neutral bg-opacity-75" onClick={onClose} />

        {/* Modal panel */}
        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-fw-base rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-fw-bodyLight hover:text-fw-body focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-fw-accent rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <Network className="w-6 h-6 text-fw-link" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-figma-lg font-bold leading-6 text-fw-heading tracking-[-0.03em]">
                Manage Connection Access
              </h3>
              <div className="mt-2">
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em]">
                  Configure connection access permissions for {user.name}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {AVAILABLE_CONNECTIONS.map((connection) => (
              <div key={connection.id} className="p-4 border border-fw-secondary rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Network className="w-5 h-5 mr-2 text-fw-bodyLight" />
                    <span className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{connection.name}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {PERMISSIONS.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center p-2 border border-fw-secondary rounded-lg cursor-pointer hover:bg-fw-wash"
                    >
                      <input
                        type="checkbox"
                        checked={(accessConfig[connection.id] || []).includes(permission.id)}
                        onChange={() => handlePermissionToggle(connection.id, permission.id)}
                        className="w-4 h-4 text-fw-cobalt-600 border-fw-secondary rounded focus:ring-fw-active"
                      />
                      <span className="ml-2 text-figma-base font-medium text-fw-body tracking-[-0.03em]">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex justify-center w-full px-4 py-2 h-9 text-figma-base font-medium tracking-[-0.03em] text-white bg-fw-cobalt-600 border border-transparent rounded-full shadow-sm hover:bg-fw-cobalt-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fw-active transition-colors sm:ml-3 sm:w-auto"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center w-full px-4 py-2 h-9 mt-3 text-figma-base font-medium tracking-[-0.03em] text-fw-body bg-fw-base border border-fw-secondary rounded-full shadow-sm hover:bg-fw-wash focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fw-active transition-colors sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
