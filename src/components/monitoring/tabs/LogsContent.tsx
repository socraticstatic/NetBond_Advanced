import { useState } from 'react';
import { Search, Filter, Download, X, Activity, Shield, Settings, Globe, Calendar, Clock } from 'lucide-react';
import { Button } from '../../common/Button';

interface LogsContentProps {
  selectedConnection: string;
  connections: any[];
}

function LogsContent({ selectedConnection, connections }: LogsContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [showFilters, setShowFilters] = useState(false);

  // Sample log data
  const logs = [
    {
      id: '1',
      timestamp: '2024-03-11 15:30',
      type: 'system',
      severity: 'info',
      message: 'Connection status updated to Active',
      source: 'Connection Manager',
      user: 'system',
      connectionId: 'conn-1',
      metadata: {
        status: 'Active',
        previousStatus: 'Inactive'
      }
    },
    {
      id: '2',
      timestamp: '2024-03-11 15:25',
      type: 'security',
      severity: 'warning',
      message: 'Multiple failed authentication attempts detected',
      source: 'Security Monitor',
      user: 'system',
      connectionId: 'conn-2',
      metadata: {
        attempts: 3,
        ipAddress: '192.168.1.100'
      }
    },
    {
      id: '3',
      timestamp: '2024-03-11 15:15',
      type: 'user',
      severity: 'info',
      message: 'Modified connection bandwidth settings',
      source: 'User Action',
      user: 'sarah.chen@example.com',
      connectionId: 'conn-1',
      metadata: {
        oldValue: '1 Gbps',
        newValue: '10 Gbps'
      }
    },
    {
      id: '4',
      timestamp: '2024-03-11 15:00',
      type: 'performance',
      severity: 'error',
      message: 'High latency detected on connection',
      source: 'Performance Monitor',
      user: 'system',
      connectionId: 'conn-3',
      metadata: {
        latency: '150ms',
        threshold: '100ms'
      }
    }
  ];

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    // Filter by connection
    if (selectedConnection !== 'all' && log.connectionId !== selectedConnection) {
      return false;
    }

    // Filter by type
    if (selectedTypes.length > 0 && !selectedTypes.includes(log.type)) {
      return false;
    }

    // Filter by severity
    if (selectedSeverities.length > 0 && !selectedSeverities.includes(log.severity)) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const searchTerms = searchQuery.toLowerCase().split(' ');
      const searchableText = [
        log.message,
        log.source,
        log.user,
        log.type,
        log.severity
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    }

    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Settings className="h-4 w-4 text-fw-bodyLight" />;
      case 'security':
        return <Shield className="h-4 w-4 text-fw-error" />;
      case 'user':
        return <Activity className="h-4 w-4 text-brand-blue" />;
      case 'performance':
        return <Activity className="h-4 w-4 text-fw-purple" />;
      default:
        return <Globe className="h-4 w-4 text-fw-bodyLight" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 text-fw-error';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-fw-accent text-fw-link';
      default:
        return 'bg-fw-neutral text-fw-body';
    }
  };

  return (
    <div className="bg-fw-base rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-fw-secondary flex flex-wrap gap-4 items-center min-w-[1000px]">
        <div className="flex-1 relative min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fw-bodyLight h-5 w-5" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-9 w-full border border-fw-secondary rounded-lg text-figma-base focus:outline-none focus:ring-2 focus:ring-fw-active focus:border-fw-active"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-fw-bodyLight hover:text-fw-body"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="ghost"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>

          <Button
            variant="ghost"
            icon={Download}
            onClick={() => {
              // Export logic here
              window.addToast({
                type: 'success',
                title: 'Logs Exported',
                message: 'Log data has been exported successfully',
                duration: 3000
              });
            }}
          >
            Export
          </Button>
        </div>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-fw-wash border-b border-fw-secondary overflow-x-auto">
          <div className="min-w-[1000px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-figma-base font-medium text-fw-body mb-2">Log Types</h3>
              <div className="space-y-2">
                {['system', 'security', 'user', 'performance'].map(type => (
                  <label key={type} className="flex items-center">
                    <input 
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => {
                        if (selectedTypes.includes(type)) {
                          setSelectedTypes(selectedTypes.filter(t => t !== type));
                        } else {
                          setSelectedTypes([...selectedTypes, type]);
                        }
                      }}
                      className="rounded border-fw-secondary text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="ml-2 text-figma-base text-fw-bodyLight capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-figma-base font-medium text-fw-body mb-2">Severity</h3>
              <div className="space-y-2">
                {['info', 'warning', 'error'].map(severity => (
                  <label key={severity} className="flex items-center">
                    <input 
                      type="checkbox"
                      checked={selectedSeverities.includes(severity)}
                      onChange={() => {
                        if (selectedSeverities.includes(severity)) {
                          setSelectedSeverities(selectedSeverities.filter(s => s !== severity));
                        } else {
                          setSelectedSeverities([...selectedSeverities, severity]);
                        }
                      }}
                      className="rounded border-fw-secondary text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="ml-2 text-figma-base text-fw-bodyLight capitalize">{severity}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-figma-base font-medium text-fw-body mb-2">Time Range</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full rounded-lg border-fw-secondary shadow-sm focus:border-brand-blue focus:ring-brand-blue"
              >
                <option value="1h">Last Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-figma-base font-medium text-fw-body mb-2">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedSeverities([]);
                    setTimeRange('24h');
                  }}
                  className="w-full py-2 text-figma-base text-fw-bodyLight hover:text-fw-body"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => {
                    // Apply custom filter preset
                  }}
                  className="w-full py-2 text-figma-base text-brand-blue hover:text-brand-darkBlue"
                >
                  Save as Preset
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
      
      {/* Active Filters */}
      {(selectedTypes.length > 0 || selectedSeverities.length > 0 || searchQuery) && (
        <div className="p-3 border-b border-fw-secondary bg-fw-wash overflow-x-auto">
          <div className="flex flex-wrap gap-2 min-w-[1000px]">
          {selectedTypes.map(type => (
            <span
              key={type}
              className="inline-flex items-center px-2 py-1 rounded-full text-figma-sm font-medium bg-brand-lightBlue text-brand-blue"
            >
              Type: {type}
              <button
                onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))}
                className="ml-1 hover:text-brand-darkBlue"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedSeverities.map(severity => (
            <span
              key={severity}
              className={`inline-flex items-center px-2 py-1 rounded-full text-figma-sm font-medium ${
                severity === 'error' ? 'bg-red-50 text-fw-error' :
                severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-fw-accent text-fw-link'
              }`}
            >
              Severity: {severity}
              <button
                onClick={() => setSelectedSeverities(selectedSeverities.filter(s => s !== severity))}
                className="ml-1 hover:opacity-75"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {searchQuery && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-figma-sm font-medium bg-fw-neutral text-fw-body">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="ml-1 hover:text-fw-heading"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSelectedTypes([]);
              setSelectedSeverities([]);
              setSearchQuery('');
            }}
            className="text-figma-sm text-fw-bodyLight hover:text-fw-body ml-2"
          >
            Clear all
          </button>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-fw-secondary min-w-[1000px]">
          <thead className="bg-fw-wash">
            <tr>
              <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                Time
              </th>
              <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                Type
              </th>
              <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                Severity
              </th>
              <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                Message
              </th>
              <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                Source
              </th>
              <th scope="col" className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading">
                User
              </th>
            </tr>
          </thead>
          <tbody className="bg-fw-base divide-y divide-fw-secondary">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-fw-bodyLight">
                  No logs match the current filters
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-fw-wash transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-[14px] text-fw-body">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-fw-bodyLight mr-2" />
                      <span className="font-mono">{log.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(log.type)}
                      <span className="ml-2 text-[14px] text-fw-body capitalize">{log.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-figma-sm font-medium ${
                      getSeverityColor(log.severity)
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] text-fw-heading">{log.message}</div>
                    {log.metadata && (
                      <div className="mt-1 text-figma-sm text-fw-bodyLight">
                        {Object.entries(log.metadata).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[14px] text-fw-body">
                    {log.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[14px] text-fw-body">
                    {log.user}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogsContent;