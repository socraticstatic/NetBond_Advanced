import { ReactNode } from 'react';
import {
  Activity, Shield, History, Terminal,
  Network, Layers, Users, DollarSign, Code, FileText
} from 'lucide-react';
import { AttIcon } from '../../icons/AttIcon';

export type ConnectionTabType =
  | 'overview'
  | 'resiliency'
  | 'cloudrouters'
  | 'links'
  | 'vnfs'
  | 'policies'
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
  { id: 'overview', label: 'Overview', icon: <Activity className="h-5 w-5" /> },
  { id: 'resiliency', label: 'Resiliency', icon: <Shield className="h-5 w-5" /> },
  { id: 'cloudrouters', label: 'Cloud Routers', icon: <AttIcon name="cloudRouter" className="h-6 w-6" /> },
  { id: 'links', label: 'Links', icon: <Network className="h-5 w-5" /> },
  { id: 'vnfs', label: 'VNFs', icon: <Shield className="h-5 w-5" /> },
  { id: 'policies', label: 'Policies', icon: <FileText className="h-5 w-5" /> },
  { id: 'apps', label: 'Apps', icon: <Layers className="h-5 w-5" /> },
  { id: 'api', label: 'API', icon: <Code className="h-5 w-5" /> },
  { id: 'access', label: 'Access', icon: <Users className="h-5 w-5" /> },
  { id: 'billing', label: 'Billing', icon: <DollarSign className="h-5 w-5" /> },
  { id: 'versions', label: 'Versions', icon: <History className="h-5 w-5" /> },
  { id: 'logs', label: 'Logs', icon: <Terminal className="h-5 w-5" /> }
];

export function ConnectionTabs({ activeTab, onTabChange }: ConnectionTabsProps) {
  return (
    <div className="border-b border-fw-secondary">
      <nav className="-mb-px flex items-center gap-0 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              flex items-center gap-2 whitespace-nowrap py-3 px-4 border-b-2 text-figma-base font-medium no-rounded tracking-[-0.03em] transition-colors
              ${tab.disabled
                ? 'border-transparent text-fw-disabled cursor-not-allowed'
                : activeTab === tab.id
                  ? 'border-fw-active text-fw-link'
                  : 'border-transparent text-fw-heading hover:text-fw-body'
              }
            `}
          >
            <span className={activeTab === tab.id ? 'text-fw-link' : 'text-fw-heading'}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}