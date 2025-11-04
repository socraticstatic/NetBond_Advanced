import { useState } from 'react';
import {
  Layers, TrendingUp, AlertTriangle, Zap, Activity, Filter,
  Search, Download, Settings, Plus, Clock, ArrowUpDown, ExternalLink,
  Eye, BarChart3, Wifi, Server, CheckCircle2, XCircle, AlertCircle,
  Video, Cloud, Package, Video as VideoCamera, Code as CodeIcon,
  Film, MessageSquare, PieChart
} from 'lucide-react';
import { Button } from '../../common/Button';

interface NetworkApp {
  id: string;
  name: string;
  category: 'productivity' | 'communication' | 'cloud-storage' | 'streaming' | 'security' | 'development';
  status: 'active' | 'idle' | 'blocked';
  bandwidth: {
    current: number;
    average: number;
    peak: number;
    unit: 'Mbps' | 'Gbps';
  };
  users: number;
  latency: number;
  packets: {
    sent: number;
    received: number;
    lost: number;
  };
  anomalies: Array<{
    type: 'bandwidth-spike' | 'latency-increase' | 'packet-loss' | 'unusual-traffic';
    severity: 'low' | 'medium' | 'high';
    message: string;
    timestamp: string;
  }>;
}

const mockApps: NetworkApp[] = [
  {
    id: 'app-1',
    name: 'Microsoft Teams',
    category: 'communication',
    status: 'active',
    bandwidth: { current: 127.3, average: 98.5, peak: 245.8, unit: 'Mbps' },
    users: 847,
    latency: 23,
    packets: { sent: 2847293, received: 2845012, lost: 2281 },
    anomalies: []
  },
  {
    id: 'app-2',
    name: 'Salesforce',
    category: 'productivity',
    status: 'active',
    bandwidth: { current: 89.4, average: 72.1, peak: 156.3, unit: 'Mbps' },
    users: 523,
    latency: 18,
    packets: { sent: 1923847, received: 1922109, lost: 1738 },
    anomalies: [
      {
        type: 'bandwidth-spike',
        severity: 'medium',
        message: 'Bandwidth usage 40% above average',
        timestamp: '12 minutes ago'
      }
    ]
  },
  {
    id: 'app-3',
    name: 'AWS S3',
    category: 'cloud-storage',
    status: 'active',
    bandwidth: { current: 342.7, average: 289.3, peak: 512.9, unit: 'Mbps' },
    users: 1243,
    latency: 12,
    packets: { sent: 4829384, received: 4827021, lost: 2363 },
    anomalies: []
  },
  {
    id: 'app-4',
    name: 'Zoom',
    category: 'communication',
    status: 'active',
    bandwidth: { current: 176.2, average: 134.7, peak: 298.4, unit: 'Mbps' },
    users: 412,
    latency: 28,
    packets: { sent: 3247829, received: 3245891, lost: 1938 },
    anomalies: [
      {
        type: 'latency-increase',
        severity: 'low',
        message: 'Latency increased by 12ms',
        timestamp: '8 minutes ago'
      }
    ]
  },
  {
    id: 'app-5',
    name: 'GitHub',
    category: 'development',
    status: 'active',
    bandwidth: { current: 45.8, average: 38.2, peak: 87.3, unit: 'Mbps' },
    users: 298,
    latency: 15,
    packets: { sent: 892374, received: 891023, lost: 1351 },
    anomalies: []
  },
  {
    id: 'app-6',
    name: 'Netflix Corporate',
    category: 'streaming',
    status: 'blocked',
    bandwidth: { current: 0, average: 0, peak: 0, unit: 'Mbps' },
    users: 0,
    latency: 0,
    packets: { sent: 0, received: 0, lost: 0 },
    anomalies: [
      {
        type: 'unusual-traffic',
        severity: 'high',
        message: 'Blocked by corporate policy',
        timestamp: '2 hours ago'
      }
    ]
  },
  {
    id: 'app-7',
    name: 'Slack',
    category: 'communication',
    status: 'active',
    bandwidth: { current: 62.1, average: 54.3, peak: 98.7, unit: 'Mbps' },
    users: 892,
    latency: 19,
    packets: { sent: 1473829, received: 1472194, lost: 1635 },
    anomalies: []
  },
  {
    id: 'app-8',
    name: 'Tableau',
    category: 'productivity',
    status: 'idle',
    bandwidth: { current: 2.3, average: 18.9, peak: 45.2, unit: 'Mbps' },
    users: 12,
    latency: 21,
    packets: { sent: 129384, received: 128471, lost: 913 },
    anomalies: []
  }
];

const availableApps = [
  { id: 'avail-1', name: 'Datadog', category: 'monitoring', description: 'Network performance monitoring' },
  { id: 'avail-2', name: 'Splunk', category: 'analytics', description: 'Log analysis and SIEM' },
  { id: 'avail-3', name: 'Palo Alto', category: 'security', description: 'Next-gen firewall' },
  { id: 'avail-4', name: 'Cisco SD-WAN', category: 'networking', description: 'Software-defined WAN' }
];

