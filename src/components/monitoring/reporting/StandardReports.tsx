import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Activity, DollarSign, Shield, Eye, ChevronDown, Filter, Search, LayoutGrid, List } from 'lucide-react';
import { Button } from '../../common/Button';
import { useMonitoring } from '../context/MonitoringContext';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'security' | 'billing' | 'operations';
  lastGenerated: string | null;
  frequency: 'on-demand' | 'daily' | 'weekly' | 'monthly';
  format: 'PDF' | 'CSV' | 'Excel' | 'JSON';
  size?: string;
  status: 'ready' | 'generating' | 'stale';
}

const availableReports: Report[] = [
  {
    id: 'connection-performance',
    name: 'Connection Performance Report',
    description: 'Comprehensive analysis of latency, throughput, packet loss, and uptime metrics across all connections',
    category: 'performance',
    lastGenerated: '2024-03-10T15:30:00Z',
    frequency: 'daily',
    format: 'PDF',
    size: '2.4 MB',
    status: 'ready'
  },
  {
    id: 'network-health',
    name: 'Network Health Summary',
    description: 'Overall network status including active connections, bandwidth utilization, and service availability',
    category: 'performance',
    lastGenerated: '2024-03-10T14:00:00Z',
    frequency: 'daily',
    format: 'PDF',
    size: '1.8 MB',
    status: 'ready'
  },
  {
    id: 'bandwidth-analysis',
    name: 'Bandwidth Utilization Analysis',
    description: 'Detailed breakdown of bandwidth consumption patterns, peak usage times, and capacity planning insights',
    category: 'performance',
    lastGenerated: '2024-03-09T23:45:00Z',
    frequency: 'weekly',
    format: 'Excel',
    size: '3.2 MB',
    status: 'ready'
  },
  {
    id: 'security-audit',
    name: 'Security Audit Report',
    description: 'Comprehensive security analysis including firewall events, DDoS protection metrics, and compliance status',
    category: 'security',
    lastGenerated: '2024-03-10T08:00:00Z',
    frequency: 'daily',
    format: 'PDF',
    size: '4.1 MB',
    status: 'ready'
  },
  {
    id: 'incident-summary',
    name: 'Incident & Downtime Summary',
    description: 'Complete log of network incidents, downtime events, root cause analysis, and resolution times',
    category: 'operations',
    lastGenerated: '2024-03-10T12:00:00Z',
    frequency: 'weekly',
    format: 'PDF',
    size: '1.5 MB',
    status: 'ready'
  },
  {
    id: 'billing-summary',
    name: 'Billing & Cost Summary',
    description: 'Detailed billing breakdown by connection, service charges, usage fees, and cost trends',
    category: 'billing',
    lastGenerated: '2024-03-01T00:00:00Z',
    frequency: 'monthly',
    format: 'Excel',
    size: '2.8 MB',
    status: 'stale'
  },
  {
    id: 'cost-optimization',
    name: 'Cost Optimization Report',
    description: 'Analysis of spending patterns with recommendations for cost savings and resource optimization',
    category: 'billing',
    lastGenerated: '2024-03-08T16:30:00Z',
    frequency: 'monthly',
    format: 'PDF',
    size: '3.5 MB',
    status: 'ready'
  },
  {
    id: 'sla-compliance',
    name: 'SLA Compliance Report',
    description: 'Service level agreement adherence tracking with uptime percentages and penalty calculations',
    category: 'operations',
    lastGenerated: '2024-03-09T18:00:00Z',
    frequency: 'monthly',
    format: 'PDF',
    size: '1.2 MB',
    status: 'ready'
  },
  {
    id: 'capacity-planning',
    name: 'Capacity Planning Report',
    description: 'Forecasting analysis for bandwidth needs, growth projections, and infrastructure scaling recommendations',
    category: 'performance',
    lastGenerated: null,
    frequency: 'on-demand',
    format: 'PDF',
    status: 'ready'
  },
  {
    id: 'raw-metrics',
    name: 'Raw Metrics Export',
    description: 'Complete export of all telemetry data for custom analysis and integration with external tools',
    category: 'operations',
    lastGenerated: null,
    frequency: 'on-demand',
    format: 'CSV',
    status: 'ready'
  }
];

