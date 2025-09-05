import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cog, Play, Pause, Trash2, Edit2, Activity, Network, Users, Globe, Cloud } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SubNav } from '../navigation/SubNav';
import { ConnectionTabs, ConnectionTabType } from './tabs/ConnectionTabs';
import { ConnectionOverview } from './tabs/ConnectionOverview';
import { RoutingTab } from './tabs/RoutingTab';
import { AccessConfiguration } from './tabs/AccessConfiguration';
import { VersioningConfiguration } from './tabs/VersioningConfiguration';
import { BillingConfiguration } from './tabs/BillingConfiguration';
import { ConnectionLogs } from '../configure/connections/ConnectionLogs';
import { NetworkTab } from './tabs/NetworkTab';
import { IconButton } from '../common/IconButton';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useEditableField } from '../../hooks/useEditableField';

export function ConnectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const connection = useStore(state => state.connections.find(c => c.id.toString() === id));
  const updateConnection = useStore(state => state.updateConnection);
  const removeConnection = useStore(state => state.removeConnection);
  const [activeTab, setActiveTab] = useState<ConnectionTabType>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    isEditing: isEditingName,
    value: newName,
    error: nameError,
    setValue: setNewName,
    handleStartEdit: startEditingName,
    handleSave: handleSaveName,
    handleCancel: handleCancelEdit
  } = useEditableField({
    initialValue: connection?.name || '',
    onSave: (name) => {
      if (connection) {
        updateConnection(connection.id, { name });
        window.addToast({
          type: 'success',
          title: 'Name Updated',
          message: 'Connection name has been updated successfully.',
          duration: 3000
        });
      }
    },
    validate: (name) => {
      if (!name.trim()) return 'Connection name cannot be empty';
    }
  });

  useEffect(() => {
    if (!connection) {
      navigate('/manage');
    }
  }, [connection, navigate]);

  if (!connection) return null;

  const handleToggleStatus = () => {
    const newStatus = connection.status === 'Active' ? 'Inactive' : 'Active';
    updateConnection(connection.id, { status: newStatus });
    
    window.addToast({
      type: 'success',
      title: 'Status Updated',
      message: `Connection is now ${newStatus}`,
      duration: 3000
    });
  };

  const handleDelete = () => {
    removeConnection(connection.id);
    navigate('/manage');
    
    window.addToast({
      type: 'success',
      title: 'Connection Deleted',
      message: 'Connection has been removed successfully.',
      duration: 3000
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ConnectionOverview connection={connection} />;
      case 'network':
        return <NetworkTab connection={connection} isEditing={isEditing} />;
      case 'routing':
        return <RoutingTab />;
      case 'access':
        return <AccessConfiguration />;
      case 'versions':
        return <VersioningConfiguration connectionId={connection.id.toString()} currentVersion="1.0.0" />;
      case 'billing':
        return <BillingConfiguration isEditing={isEditing} />;
      case 'logs':
        return <ConnectionLogs connectionId={connection.id.toString()} />;
      case 'qos':
      case 'security':
      case 'api':
      case 'test':
        return (
          <div className="p-6 text-center text-gray-500">
            This feature is currently unavailable
          </div>
        );
      default:
        return <ConnectionOverview connection={connection} />;
    }
  };

  return (
    <div className="min-h-screen">
      <SubNav
        title={
          isEditingName ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={`px-3 py-2 text-2xl font-bold bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  nameError ? 'border-red-500' : 'border-gray-300'
                }`}
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <IconButton
                  icon={<Edit2 className="h-5 w-5" />}
                  onClick={handleSaveName}
                  variant="success"
                  title="Save"
                />
                <IconButton
                  icon={<Trash2 className="h-5 w-5" />}
                  onClick={handleCancelEdit}
                  variant="danger"
                  title="Cancel"
                />
              </div>
              {nameError && (
                <span className="text-sm text-red-500">{nameError}</span>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>{connection.name}</span>
              <IconButton
                icon={<Edit2 className="h-5 w-5" />}
                onClick={startEditingName}
                variant="ghost"
                title="Edit Name"
              />
            </div>
          )
        }
        description={`${connection.type} - ${connection.location}`}
        action={{
          label: 'Back to Connections',
          icon: <ArrowLeft className="h-5 w-5 mr-2" />,
          onClick: () => navigate('/manage')
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {/* Status Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${
                connection.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <span className="ml-2 text-lg font-medium text-gray-900">
                {connection.status}
              </span>
            </div>
          </div>

          {/* Type Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <Network className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">{connection.type}</p>
          </div>

          {/* Group Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Group</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">No group assigned</p>
          </div>

          {/* Location Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">{connection.location}</p>
          </div>

          {/* Vendor Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Vendor</h3>
              <Cloud className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">{connection.provider || 'N/A'}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Status Toggle Button */}
            <Button
              variant={connection.status === 'Active' ? 'primary' : 'outline'}
              icon={connection.status === 'Active' ? Pause : Play}
              onClick={handleToggleStatus}
              className={connection.status === 'Active' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {connection.status === 'Active' ? 'Active' : 'Inactive'}
            </Button>

            {/* Delete Button */}
            <Button
              variant="outline"
              icon={Trash2}
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>

          <Button
            variant={isEditing ? 'primary' : 'outline'}
            icon={Cog}
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isEditing ? 'Save Changes' : 'Manage Settings'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <ConnectionTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm">
          {renderContent()}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Connection"
        message="Are you sure you want to delete this connection? This action cannot be undone."
        icon={<Trash2 className="w-6 h-6 text-red-600" />}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}