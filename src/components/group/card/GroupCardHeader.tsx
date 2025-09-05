import { ReactNode } from 'react';
import { Layers } from 'lucide-react';
import { Group } from '../../../types/group';

interface GroupCardHeaderProps {
  group: Group;
  children?: ReactNode;
}

export function GroupCardHeader({ group, children }: GroupCardHeaderProps) {
  // Get group type color
  const getGroupTypeColor = () => {
    switch (group.type) {
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'department':
        return 'bg-purple-100 text-purple-800';
      case 'project':
        return 'bg-green-100 text-green-800';
      case 'team':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHeaderGradient = () => {
    switch (group.type) {
      case 'business':
        return 'from-blue-500 to-blue-600';
      case 'department':
        return 'from-purple-500 to-purple-600';
      case 'project':
        return 'from-green-500 to-green-600';
      case 'team':
        return 'from-amber-500 to-amber-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <>
      {/* Decorative Header with Gradient */}
      <div className={`h-3 bg-gradient-to-r ${getHeaderGradient()}`}></div>
      
      {/* Header Section */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getHeaderGradient()} mr-4 flex-shrink-0 shadow-md`}>
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate">{group.name}</h3>
              <p className="text-sm text-gray-500 truncate">{group.description}</p>
            </div>
          </div>
          
          {/* Action buttons passed as children */}
          {children}
        </div>

        {/* Status Badges */}
        <div className="flex items-center justify-between mt-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
            group.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 
            group.status === 'inactive' ? 'bg-gray-100 text-gray-800 border-gray-200' : 
            'bg-red-100 text-red-800 border-red-200'
          }`}>
            {group.status === 'active' && <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>}
            {group.status === 'inactive' && <span className="h-2 w-2 bg-gray-500 rounded-full mr-1.5"></span>}
            {group.status === 'suspended' && <span className="h-2 w-2 bg-red-500 rounded-full mr-1.5"></span>}
            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
          </span>
          
          <div className="flex items-center space-x-2">
            {/* Group Type Badge */}
            <span className={`px-2.5 py-1 ${getGroupTypeColor()} rounded-full text-xs font-medium capitalize`}>
              {group.type}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}