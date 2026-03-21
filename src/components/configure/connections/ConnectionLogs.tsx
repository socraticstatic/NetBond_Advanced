import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Info, Search, Filter, ChevronDown, ChevronUp, Download, MoreVertical, X } from 'lucide-react';

interface Log {
  id: string;
  logId: number; // Added unique numeric ID
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'security' | 'performance' | 'user';
  message: string;
  details?: string;
  source: string;
  user?: string;
}

interface ConnectionLogsProps {
  connectionId: string | null;
}

export function ConnectionLogs({ connectionId }: ConnectionLogsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Log>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Sample logs data with unique numeric IDs
  const logs: Log[] = [
    {
      id: '1',
      logId: 10001,
      timestamp: '2024-03-10T15:30:00Z',
      type: 'error',
      category: 'system',
      message: 'Connection timeout detected',
      details: 'Failed to establish connection after 30s',
      source: 'System Monitor',
      user: 'system'
    },
    {
      id: '2',
      logId: 10002,
      timestamp: '2024-03-10T15:29:00Z',
      type: 'warning',
      category: 'performance',
      message: 'High latency detected',
      details: 'Latency spike to 150ms',
      source: 'Performance Monitor',
      user: 'system'
    },
    {
      id: '3',
      logId: 10003,
      timestamp: '2024-03-10T15:28:00Z',
      type: 'success',
      category: 'system',
      message: 'Connection established',
      details: 'Successfully established connection',
      source: 'Connection Manager',
      user: 'system'
    },
    {
      id: '4',
      logId: 10004,
      timestamp: '2024-03-10T15:27:00Z',
      type: 'info',
      category: 'security',
      message: 'Security scan completed',
      details: 'No vulnerabilities detected',
      source: 'Security Scanner',
      user: 'system'
    },
    {
      id: '5',
      logId: 10005,
      timestamp: '2024-03-10T15:26:00Z',
      type: 'warning',
      category: 'security',
      message: 'Multiple failed login attempts',
      details: '3 failed attempts from IP 192.168.1.100',
      source: 'Security Monitor',
      user: 'system'
    }
  ];

  const handleSort = (field: keyof Log) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => {
        // Type filter
        if (selectedTypes.length > 0 && !selectedTypes.includes(log.type)) {
          return false;
        }

        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(log.category)) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const searchTerms = searchQuery.toLowerCase().split(' ');
          const searchableText = [
            log.logId.toString(),
            log.message,
            log.details,
            log.source,
            log.type,
            log.category
          ].filter(Boolean).join(' ').toLowerCase();

          return searchTerms.every(term => searchableText.includes(term));
        }

        return true;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;

        if (sortField === 'timestamp') {
          return (new Date(bValue).getTime() - new Date(aValue).getTime()) * modifier;
        }

        if (sortField === 'logId') {
          return (a.logId - b.logId) * modifier;
        }

        return String(aValue).localeCompare(String(bValue)) * modifier;
      });
  }, [logs, searchQuery, selectedTypes, selectedCategories, sortField, sortDirection]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-fw-error" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-fw-success" />;
      default:
        return <Info className="h-5 w-5 text-fw-link" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 text-fw-error';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-50 text-fw-success';
      default:
        return 'bg-fw-accent text-fw-link';
    }
  };

  if (!connectionId) {
    return (
      <div className="text-center py-12 text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em]">
        Select a connection to view logs
      </div>
    );
  }

  const logTypes = ['error', 'warning', 'info', 'success'];
  const categories = ['system', 'security', 'performance', 'user'];

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-fw-base p-4 rounded-2xl border border-fw-secondary">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fw-bodyLight h-5 w-5" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-9 border border-fw-primary rounded-lg text-figma-base font-medium tracking-[-0.03em] text-fw-heading placeholder:text-fw-bodyLight focus:ring-2 focus:ring-fw-active focus:border-fw-active"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 h-9 text-figma-base font-medium tracking-[-0.03em] text-fw-body bg-fw-base border border-fw-secondary rounded-full hover:bg-fw-wash transition-colors"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-fw-secondary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Log Types */}
              <div>
                <h4 className="text-figma-base font-bold text-fw-heading tracking-[-0.03em] mb-2">Log Types</h4>
                <div className="space-y-2">
                  {logTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeToggle(type)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-figma-base ${
                        selectedTypes.includes(type)
                          ? getTypeStyles(type)
                          : 'text-fw-body hover:bg-fw-wash'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-figma-base font-bold text-fw-heading tracking-[-0.03em] mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-figma-base ${
                        selectedCategories.includes(category)
                          ? 'bg-fw-accent text-fw-link'
                          : 'text-fw-body hover:bg-fw-wash'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedTypes.length > 0 || selectedCategories.length > 0 || searchQuery) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-figma-sm text-fw-bodyLight">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map(type => (
                    <span
                      key={type}
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-figma-sm font-medium ${getTypeStyles(type)}`}
                    >
                      {type}
                      <button
                        onClick={() => handleTypeToggle(type)}
                        className="ml-2 hover:text-fw-linkHover"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  {selectedCategories.map(category => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-figma-sm font-medium bg-fw-accent text-fw-link"
                    >
                      {category}
                      <button
                        onClick={() => handleCategoryToggle(category)}
                        className="ml-2 hover:text-fw-linkHover"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-figma-sm font-medium bg-fw-neutral text-fw-body">
                      "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-2 hover:text-fw-heading"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-fw-secondary">
            <thead className="bg-fw-wash">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em] h-12 cursor-pointer"
                  onClick={() => handleSort('logId')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Log ID</span>
                    {sortField === 'logId' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em] h-12 cursor-pointer"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Timestamp</span>
                    {sortField === 'timestamp' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em] h-12 cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    {sortField === 'type' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em] h-12 cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em] h-12"
                >
                  Message
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em] h-12 cursor-pointer"
                  onClick={() => handleSort('source')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Source</span>
                    {sortField === 'source' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-fw-base divide-y divide-fw-secondary">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-fw-bodyLight">
                    No logs match the current filters
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-fw-wash">
                    <td className="px-6 py-4 whitespace-nowrap text-figma-base font-medium text-fw-heading tracking-[-0.03em] h-12">
                      #{log.logId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-figma-base font-medium text-fw-body tracking-[-0.03em] h-12">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(log.type)}
                        <span className={`ml-2 px-3 py-0.5 inline-flex text-tag-sm font-medium tracking-[0.04em] rounded-lg border ${getTypeStyles(log.type)}`}>
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-tag-sm font-medium tracking-[0.04em] bg-fw-neutral text-fw-body rounded-lg">
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 h-12">
                      <div className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{log.message}</div>
                      {log.details && (
                        <div className="text-figma-sm font-medium text-fw-bodyLight tracking-[-0.03em] mt-1">{log.details}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-figma-base font-medium text-fw-body tracking-[-0.03em] h-12">
                      {log.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-figma-base font-medium">
                      <button className="text-fw-bodyLight hover:text-fw-body">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
