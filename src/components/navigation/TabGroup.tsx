import { ReactNode } from 'react';
import { TabItem } from '../../types/navigation';

interface TabGroupProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabGroup({ tabs, activeTab, onChange, className = '' }: TabGroupProps) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`
              flex items-center whitespace-nowrap pt-1 pb-3 px-1 border-b-2 font-medium text-sm no-rounded
              ${tab.disabled
                ? 'border-transparent text-gray-300 cursor-not-allowed'
                : activeTab === tab.id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                activeTab === tab.id ? 'bg-brand-lightBlue text-brand-blue' : 'bg-gray-100 text-gray-900'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}