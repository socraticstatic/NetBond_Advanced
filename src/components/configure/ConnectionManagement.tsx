import { useState } from 'react';
import { Activity, History, Terminal } from 'lucide-react';
import { ConnectionList } from './connections/ConnectionList';
import { ConnectionLogs } from './connections/ConnectionLogs';
import { ConnectionTest } from './connections/ConnectionTest';
import { VerticalTabGroup } from '../navigation/VerticalTabGroup';
import { TabItem } from '../../types/navigation';

interface ConnectionManagementProps {
  searchQuery: string;
}

export function ConnectionManagement({ searchQuery }: ConnectionManagementProps) {
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'logs' | 'test'>('list');
  const [selectedConnectionName, setSelectedConnectionName] = useState<string>('');

  const tabs: TabItem[] = [
    { id: 'list', label: 'Connections', icon: <Activity className="h-5 w-5 mr-2" /> },
    { id: 'logs', label: 'Logs', icon: <History className="h-5 w-5 mr-2" /> },
    { id: 'test', label: 'Test', icon: <Terminal className="h-5 w-5 mr-2" /> }
  ];

  const handleSelectConnection = (id: string, name: string) => {
    setSelectedConnection(id);
    setSelectedConnectionName(name);
  };

  const handleUpdateConnection = (id: string, updates: any) => {
    window.addToast({
      type: 'success',
      title: 'Connection Updated',
      message: 'Connection name has been updated successfully.',
      duration: 3000
    });
  };

  return (
    <div className="p-6">
      {/* Help Banner */}
      {!selectedConnection && activeView !== 'list' && (
        <div className="mb-6 bg-fw-wash border-l-4 border-fw-info rounded-lg p-4">
          <div className="flex items-start">
            <Activity className="h-5 w-5 text-fw-info mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-fw-heading">No Connection Selected</h3>
              <p className="text-sm text-fw-bodyLight mt-1">
                Please select a connection from the Connections tab to view {activeView === 'logs' ? 'logs' : 'test results'}.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        <VerticalTabGroup
          tabs={tabs}
          activeTab={activeView}
          onChange={(tab) => setActiveView(tab as typeof activeView)}
        />

        <div className="flex-1 pl-6">
          {/* Selected Connection Indicator */}
          {selectedConnection && activeView !== 'list' && (
            <div className="mb-4 bg-fw-base border border-fw-secondary rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-fw-success mr-2" />
                <span className="text-sm text-fw-bodyLight">Selected Connection:</span>
                <span className="text-sm font-medium text-fw-heading ml-2">{selectedConnectionName}</span>
              </div>
              <button
                onClick={() => setActiveView('list')}
                className="text-sm text-fw-link hover:text-fw-linkHover"
              >
                Change Connection
              </button>
            </div>
          )}

          {activeView === 'list' && (
            <ConnectionList
              searchQuery={searchQuery}
              onSelect={handleSelectConnection}
              selectedConnection={selectedConnection}
              onUpdateConnection={handleUpdateConnection}
            />
          )}
          {activeView === 'logs' && <ConnectionLogs connectionId={selectedConnection} />}
          {activeView === 'test' && <ConnectionTest connectionId={selectedConnection} />}
        </div>
      </div>
    </div>
  );
}