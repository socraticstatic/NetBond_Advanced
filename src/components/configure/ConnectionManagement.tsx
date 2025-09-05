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

  const tabs: TabItem[] = [
    { id: 'list', label: 'Connections', icon: <Activity className="h-5 w-5 mr-2" /> },
    { id: 'logs', label: 'Logs', icon: <History className="h-5 w-5 mr-2" /> },
    { id: 'test', label: 'Test', icon: <Terminal className="h-5 w-5 mr-2" /> }
  ];

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
      <div className="flex">
        <VerticalTabGroup
          tabs={tabs}
          activeTab={activeView}
          onChange={(tab) => setActiveView(tab as typeof activeView)}
        />

        <div className="flex-1 pl-6">
          {activeView === 'list' && (
            <ConnectionList
              searchQuery={searchQuery}
              onSelect={setSelectedConnection}
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