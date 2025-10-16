import { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  Shield,
  DollarSign,
  Activity,
  BarChart3,
  FileBarChart,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Play,
  Pause,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileReportingTabProps {
  selectedConnection: string;
  timeRange: string;
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

export function MobileReportingTab({ selectedConnection, timeRange }: MobileReportingTabProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    quick: true,
    scheduled: false,
    recent: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const quickReports: QuickReport[] = [
    {
      id: 'performance',
      title: 'Performance Summary',
      description: 'Complete network performance metrics',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'Performance',
      estimatedTime: '~30s',
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      description: 'Security events and compliance status',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      category: 'Security',
      estimatedTime: '~45s',
    },
    {
      id: 'billing',
      title: 'Cost Analysis',
      description: 'Billing breakdown and cost optimization',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      category: 'Billing',
      estimatedTime: '~20s',
    },
    {
      id: 'availability',
      title: 'Uptime & Availability',
      description: 'SLA compliance and availability',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'Operations',
      estimatedTime: '~25s',
    },
    {
      id: 'bandwidth',
      title: 'Bandwidth Utilization',
      description: 'Traffic patterns and capacity insights',
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

  const scheduledReports = [
    {
      id: '1',
      name: 'Weekly Performance',
      frequency: 'Weekly - Mon 9:00 AM',
      nextRun: '2024-03-18T09:00:00Z',
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Monthly Security Audit',
      frequency: 'Monthly - 1st day',
      nextRun: '2024-04-01T08:00:00Z',
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Daily Operations',
      frequency: 'Daily - 11:59 PM',
      nextRun: '2024-03-15T23:59:00Z',
      status: 'paused' as const,
    },
  ];

  const recentReports = [
    {
      id: '1',
      name: 'Performance Summary - March',
      generatedAt: '2024-03-10T15:30:00Z',
      size: '2.4 MB',
      format: 'PDF',
    },
    {
      id: '2',
      name: 'Security Audit - Q1',
      generatedAt: '2024-03-09T14:22:00Z',
      size: '1.8 MB',
      format: 'PDF',
    },
    {
      id: '3',
      name: 'Cost Analysis - February',
      generatedAt: '2024-03-01T09:00:00Z',
      size: '1.2 MB',
      format: 'Excel',
    },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            window.addToast({
              type: 'info',
              title: 'AI Analytics',
              message: 'Opening AI-powered analytics',
              duration: 3000,
            });
          }}
          className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold text-sm">AI Insights</span>
        </button>
        <button
          onClick={() => {
            window.addToast({
              type: 'info',
              title: 'Custom Report',
              message: 'Opening custom report builder',
              duration: 3000,
            });
          }}
          className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold text-sm">Custom Report</span>
        </button>
      </div>

      {/* Quick Reports Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-blue-50 to-white"
          onClick={() => toggleSection('quick')}
        >
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-base font-semibold text-gray-900">Quick Reports</h3>
          </div>
          {expandedSections.quick ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <AnimatePresence>
          {expandedSections.quick && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 space-y-3 bg-gray-50">
                {quickReports.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div
                      key={report.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 ${report.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                            <Icon className={`h-5 w-5 ${report.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900">{report.title}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{report.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {report.estimatedTime}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                            {report.category}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.addToast({
                                type: 'success',
                                title: 'Generating Report',
                                message: `${report.title} is being generated`,
                                duration: 4000,
                              });
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Generate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.addToast({
                                type: 'info',
                                title: 'Preview',
                                message: `Showing preview for ${report.title}`,
                                duration: 3000,
                              });
                            }}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scheduled Reports Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-green-50 to-white"
          onClick={() => toggleSection('scheduled')}
        >
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-base font-semibold text-gray-900">Scheduled Reports</h3>
          </div>
          {expandedSections.scheduled ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <AnimatePresence>
          {expandedSections.scheduled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 space-y-3 bg-gray-50">
                {scheduledReports.map((schedule) => (
                  <div key={schedule.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900 flex-1">{schedule.name}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${
                          schedule.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{schedule.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>
                          Next: {new Date(schedule.nextRun).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        schedule.status === 'active'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {schedule.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Resume
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Reports Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-purple-50 to-white"
          onClick={() => toggleSection('recent')}
        >
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-base font-semibold text-gray-900">Recent Reports</h3>
          </div>
          {expandedSections.recent ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <AnimatePresence>
          {expandedSections.recent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="divide-y divide-gray-100">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{report.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(report.generatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.addToast({
                            type: 'success',
                            title: 'Downloaded',
                            message: `${report.name} downloaded`,
                            duration: 3000,
                          });
                        }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
