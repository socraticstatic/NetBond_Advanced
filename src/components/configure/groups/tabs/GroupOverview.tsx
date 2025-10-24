import { Activity, Calendar, Users, Network, Clock, Shield, Layers, ArrowRight } from 'lucide-react';
import { Group } from '../../../../types/group';
import { Connection } from '../../../../types';
import { User } from '../../../../types';
import { GroupConnectionSummaryWidget } from '../../../group/widgets/GroupConnectionSummaryWidget';
import { GroupPerformanceWidget } from '../../../group/widgets/GroupPerformanceWidget';
import { Button } from '../../../common/Button';
import { useNavigate } from 'react-router-dom';

interface GroupOverviewProps {
  group: Group;
  connections: Connection[];
  users: User[];
}

export function GroupOverview({ group, connections, users }: GroupOverviewProps) {
  const navigate = useNavigate();
  
  // Network resource metrics - These would be calculated from actual data
  const networkMetrics = {
    totalVLANs: 12,
    activeVLANs: 10,
    totalVNFs: 8,
    activeVNFs: 6,
    vlansByType: {
      data: 5,
      voice: 2,
      management: 3,
      storage: 1,
      guest: 1
    },
    vnfsByType: {
      firewall: 3,
      router: 2,
      sdwan: 2,
      vnat: 1
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GroupConnectionSummaryWidget group={group} connections={connections} />
        <GroupPerformanceWidget group={group} connections={connections} />
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Group Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">Members</h4>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">{group.userIds.length}</div>
              <div className="text-sm text-gray-500">Total users</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => navigate(`/groups/${group.id}/members`)}
                className="text-sm text-brand-blue hover:text-brand-darkBlue flex items-center"
              >
                View members
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Network className="h-5 w-5 text-purple-500" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">Connections</h4>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">{group.connectionIds.length}</div>
              <div className="text-sm text-gray-500">Network links</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => navigate(`/groups/${group.id}/connections`)}
                className="text-sm text-brand-blue hover:text-brand-darkBlue flex items-center"
              >
                View connections
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Layers className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">VLANs</h4>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">{networkMetrics.totalVLANs}</div>
              <div className="text-sm text-green-500">{networkMetrics.activeVLANs} active</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => navigate(`/groups/${group.id}/network`)}
                className="text-sm text-brand-blue hover:text-brand-darkBlue flex items-center"
              >
                View VLANs
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Shield className="h-5 w-5 text-indigo-500" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">VNFs</h4>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">{networkMetrics.totalVNFs}</div>
              <div className="text-sm text-green-500">{networkMetrics.activeVNFs} active</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => navigate(`/groups/${group.id}/network`)}
                className="text-sm text-brand-blue hover:text-brand-darkBlue flex items-center"
              >
                View VNFs
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Network Resources Breakdown */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Network Resources Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Layers className="h-5 w-5 text-green-500 mr-2" />
                <h4 className="text-base font-medium text-gray-900">VLANs by Type</h4>
              </div>
              <div>
                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  {networkMetrics.totalVLANs} total
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(networkMetrics.vlansByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${
                      type === 'data' ? 'bg-blue-500' :
                      type === 'voice' ? 'bg-purple-500' :
                      type === 'management' ? 'bg-green-500' :
                      type === 'storage' ? 'bg-amber-500' :
                      'bg-gray-500'
                    } mr-2`} />
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{count}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/groups/${group.id}/network`)}
              >
                View All VLANs
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-indigo-500 mr-2" />
                <h4 className="text-base font-medium text-gray-900">VNFs by Type</h4>
              </div>
              <div>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  {networkMetrics.totalVNFs} total
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(networkMetrics.vnfsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${
                      type === 'firewall' ? 'bg-indigo-500' :
                      type === 'sdwan' ? 'bg-purple-500' :
                      type === 'router' ? 'bg-blue-500' :
                      type === 'vnat' ? 'bg-green-500' :
                      'bg-gray-500'
                    } mr-2`} />
                    <span className="text-sm text-gray-700 capitalize">
                      {type === 'sdwan' ? 'SD-WAN' : type}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{count}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/groups/${group.id}/network`)}
              >
                View All VNFs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}