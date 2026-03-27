import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle, Clock, User, Paperclip, FileText, Search, Edit2, Save, X, MessageSquare, ArrowUpDown } from 'lucide-react';
import { Button } from '../common/Button';

type StageStep = {
  label: string;
  completed: boolean;
  active: boolean;
};

interface TicketData {
  id: string;
  ticketNumber: string;
  troubleType: 'info' | 'trouble' | 'configuration';
  status: 'open' | 'in-progress' | 'pending' | 'closed';
  connection: string;
  vnf: string;
  csp: string;
  description: string;
  opened: string;
  lastUpdate: string;
  requestorName: string;
  authorName: string;
  email: string;
  startDate: string;
  endDate: string;
  phone: string;
  attachment: string;
  steps: StageStep[];
  activityLog: ActivityEntry[];
}

interface ActivityEntry {
  date: string;
  topic: string;
  user: string;
  message: string;
}

const TROUBLE_TYPE_LABELS: Record<string, string> = {
  info: 'Information',
  trouble: 'Trouble',
  configuration: 'Configuration',
};

const TROUBLE_TYPE_STYLES: Record<string, string> = {
  info: 'bg-fw-wash text-fw-bodyLight',
  trouble: 'bg-fw-error/10 text-fw-error',
  configuration: 'bg-fw-active/10 text-fw-link',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  pending: 'Pending',
  closed: 'Closed',
};

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-fw-active/10 text-fw-link',
  'in-progress': 'bg-fw-warn/10 text-fw-warn',
  pending: 'bg-fw-neutral text-fw-bodyLight',
  closed: 'bg-fw-success/10 text-fw-success',
};

