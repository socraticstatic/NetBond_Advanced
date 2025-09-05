import { User, Network, CreditCard, Activity, Clock } from 'lucide-react';
import { Group } from '../../../types/group';

interface GroupCardMetricsProps {
  group: Group;
}

export function GroupCardMetrics({ group }: GroupCardMetricsProps) {
  // Calculate performance score for visualization (0-100)
  const getPerformanceScore = () => {
    if (!group.performance) return 75; // Default score if no data
    
    // Convert uptime string to number (e.g. "99.95%" -> 99.95)
    const uptime = group.performance.aggregatedMetrics.averageUptime;
    if (typeof uptime === 'string') {
      const match = uptime.match(/(\d+\.\d+)/);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    }
    
    return 75; // Fallback
  };

  return (
    <div className="space-y-5">
      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="relative group">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 group-hover:border-blue-200 group-hover:bg-blue-50/30">
            <div className="p-2 bg-blue-100 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-base font-bold text-gray-900">{group.userIds.length}</div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 group-hover:border-purple-200 group-hover:bg-purple-50/30">
            <div className="p-2 bg-purple-100 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
              <Network className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-base font-bold text-gray-900">{group.connectionIds.length}</div>
            <div className="text-xs text-gray-500">Connections</div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 group-hover:border-green-200 group-hover:bg-green-50/30">
            <div className="p-2 bg-green-100 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-base font-bold text-gray-900">
              ${group.billing?.monthlyRate ? group.billing.monthlyRate.toFixed(0) : 0}
            </div>
            <div className="text-xs text-gray-500">Monthly</div>
          </div>
        </div>
      </div>
      
      {/* Performance Meter */}
      {group.performance && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-amber-500 mr-1.5" />
              <span className="text-sm font-medium text-gray-700">Performance</span>
            </div>
            <span className="text-xs font-medium text-gray-600">{getPerformanceScore().toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 ease-out"
              style={{ width: `${getPerformanceScore()}%` }}
            />
          </div>
          
          {/* Performance Highlights */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center text-xs">
              <Activity className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-gray-500">Uptime: </span>
              <span className="ml-1 font-medium text-gray-700">{group.performance?.aggregatedMetrics.averageUptime || "N/A"}</span>
            </div>
            <div className="flex items-center text-xs">
              <Clock className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-gray-500">Latency: </span>
              <span className="ml-1 font-medium text-gray-700">{group.performance?.aggregatedMetrics.averageLatency || "N/A"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}