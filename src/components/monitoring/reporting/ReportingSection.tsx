import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Shield,
  DollarSign,
  Activity,
  Clock,
  ChevronRight,
  Sparkles,
  BarChart3,
  FileBarChart,
  Plus,
  Eye,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  Filter,
  Search,
} from 'lucide-react';
import { Button } from '../../common/Button';

interface ReportingProps {
  selectedConnection: string;
  timeRange: string;
  defaultTab?: 'quick' | 'scheduled' | 'custom' | 'analytics';
}

interface QuickReport {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  category: string;
  estimatedTime: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
  nextRun: string;
  status: 'active' | 'paused' | 'failed';
  recipients: number;
  lastGenerated?: string;
}

interface ReportHistory {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  size: string;
  format: 'PDF' | 'CSV' | 'Excel' | 'JSON';
}

export function ReportingSection({ selectedConnection, timeRange, defaultTab = 'quick' }: ReportingProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const quickReports: QuickReport[] = [
    {
      id: 'performance',
      title: 'Performance Summary',
      description: 'Complete network performance metrics and trends',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'Performance',
      estimatedTime: '~30s',
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      description: 'Security events, threats, and compliance status',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      category: 'Security',
      estimatedTime: '~45s',
    },
    {
      id: 'billing',
      title: 'Cost Analysis',
      description: 'Detailed billing breakdown and cost optimization',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      category: 'Billing',
      estimatedTime: '~20s',
    },
    {
      id: 'availability',
      title: 'Uptime & Availability',
      description: 'SLA compliance and availability metrics',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'Operations',
      estimatedTime: '~25s',
    },
    {
      id: 'bandwidth',
      title: 'Bandwidth Utilization',
      description: 'Traffic patterns and capacity planning insights',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      category: 'Performance',
      estimatedTime: '~35s',
    },
    {
      id: 'executive',
      title: 'Executive Summary',
      description: 'High-level overview for stakeholders',
      icon: FileBarChart,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      category: 'Business',
      estimatedTime: '~15s',
    },
  ];

  const scheduledReports: ScheduledReport[] = [
    {
      id: '1',
      name: 'Weekly Performance Digest',
      type: 'Performance',
      frequency: 'Weekly - Monday 9:00 AM',
      nextRun: '2024-03-18T09:00:00Z',
      status: 'active',
      recipients: 5,
      lastGenerated: '2024-03-11T09:00:00Z',
    },
    {
      id: '2',
      name: 'Monthly Security Audit',
      type: 'Security',
      frequency: 'Monthly - 1st day 8:00 AM',
      nextRun: '2024-04-01T08:00:00Z',
      status: 'active',
      recipients: 3,
      lastGenerated: '2024-03-01T08:00:00Z',
    },
    {
      id: '3',
      name: 'Daily Operations Summary',
      type: 'Operations',
      frequency: 'Daily - 11:59 PM',
      nextRun: '2024-03-15T23:59:00Z',
      status: 'paused',
      recipients: 8,
      lastGenerated: '2024-03-10T23:59:00Z',
    },
    {
      id: '4',
      name: 'Quarterly Business Review',
      type: 'Business',
      frequency: 'Quarterly - End of quarter',
      nextRun: '2024-06-30T17:00:00Z',
      status: 'active',
      recipients: 12,
    },
  ];

  const recentReports: ReportHistory[] = [
    {
      id: '1',
      name: 'Performance Summary - March 2024',
      type: 'Performance',
      generatedAt: '2024-03-10T15:30:00Z',
      size: '2.4 MB',
      format: 'PDF',
    },
    {
      id: '2',
      name: 'Security Audit - Q1 2024',
      type: 'Security',
      generatedAt: '2024-03-09T14:22:00Z',
      size: '1.8 MB',
      format: 'PDF',
    },
    {
      id: '3',
      name: 'Bandwidth Analysis - Last 30 Days',
      type: 'Performance',
      generatedAt: '2024-03-08T10:15:00Z',
      size: '856 KB',
      format: 'Excel',
    },
    {
      id: '4',
      name: 'Cost Analysis - February 2024',
      type: 'Billing',
      generatedAt: '2024-03-01T09:00:00Z',
      size: '1.2 MB',
      format: 'PDF',
    },
  ];

  const categories = ['all', 'Performance', 'Security', 'Billing', 'Operations', 'Business'];

  const filteredReports = quickReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateReport = (reportId: string) => {
    const report = quickReports.find(r => r.id === reportId);
    window.addToast({
      type: 'success',
      title: 'Generating Report',
      message: `${report?.title} is being generated. You'll be notified when ready.`,
      duration: 4000,
    });
  };

  const getStatusColor = (status: ScheduledReport['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getFormatColor = (format: ReportHistory['format']) => {
    switch (format) {
      case 'PDF':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Excel':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'CSV':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'JSON':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">
            Generate insights and export data from your network infrastructure
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveTab('analytics')}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Insights
          </Button>
          <Button
            variant="primary"
            onClick={() => setActiveTab('custom')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Report tabs">
          {[
            { id: 'quick', label: 'Quick Reports', icon: FileText },
            { id: 'scheduled', label: 'Scheduled', icon: Calendar },
            { id: 'custom', label: 'Custom Builder', icon: Settings },
            { id: 'analytics', label: 'AI Analytics', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'quick' && (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`
                        px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors
                        ${selectedCategory === cat
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }
                      `}
                    >
                      {cat === 'all' ? 'All Reports' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => {
                  const Icon = report.icon;
                  return (
                    <motion.div
                      key={report.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                          <Icon className={`h-6 w-6 ${report.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {report.estimatedTime}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full font-medium">
                            {report.category}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            onClick={() => handleGenerateReport(report.id)}
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Generate
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              window.addToast({
                                type: 'info',
                                title: 'Preview',
                                message: `Showing preview for ${report.title}`,
                                duration: 3000,
                              });
                            }}
                            className="px-3"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Reports */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    View all
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {recentReports.map((report) => (
                      <div
                        key={report.id}
                        className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{report.name}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(report.generatedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span>•</span>
                              <span>{report.size}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getFormatColor(report.format)}`}>
                            {report.format}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Manage automated report generation and distribution
                </p>
                <Button variant="primary" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Schedule
                </Button>
              </div>

              <div className="grid gap-4">
                {scheduledReports.map((schedule) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{schedule.name}</h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
                            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{schedule.frequency}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>
                              Next run: {new Date(schedule.nextRun).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span>{schedule.recipients} recipients</span>
                          </div>
                          {schedule.lastGenerated && (
                            <div className="text-xs text-gray-500">
                              Last generated: {new Date(schedule.lastGenerated).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          className="p-2"
                          title={schedule.status === 'active' ? 'Pause' : 'Resume'}
                        >
                          {schedule.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" className="p-2" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="p-2" title="Duplicate">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="p-2 text-red-600 hover:text-red-700" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Settings className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Report Builder</h3>
                <p className="text-gray-600 mb-8">
                  Create tailored reports with your choice of metrics, visualizations, and formats.
                  Select data sources, apply filters, and design the perfect report for your needs.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="primary" size="lg" className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Start Building
                  </Button>
                  <Button variant="outline" size="lg" className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Use Template
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Analytics</h3>
                <p className="text-gray-600 mb-8">
                  Leverage artificial intelligence to automatically identify trends, anomalies, and optimization
                  opportunities. Get intelligent recommendations based on your network performance data.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="primary" size="lg" className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generate AI Insights
                  </Button>
                  <Button variant="outline" size="lg" className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    View Examples
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
