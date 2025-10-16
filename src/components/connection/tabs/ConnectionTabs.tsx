import { ReactNode } from 'react';
import {
  Activity, Shield, History, Terminal, Settings,
  Network, Router, BarChart2, Users, DollarSign, Code
} from 'lucide-react';

export type ConnectionTabType = 
  | 'overview' 
  | 'network' 
  | 'security' 
  | 'routing' 
  | 'qos' 
  | 'access' 
  | 'versions'
  | 'billing'
  | 'logs' 
  | 'test'
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
  { id: 'network', label: 'Network', icon: <Network className="h-5 w-5 mr-2" /> },
  { id: 'routing', label: 'Routing', icon: <Router className="h-5 w-5 mr-2" /> },
  { id: 'qos', label: 'QoS', icon: <BarChart2 className="h-5 w-5 mr-2" />, disabled: true },
  { id: 'security', label: 'Security', icon: <Shield className="h-5 w-5 mr-2" />, disabled: true },
  { id: 'api', label: 'API', icon: <Code className="h-5 w-5 mr-2" />, disabled: true },
  { id: 'access', label: 'Access', icon: <Users className="h-5 w-5 mr-2" /> },
  { id: 'billing', label: 'Billing', icon: <DollarSign className="h-5 w-5 mr-2" /> },
  { id: 'versions', label: 'Versions', icon: <History className="h-5 w-5 mr-2" /> },
  { id: 'logs', label: 'Logs', icon: <Terminal className="h-5 w-5 mr-2" /> },
  { id: 'test', label: 'Test', icon: <Settings className="h-5 w-5 mr-2" />, disabled: true }
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