export function AppsConfiguration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'bandwidth' | 'users' | 'latency' | 'name'>('bandwidth');
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const filteredApps = mockApps
    .filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || app.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
      const matchesAnomalies = !showAnomaliesOnly || app.anomalies.length > 0;
      return matchesSearch && matchesCategory && matchesStatus && matchesAnomalies;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'bandwidth': return b.bandwidth.current - a.bandwidth.current;
        case 'users': return b.users - a.users;
        case 'latency': return a.latency - b.latency;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const totalBandwidth = mockApps.reduce((sum, app) => sum + app.bandwidth.current, 0);
  const totalUsers = mockApps.reduce((sum, app) => sum + app.users, 0);
  const activeApps = mockApps.filter(app => app.status === 'active').length;
  const totalAnomalies = mockApps.reduce((sum, app) => sum + app.anomalies.length, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      productivity: 'bg-blue-100 text-blue-800',
      communication: 'bg-green-100 text-green-800',
      'cloud-storage': 'bg-purple-100 text-purple-800',
      streaming: 'bg-red-100 text-red-800',
      security: 'bg-orange-100 text-orange-800',
      development: 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'idle': return <Clock className="h-4 w-4 text-gray-400" />;
      case 'blocked': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAppIcon = (appName: string) => {
    const iconMap: Record<string, any> = {
      'Microsoft Teams': Video,
      'Salesforce': Cloud,
      'AWS S3': Package,
      'Zoom': VideoCamera,
      'GitHub': CodeIcon,
      'Netflix Corporate': Film,
      'Slack': MessageSquare,
      'Tableau': PieChart
    };
    const IconComponent = iconMap[appName] || Server;
    return <IconComponent className="h-5 w-5 text-gray-600" />;
  };

  const getAvailableAppIcon = (appName: string) => {
    const iconMap: Record<string, any> = {
      'Datadog': BarChart3,
      'Splunk': Search,
      'Palo Alto': Shield,
      'Cisco SD-WAN': Wifi
    };
    const IconComponent = iconMap[appName] || Server;
    return <IconComponent className="h-6 w-6 text-gray-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Network Applications</h2>
          <p className="mt-1 text-sm text-gray-600">
            Monitor and manage applications running on your network connection
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
          Add Application
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-900">Total Bandwidth</p>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{totalBandwidth.toFixed(1)} Mbps</p>
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-blue-600 mr-1" />
            <span className="text-blue-700">↑ 8.3% from last hour</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-900">Active Apps</p>
            <Layers className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{activeApps} / {mockApps.length}</p>
          <div className="mt-2 flex items-center text-xs">
            <CheckCircle2 className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-700">All systems operational</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-900">Active Users</p>
            <Server className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{totalUsers.toLocaleString()}</p>
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-purple-600 mr-1" />
            <span className="text-purple-700">↑ 142 since last check</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-900">Anomalies</p>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-900">{totalAnomalies}</p>
          <div className="mt-2 flex items-center text-xs">
            <AlertCircle className="h-3 w-3 text-orange-600 mr-1" />
            <span className="text-orange-700">Requires attention</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="productivity">Productivity</option>
            <option value="communication">Communication</option>
            <option value="cloud-storage">Cloud Storage</option>
            <option value="streaming">Streaming</option>
            <option value="security">Security</option>
            <option value="development">Development</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="blocked">Blocked</option>
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAnomaliesOnly(!showAnomaliesOnly)}
              className={`flex-1 px-3 py-2 border rounded-md transition-colors ${
                showAnomaliesOnly
                  ? 'bg-orange-100 border-orange-300 text-orange-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Anomalies
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex space-x-2">
            {['bandwidth', 'users', 'latency', 'name'].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort as any)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  sortBy === sort
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bandwidth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Packet Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anomalies
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApps.map((app) => {
                const packetLossPercent = ((app.packets.lost / app.packets.sent) * 100).toFixed(3);
                return (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedApp(app.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg mr-3">
                          {getAppIcon(app.name)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{app.name}</div>
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(app.category)}`}>
                            {app.category.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(app.status)}
                        <span className="text-sm text-gray-900 capitalize">{app.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {app.bandwidth.current.toFixed(1)} {app.bandwidth.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          avg: {app.bandwidth.average.toFixed(1)} | peak: {app.bandwidth.peak.toFixed(1)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.users.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Wifi className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{app.latency}ms</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className={`font-medium ${parseFloat(packetLossPercent) > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
                          {packetLossPercent}%
                        </span>
                        <div className="text-xs text-gray-500">
                          {app.packets.lost.toLocaleString()} lost
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {app.anomalies.length > 0 ? (
                        <div className="space-y-1">
                          {app.anomalies.slice(0, 1).map((anomaly, idx) => (
                            <div key={idx} className={`text-xs px-2 py-1 rounded border ${getSeverityColor(anomaly.severity)}`}>
                              <div className="font-medium">{anomaly.type.replace('-', ' ')}</div>
                              <div>{anomaly.message}</div>
                            </div>
                          ))}
                          {app.anomalies.length > 1 && (
                            <div className="text-xs text-gray-500">+{app.anomalies.length - 1} more</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Settings"
                        >
                          <Settings className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Apps to Deploy */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Available Applications</h3>
            <p className="text-sm text-gray-600">Deploy additional apps to your network</p>
          </div>
          <Button variant="secondary" icon={<ExternalLink className="h-4 w-4" />}>
            Browse Marketplace
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableApps.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="p-3 bg-gray-100 rounded-lg inline-flex mb-3">
                {getAvailableAppIcon(app.name)}
              </div>
              <h4 className="font-semibold text-gray-900">{app.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{app.description}</p>
              <Button variant="secondary" size="sm" className="w-full mt-3" icon={<Plus className="h-4 w-4" />}>
                Deploy
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Export and Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredApps.length} of {mockApps.length} applications
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" icon={<Download className="h-4 w-4" />}>
            Export Report
          </Button>
          <Button variant="secondary" icon={<BarChart3 className="h-4 w-4" />}>
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
