import { Activity, Wifi, Signal, Clock, Network, Shield, Globe, Server, TrendingUp, ArrowUpDown, Group as UserGroup } from 'lucide-react';
import { Connection } from '../../../types';
import { ConnectionVisualization } from '../ConnectionVisualization';

interface ConnectionOverviewProps {
  connection: Connection;
}

export function ConnectionOverview({ connection }: ConnectionOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Network Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-visible">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Network Topology</h3>
          <p className="text-sm text-gray-500">Visual representation of your network connection</p>
        </div>
        <div className="h-[400px] p-6 relative">
          <ConnectionVisualization connection={connection} />
        </div>
      </div>

      {/* Connection Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Network className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Connection Information</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                connection.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {connection.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Type</span>
              <span className="text-sm font-medium text-gray-900">{connection.type}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Bandwidth</span>
              <span className="text-sm font-medium text-gray-900">{connection.bandwidth}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Location</span>
              <span className="text-sm font-medium text-gray-900">{connection.location}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Cloud Provider</span>
              <span className="text-sm font-medium text-gray-900">{connection.provider || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Security Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Security Overview</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(connection.security || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  value === true ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Security features protect your data during transit through encryption, firewall rules, and DDoS protection mechanisms.
            </p>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Latency</span>
                <span className="text-lg font-medium text-gray-900">{connection.performance?.latency || 'N/A'}</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Packet Loss</span>
                <span className="text-lg font-medium text-gray-900">{connection.performance?.packetLoss || 'N/A'}</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Uptime</span>
                <span className="text-lg font-medium text-gray-900">{connection.performance?.uptime || 'N/A'}</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Bandwidth Utilization</span>
                <span className="text-lg font-medium text-gray-900">{connection.performance?.bandwidthUtilization || 0}%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Performance metrics are updated every 5 minutes. These metrics help you monitor the health and efficiency of your connection.
            </p>
          </div>
        </div>
        
        {/* Connection Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Server className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Connection Features</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(connection.features || {}).map(([key, value]) => (
              <div key={key} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Server className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Connection features define capabilities like redundancy, load balancing, and auto-scaling that enhance your network's resilience and performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}