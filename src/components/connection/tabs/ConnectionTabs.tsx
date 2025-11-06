import { ReactNode } from 'react';
import {
  Activity, Shield, History, Terminal,
  Network, GitBranch, Layers, Users, DollarSign, Code
} from 'lucide-react';

export type ConnectionTabType =
  | 'overview'
  | 'cloudrouters'
  | 'links'
  | 'vnfs'
  | 'apps'
  | 'access'
  | 'versions'
  | 'billing'
  | 'logs'
  | 'api';

interface Tab {
  id: ConnectionTabType;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
}

interface ConnectionTabsProps {
  activeTab: ConnectionTabType;
  onTabChange: (tab: ConnectionTabType) => void;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <Activity className="h-5 w-5 mr-2" /> },
  { id: 'cloudrouters', label: 'Cloud Routers', icon: <GitBranch className="h-5 w-5 mr-2" /> },
  { id: 'links', label: 'Links', icon: <Network className="h-5 w-5 mr-2" /> },
  { id: 'vnfs', label: 'VNF Functions', icon: <Shield className="h-5 w-5 mr-2" /> },
  { id: 'apps', label: 'Apps', icon: <Layers className="h-5 w-5 mr-2" /> },
  { id: 'api', label: 'API', icon: <Code className="h-5 w-5 mr-2" /> },
  { id: 'access', label: 'Access', icon: <Users className="h-5 w-5 mr-2" /> },
  { id: 'billing', label: 'Billing', icon: <DollarSign className="h-5 w-5 mr-2" /> },
  { id: 'versions', label: 'Versions', icon: <History className="h-5 w-5 mr-2" /> },
  { id: 'logs', label: 'Logs', icon: <Terminal className="h-5 w-5 mr-2" /> }
];

export function ConnectionTabs({ activeTab, onTabChange }: ConnectionTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex items-center space-x-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm no-rounded
              ${tab.disabled 
                ? 'border-transparent text-gray-300 cursor-not-allowed'
                : activeTab === tab.id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}