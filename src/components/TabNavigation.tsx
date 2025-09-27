import React from 'react';
import { X, Plus, BarChart3 } from 'lucide-react';
import { AnalysisTab } from '../types';

interface TabNavigationProps {
  tabs: AnalysisTab[];
  activeTabId: string | null;
  onTabSwitch: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewComparison: () => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabSwitch,
  onTabClose,
  onNewComparison,
}) => {
  if (tabs.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`group flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all duration-200 cursor-pointer min-w-0 ${
                tab.id === activeTabId
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
              onClick={() => onTabSwitch(tab.id)}
            >
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{tab.label}</div>
                <div className="text-xs opacity-75 truncate">
                  {tab.businessType} • {tab.location.split(',')[0]}
                </div>
              </div>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                  aria-label={`Close ${tab.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={onNewComparison}
          className="flex items-center gap-2 px-4 py-2 ml-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex-shrink-0"
          aria-label="Start new comparison"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Compare</span>
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;