export function StandardReports() {
  const { selectedConnection, timeRange } = useMonitoring();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [generatingReports, setGeneratingReports] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const getCategoryIcon = (category: Report['category']) => {
    switch (category) {
      case 'performance': return TrendingUp;
      case 'security': return Shield;
      case 'billing': return DollarSign;
      case 'operations': return Activity;
    }
  };

  const getCategoryColor = (category: Report['category']) => {
    switch (category) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-indigo-100 text-indigo-800';
      case 'billing': return 'bg-green-100 text-green-800';
      case 'operations': return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Ready</span>;
      case 'generating':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Generating</span>;
      case 'stale':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Needs Update</span>;
    }
  };

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReports(prev => new Set(prev).add(reportId));

    setTimeout(() => {
      setGeneratingReports(prev => {
        const next = new Set(prev);
        next.delete(reportId);
        return next;
      });

      window.addToast?.({
        type: 'success',
        title: 'Report Generated',
        message: 'Your report has been generated and is ready to download',
        duration: 4000
      });
    }, 2000);
  };

  const handleDownloadReport = (report: Report) => {
    window.addToast?.({
      type: 'success',
      title: 'Download Started',
      message: `Downloading ${report.name}`,
      duration: 3000
    });
  };

  const filteredReports = availableReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Reports', count: availableReports.length },
    { id: 'performance', label: 'Performance', count: availableReports.filter(r => r.category === 'performance').length },
    { id: 'security', label: 'Security', count: availableReports.filter(r => r.category === 'security').length },
    { id: 'billing', label: 'Billing', count: availableReports.filter(r => r.category === 'billing').length },
    { id: 'operations', label: 'Operations', count: availableReports.filter(r => r.category === 'operations').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Standard Reports</h3>
          <p className="text-sm text-gray-600 mt-1">
            Pre-configured reports for common monitoring and analysis needs
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            window.addToast?.({
              type: 'info',
              title: 'Generating Reports',
              message: 'Generating all standard reports. This may take a few minutes.',
              duration: 5000
            });
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Generate All Reports
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label} ({cat.count})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'card'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-500'
            }`}
            title="Card View"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'table'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-500'
            }`}
            title="Table View"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Reports View */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => {
            const Icon = getCategoryIcon(report.category);
            const isGenerating = generatingReports.has(report.id);

            return (
              <div
                key={report.id}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {report.name}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(report.category)}`}>
                  {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                </span>
                {getStatusBadge(isGenerating ? 'generating' : report.status)}
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  {report.format}
                </span>
                <span className="px-2 py-1 text-xs text-gray-500">
                  {report.frequency}
                </span>
              </div>

              {report.lastGenerated && (
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>
                    Last generated: {new Date(report.lastGenerated).toLocaleDateString()} at{' '}
                    {new Date(report.lastGenerated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {report.size && (
                    <span className="ml-2 text-gray-400">• {report.size}</span>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                {report.lastGenerated && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        window.addToast?.({
                          type: 'info',
                          title: 'Preview',
                          message: `Opening preview for ${report.name}`,
                          duration: 3000
                        });
                      }}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      Preview
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownloadReport(report)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Download
                    </Button>
                  </>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-1.5" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => {
                const Icon = getCategoryIcon(report.category);
                const isGenerating = generatingReports.has(report.id);

                return (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gray-100 rounded-lg">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-xs text-gray-500">{report.size || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(report.category)}`}>
                        {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {report.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                      {report.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.lastGenerated ? (
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span>
                            {new Date(report.lastGenerated).toLocaleDateString()} {new Date(report.lastGenerated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(isGenerating ? 'generating' : report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {report.lastGenerated && (
                          <>
                            <button
                              onClick={() => {
                                window.addToast?.({
                                  type: 'info',
                                  title: 'Preview',
                                  message: `Opening preview for ${report.name}`,
                                  duration: 3000
                                });
                              }}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadReport(report)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleGenerateReport(report.id)}
                          disabled={isGenerating}
                          className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Generate"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
