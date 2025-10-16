import { useState } from 'react';
import { Calendar, Clock, Mail, Users, Play, Pause, Edit, Trash2, Plus, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  schedule: {
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  format: 'PDF' | 'CSV' | 'Excel';
  recipients: string[];
  status: 'active' | 'paused';
  lastRun: string | null;
  nextRun: string;
  totalRuns: number;
  successRate: number;
  includeConnectionIds?: string[];
}

const scheduledReports: ScheduledReport[] = [
  {
    id: '1',
    name: 'Daily Performance Summary',
    reportType: 'Connection Performance Report',
    frequency: 'daily',
    schedule: { time: '08:00' },
    format: 'PDF',
    recipients: ['operations@company.com', 'netops@company.com'],
    status: 'active',
    lastRun: '2024-03-10T08:00:00Z',
    nextRun: '2024-03-11T08:00:00Z',
    totalRuns: 87,
    successRate: 98.9
  },
  {
    id: '2',
    name: 'Weekly Security Audit',
    reportType: 'Security Audit Report',
    frequency: 'weekly',
    schedule: { time: '23:00', dayOfWeek: 0 },
    format: 'PDF',
    recipients: ['security@company.com', 'compliance@company.com', 'ciso@company.com'],
    status: 'active',
    lastRun: '2024-03-03T23:00:00Z',
    nextRun: '2024-03-10T23:00:00Z',
    totalRuns: 52,
    successRate: 100
  },
  {
    id: '3',
    name: 'Monthly Billing Summary',
    reportType: 'Billing & Cost Summary',
    frequency: 'monthly',
    schedule: { time: '00:00', dayOfMonth: 1 },
    format: 'Excel',
    recipients: ['finance@company.com', 'billing@company.com'],
    status: 'active',
    lastRun: '2024-03-01T00:00:00Z',
    nextRun: '2024-04-01T00:00:00Z',
    totalRuns: 12,
    successRate: 100
  },
  {
    id: '4',
    name: 'Weekly Bandwidth Analysis',
    reportType: 'Bandwidth Utilization Analysis',
    frequency: 'weekly',
    schedule: { time: '06:00', dayOfWeek: 1 },
    format: 'Excel',
    recipients: ['capacity@company.com', 'netops@company.com'],
    status: 'active',
    lastRun: '2024-03-04T06:00:00Z',
    nextRun: '2024-03-11T06:00:00Z',
    totalRuns: 48,
    successRate: 97.9
  },
  {
    id: '5',
    name: 'Quarterly SLA Report',
    reportType: 'SLA Compliance Report',
    frequency: 'quarterly',
    schedule: { time: '09:00', dayOfMonth: 1 },
    format: 'PDF',
    recipients: ['executives@company.com', 'operations@company.com'],
    status: 'paused',
    lastRun: '2024-01-01T09:00:00Z',
    nextRun: '2024-04-01T09:00:00Z',
    totalRuns: 4,
    successRate: 100
  }
];

export function ScheduledReports() {
  const [reports, setReports] = useState(scheduledReports);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ScheduledReport | null>(null);

  const toggleReportStatus = (id: string) => {
    setReports(prev => prev.map(report =>
      report.id === id
        ? { ...report, status: report.status === 'active' ? 'paused' : 'active' }
        : report
    ));

    const report = reports.find(r => r.id === id);
    window.addToast?.({
      type: 'success',
      title: report?.status === 'active' ? 'Report Paused' : 'Report Activated',
      message: `Schedule for "${report?.name}" has been ${report?.status === 'active' ? 'paused' : 'activated'}`,
      duration: 3000
    });
  };

  const deleteReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    setReports(prev => prev.filter(r => r.id !== id));

    window.addToast?.({
      type: 'success',
      title: 'Schedule Deleted',
      message: `"${report?.name}" has been removed`,
      duration: 3000
    });
  };

  const getFrequencyLabel = (frequency: ScheduledReport['frequency']) => {
    switch (frequency) {
      case 'daily': return 'Every Day';
      case 'weekly': return 'Every Week';
      case 'monthly': return 'Every Month';
      case 'quarterly': return 'Every Quarter';
    }
  };

  const getScheduleDetails = (report: ScheduledReport) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let details = `${report.schedule.time}`;

    if (report.frequency === 'weekly' && report.schedule.dayOfWeek !== undefined) {
      details += ` on ${days[report.schedule.dayOfWeek]}s`;
    } else if (report.frequency === 'monthly' && report.schedule.dayOfMonth) {
      details += ` on day ${report.schedule.dayOfMonth}`;
    }

    return details;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
          <p className="text-sm text-gray-600 mt-1">
            Automatically generate and deliver reports on a recurring schedule
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Schedules</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {reports.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                {reports.filter(r => r.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paused</p>
              <p className="text-2xl font-semibold text-gray-600 mt-1">
                {reports.filter(r => r.status === 'paused').length}
              </p>
            </div>
            <Pause className="h-8 w-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {(reports.reduce((sum, r) => sum + r.successRate, 0) / reports.length).toFixed(1)}%
              </p>
            </div>
            <FileText className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Scheduled Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`card p-6 transition-all ${
              report.status === 'paused' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-base font-semibold text-gray-900">
                    {report.name}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    report.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {report.format}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {report.reportType}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{getFrequencyLabel(report.frequency)}</div>
                      <div className="text-xs">{getScheduleDetails(report)}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Next Run</div>
                      <div className="text-xs">
                        {new Date(report.nextRun).toLocaleDateString()} at{' '}
                        {new Date(report.nextRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{report.totalRuns} Runs</div>
                      <div className="text-xs">{report.successRate}% success rate</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{report.recipients.length} Recipients</div>
                      <div className="text-xs truncate">{report.recipients[0]}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleReportStatus(report.id)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title={report.status === 'active' ? 'Pause schedule' : 'Activate schedule'}
                >
                  {report.status === 'active' ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedReport(report);
                    window.addToast?.({
                      type: 'info',
                      title: 'Edit Schedule',
                      message: 'Opening schedule editor',
                      duration: 2000
                    });
                  }}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit schedule"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${report.name}"?`)) {
                      deleteReport(report.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete schedule"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {report.lastRun && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-500">
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Last run: {new Date(report.lastRun).toLocaleDateString()} at{' '}
                  {new Date(report.lastRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled reports</h3>
          <p className="text-gray-600 mb-4">
            Create a schedule to automatically generate and deliver reports
          </p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </Button>
        </div>
      )}

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Scheduled Report"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Schedule configuration interface would be implemented here with options for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 mb-6">
              <li>Report type selection</li>
              <li>Frequency and timing configuration</li>
              <li>Format selection (PDF, CSV, Excel)</li>
              <li>Recipient management</li>
              <li>Connection filtering</li>
              <li>Custom parameters</li>
            </ul>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowCreateModal(false);
                  window.addToast?.({
                    type: 'success',
                    title: 'Schedule Created',
                    message: 'Your report schedule has been created successfully',
                    duration: 3000
                  });
                }}
              >
                Create Schedule
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