const MOCK_TICKET: TicketData = {
  id: '1',
  ticketNumber: 'SDNTCK0006232',
  troubleType: 'trouble',
  status: 'open',
  connection: 'AWS Direct Connect - US East',
  vnf: 'PALO-MACD-TEST1',
  csp: 'AWS',
  description: `SYSLOG: tunnel-status-down

Tunnel between PALO-MACD-TEST1 and AWS us-east-1 is reporting down status since 06:55 PM.

Affected VNF: Palo Alto Firewall (PALO-MACD-TEST1)
Connection: AWS Direct Connect - US East
Impact: Traffic failover to secondary path active.

Requesting investigation and restoration of primary tunnel.`,
  opened: '2024/10/13, 06:55 PM',
  lastUpdate: '2024/10/13, 12:04 AM',
  requestorName: 'Alpha Corp',
  authorName: 'John Martinez',
  email: 'j.martinez@alphacorp.com',
  startDate: '2024/10/13, 2:00 PM',
  endDate: '2024/10/13, 3:00 PM',
  phone: '+1 973 1234567',
  attachment: 'tunnel-status-log.txt',
  steps: [
    { label: 'Submitted', completed: true, active: false },
    { label: 'Acknowledged', completed: false, active: true },
    { label: 'In progress', completed: false, active: false },
    { label: 'Completed', completed: false, active: false },
  ],
  activityLog: [
    { date: '2024/10/13 8:50', topic: 'General', user: 'system', message: 'action selected : Closed' },
    { date: '2024/10/13 8:50', topic: 'General', user: 'system', message: 'Change state moved to Closed' },
    { date: '2024/10/13 8:50', topic: 'MFGLVT14F,CTA...', user: 'system', message: 'Now really closed.' },
    { date: '2024/10/13 8:50', topic: 'General', user: 'system', message: 'Automation job group 4044 has been successfuly completed.' },
  ],
};

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'communication' | 'activity'>('communication');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [resolutionCode, setResolutionCode] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const [editData, setEditData] = useState({
    description: MOCK_TICKET.description,
    status: MOCK_TICKET.status,
    requestorName: MOCK_TICKET.requestorName,
    authorName: MOCK_TICKET.authorName,
    email: MOCK_TICKET.email,
    phone: MOCK_TICKET.phone,
    startDate: MOCK_TICKET.startDate,
    endDate: MOCK_TICKET.endDate,
  });

  const ticket = MOCK_TICKET;

  const handleSave = () => {
    setIsEditing(false);
    window.addToast?.({ type: 'success', title: 'Ticket Updated', message: 'Changes saved successfully', duration: 3000 });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => navigate('/tickets')}>
            Back
          </Button>
          <Button variant="ghost" size="md" icon={RefreshCw} onClick={() => {}}>
            Refresh
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="primary" size="sm" icon={Save} onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" size="sm" icon={X} onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm" icon={Edit2} onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowCloseModal(true)} disabled={isClosed}>
                {isClosed ? 'Closed' : 'Close Ticket'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => {}}>
                Return to customer
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/tickets')}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Ticket header */}
      <div className="mb-6">
        <h1 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">
          {ticket.ticketNumber}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-figma-sm font-medium ${TROUBLE_TYPE_STYLES[ticket.troubleType]}`}>
            {TROUBLE_TYPE_LABELS[ticket.troubleType]}
          </span>
          <div className="w-px h-4 bg-fw-secondary" />
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-figma-sm font-medium ${STATUS_STYLES[isClosed ? 'closed' : editData.status]}`}>
            {isClosed ? 'Closed' : STATUS_LABELS[editData.status]}
          </span>
          <div className="w-px h-4 bg-fw-secondary" />
          <span className="text-figma-base font-medium text-fw-body tracking-[-0.03em]">
            {ticket.connection}
          </span>
          {ticket.vnf !== '-' && (
            <>
              <div className="w-px h-4 bg-fw-secondary" />
              <span className="text-figma-base font-mono text-figma-sm text-fw-bodyLight">
                {ticket.vnf}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Progress stepper - matches Figma ticket-detail.png */}
      <div className="flex items-center justify-between mb-8">
        {ticket.steps.map((step, index) => (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              {step.completed ? (
                <div className="h-8 w-8 rounded-full bg-fw-link flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              ) : step.active ? (
                <div className="h-8 w-8 rounded-full border-2 border-fw-link flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-fw-link" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full border-2 border-fw-secondary flex items-center justify-center">
                  <span className="text-figma-sm font-medium text-fw-bodyLight">{index + 1}</span>
                </div>
              )}
              <span className={`mt-2 text-figma-base font-medium tracking-[-0.03em] whitespace-nowrap ${
                step.completed || step.active ? 'text-fw-heading' : 'text-fw-bodyLight'
              }`}>
                {step.label}
              </span>
            </div>
            {index < ticket.steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 mt-[-1rem] ${
                step.completed ? 'bg-fw-link' : 'bg-fw-secondary'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main content - left side */}
        <div className="col-span-8 space-y-6">
          {/* Description card */}
          <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
            <h3 className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em] mb-3">
              Description
            </h3>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="fw-textarea"
                style={{ height: '120px' }}
              />
            ) : (
              <p className="text-figma-lg font-medium text-fw-heading tracking-[-0.03em] whitespace-pre-line">
                {editData.description}
              </p>
            )}
          </div>

          {/* Activity / Communication tabs */}
          <div className="bg-fw-base rounded-2xl border border-fw-secondary overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-4 pb-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('communication')}
                  className={`inline-flex items-center gap-2 pb-3 text-figma-base font-medium tracking-[-0.03em] no-rounded border-b-2 transition-colors ${
                    activeTab === 'communication'
                      ? 'text-fw-heading border-fw-active'
                      : 'text-fw-bodyLight border-transparent hover:text-fw-heading'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Communication
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`inline-flex items-center gap-2 pb-3 text-figma-base font-medium tracking-[-0.03em] no-rounded border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'text-fw-heading border-fw-active'
                      : 'text-fw-bodyLight border-transparent hover:text-fw-heading'
                  }`}
                >
                  Activity log
                </button>
              </div>
              <div className="relative pb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-[calc(50%+6px)] h-4 w-4 text-fw-link" />
                <input
                  type="text"
                  placeholder="Search keyword ..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  className="h-9 w-[280px] pl-9 pr-4 rounded-full border border-fw-secondary bg-fw-base text-figma-base text-fw-heading placeholder:text-fw-bodyLight focus:outline-none focus:ring-1 focus:ring-fw-active tracking-[-0.03em]"
                />
              </div>
            </div>

            {/* Activity log table */}
            <table className="w-full">
              <thead>
                <tr className="bg-fw-wash border-y border-fw-secondary">
                  <th className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em]">
                    <span className="inline-flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3.5 w-3.5 text-fw-bodyLight" />
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em]">
                    <span className="inline-flex items-center gap-1">
                      Topic
                      <ArrowUpDown className="h-3.5 w-3.5 text-fw-bodyLight" />
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em]">
                    <span className="inline-flex items-center gap-1">
                      User
                      <ArrowUpDown className="h-3.5 w-3.5 text-fw-bodyLight" />
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em]">
                    <span className="inline-flex items-center gap-1">
                      Message
                      <ArrowUpDown className="h-3.5 w-3.5 text-fw-bodyLight" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ticket.activityLog.map((entry, index) => (
                  <tr key={index} className="border-b border-fw-secondary last:border-b-0 hover:bg-fw-wash transition-colors">
                    <td className="px-6 py-3 text-figma-base font-medium text-fw-heading tracking-[-0.03em]">
                      {entry.date}
                    </td>
                    <td className="px-6 py-3 text-figma-base font-medium text-fw-body tracking-[-0.03em]">
                      {entry.topic}
                    </td>
                    <td className="px-6 py-3 text-figma-base font-medium text-fw-body tracking-[-0.03em]">
                      {entry.user}
                    </td>
                    <td className="px-6 py-3 text-figma-base font-medium text-fw-heading tracking-[-0.03em]">
                      {entry.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Time info card */}
          <div className="bg-fw-base rounded-2xl border border-fw-secondary p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-fw-heading" />
              <h3 className="text-figma-base font-bold text-fw-heading tracking-[-0.03em]">Time</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em] mb-1">Opened</p>
                <p className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{ticket.opened}</p>
              </div>
              <div>
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em] mb-1">Last update</p>
                <p className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{ticket.lastUpdate}</p>
              </div>
              <div>
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em] mb-1">Start date</p>
                {isEditing ? (
                  <input type="text" value={editData.startDate} onChange={(e) => setEditData({ ...editData, startDate: e.target.value })} className="fw-input" />
                ) : (
                  <p className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{editData.startDate}</p>
                )}
              </div>
              <div>
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em] mb-1">End date</p>
                {isEditing ? (
                  <input type="text" value={editData.endDate} onChange={(e) => setEditData({ ...editData, endDate: e.target.value })} className="fw-input" />
                ) : (
                  <p className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{editData.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Requestor card */}
          <div className="bg-fw-base rounded-2xl border border-fw-secondary p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-fw-heading" />
              <h3 className="text-figma-base font-bold text-fw-heading tracking-[-0.03em]">Requestor</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em] mb-1">Organization</p>
                {isEditing ? (
                  <input type="text" value={editData.requestorName} onChange={(e) => setEditData({ ...editData, requestorName: e.target.value })} className="fw-input" />
                ) : (
                  <p className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{editData.requestorName}</p>
                )}
              </div>
              <div>
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em] mb-1">Author</p>
                {isEditing ? (
                  <input type="text" value={editData.authorName} onChange={(e) => setEditData({ ...editData, authorName: e.target.value })} className="fw-input" />
                ) : (
                  <p className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{editData.authorName}</p>
                )}
              </div>
              <div>
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em] mb-1">Email</p>
                {isEditing ? (
                  <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="fw-input" />
                ) : (
                  <p className="text-figma-base font-medium text-fw-link tracking-[-0.03em]">{editData.email}</p>
                )}
              </div>
              <div>
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em] mb-1">Phone</p>
                {isEditing ? (
                  <input type="tel" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="fw-input" />
                ) : (
                  <p className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{editData.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status card */}
          <div className="bg-fw-base rounded-2xl border border-fw-secondary p-5">
            <div className="flex items-center justify-between">
              <span className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em]">Status</span>
              {isEditing ? (
                <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="fw-select" style={{ width: 'auto', paddingRight: '2.5rem' }}>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              ) : (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-figma-sm font-medium ${STATUS_STYLES[isClosed ? 'closed' : editData.status]}`}>
                  {isClosed ? 'Closed' : STATUS_LABELS[editData.status]}
                </span>
              )}
            </div>
          </div>

          {/* Attachments card */}
          <div className="bg-fw-base rounded-2xl border border-fw-secondary p-5">
            <div className="flex items-center gap-2 mb-4">
              <Paperclip className="h-5 w-5 text-fw-heading" />
              <h3 className="text-figma-base font-bold text-fw-heading tracking-[-0.03em]">Attachments</h3>
            </div>
            <button className="inline-flex items-center gap-2 py-2 text-figma-base font-medium text-fw-body tracking-[-0.03em] hover:text-fw-link transition-colors">
              <FileText className="h-5 w-5" />
              {ticket.attachment}
            </button>
          </div>
        </div>
      </div>

      {/* Close Ticket Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-fw-base rounded-2xl shadow-xl border border-fw-secondary w-full max-w-md p-6">
            <h3 className="text-figma-lg font-semibold text-fw-heading mb-4">Close Ticket</h3>
            <p className="text-figma-sm text-fw-bodyLight mb-4">
              Select a resolution code and add notes before closing this ticket.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-figma-sm font-medium text-fw-heading mb-1">
                  Resolution Code <span className="text-fw-error">*</span>
                </label>
                <select
                  value={resolutionCode}
                  onChange={e => setResolutionCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-fw-secondary bg-fw-base text-figma-base text-fw-heading focus:outline-none focus:ring-1 focus:ring-fw-active"
                >
                  <option value="">Select resolution</option>
                  <option value="resolved-customer">Resolved by Customer</option>
                  <option value="resolved-support">Resolved by Support</option>
                  <option value="duplicate">Duplicate</option>
                  <option value="cannot-reproduce">Cannot Reproduce</option>
                  <option value="configuration-applied">Configuration Applied</option>
                </select>
              </div>
              <div>
                <label className="block text-figma-sm font-medium text-fw-heading mb-1">
                  Resolution Notes
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-fw-secondary bg-fw-base text-figma-base text-fw-heading focus:outline-none focus:ring-1 focus:ring-fw-active resize-none"
                  placeholder="Add resolution details..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowCloseModal(false); setResolutionCode(''); setResolutionNotes(''); }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                disabled={!resolutionCode}
                onClick={() => {
                  setIsClosed(true);
                  setShowCloseModal(false);
                  window.addToast?.({ type: 'success', title: 'Ticket Closed', message: `Resolution: ${resolutionCode}`, duration: 3000 });
                }}
              >
                Close Ticket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
