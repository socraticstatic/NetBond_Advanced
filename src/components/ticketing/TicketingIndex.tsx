import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, Ticket, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchFilterBar } from '../common/SearchFilterBar';
import { OverflowMenu } from '../common/OverflowMenu';

type TicketStatus = 'active' | 'queued' | 'deferred' | 'ready to close' | 'device down';
type TicketPriority = 'device down' | 'partially impacting' | 'minor problems' | 'info tickets';

interface Ticket {
  id: string;
  ticketNumber: string;
  description: string;
  state: string;
  priority: TicketPriority;
  stage: TicketStatus;
  asset: string;
}

const STATUS_STYLES: Record<TicketStatus, string> = {
  'active': 'bg-fw-active/10 text-fw-link',
  'queued': 'bg-fw-warn/10 text-fw-warn',
  'deferred': 'bg-fw-neutral text-fw-bodyLight',
  'ready to close': 'bg-fw-success/10 text-fw-success',
  'device down': 'bg-fw-error/10 text-fw-error',
};

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  'device down': 'bg-fw-error/10 text-fw-error',
  'partially impacting': 'bg-fw-warn/10 text-fw-warn',
  'minor problems': 'bg-fw-warn/10 text-fw-warn',
  'info tickets': 'bg-fw-wash text-fw-bodyLight',
};

const MOCK_TICKETS: Ticket[] = [
  { id: '1', ticketNumber: '000000328268304', description: 'SYSLOG: tunnel-status-down', state: 'Open', priority: 'device down', stage: 'active', asset: 'PALO-MACD-TEST1' },
  { id: '2', ticketNumber: 'CHG0161575', description: 'Access Request', state: 'Open', priority: 'partially impacting', stage: 'queued', asset: '58777811' },
  { id: '3', ticketNumber: 'CHG0161576', description: 'Access Request', state: 'Open', priority: 'minor problems', stage: 'queued', asset: '58777811' },
  { id: '4', ticketNumber: 'CHG0161577', description: 'Access Request', state: 'Open', priority: 'info tickets', stage: 'deferred', asset: '58777811' },
  { id: '5', ticketNumber: 'CHG0161578', description: 'Access Request', state: 'Open', priority: 'device down', stage: 'ready to close', asset: '58777811' },
  { id: '6', ticketNumber: 'CHG0161579', description: 'User Access', state: 'Open', priority: 'partially impacting', stage: 'ready to close', asset: '58777811' },
  { id: '7', ticketNumber: 'CHG0161580', description: 'User Access', state: 'Open', priority: 'minor problems', stage: 'active', asset: '58777811' },
  { id: '8', ticketNumber: 'CHG0161581', description: 'Decommission Rule', state: 'Open', priority: 'info tickets', stage: 'deferred', asset: '58777811' },
  { id: '9', ticketNumber: 'CHG0161582', description: 'Decommission Rule', state: 'Open', priority: 'device down', stage: 'ready to close', asset: '58777811' },
  { id: '10', ticketNumber: 'CHG0161583', description: 'User Access', state: 'Open', priority: 'partially impacting', stage: 'active', asset: '58777811' },
];

const PAGE_SIZE = 20;

export function TicketingIndex() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string>('ticketNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter(ticket => {
      const matchesSearch = searchQuery === '' ||
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.asset.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.stage === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const startItem = filteredTickets.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, filteredTickets.length);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const columns = [
    { key: 'ticketNumber', label: 'Ticket number' },
    { key: 'description', label: 'Description' },
    { key: 'state', label: 'State' },
    { key: 'priority', label: 'Priority' },
    { key: 'stage', label: 'Stage' },
    { key: 'asset', label: 'Asset' },
  ];

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="rounded-lg border border-fw-secondary overflow-hidden">
        {/* SearchFilterBar inside border */}
        <div className="px-6 py-4 border-b border-fw-secondary">
          <SearchFilterBar
            searchPlaceholder="Search tickets ..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onFilter={() => {}}
            onExport={() => window.addToast?.({ type: 'success', title: 'Exported', message: 'Tickets exported', duration: 3000 })}
            filterContent={
              <div className="flex items-center gap-2">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="fw-select" style={{ width: 'auto', paddingRight: '2.5rem' }}>
                  <option value="all">All stages</option>
                  <option value="active">Active</option>
                  <option value="queued">Queued</option>
                  <option value="deferred">Deferred</option>
                  <option value="ready to close">Ready to Close</option>
                </select>
                <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }} className="fw-select" style={{ width: 'auto', paddingRight: '2.5rem' }}>
                  <option value="all">All priorities</option>
                  <option value="device down">Device Down</option>
                  <option value="partially impacting">Partially Impacting</option>
                  <option value="minor problems">Minor Problems</option>
                  <option value="info tickets">Info Tickets</option>
                </select>
              </div>
            }
            actions={
              <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/create')}>
                Create
              </Button>
            }
          />
        </div>

        <table className="w-full table-fixed">
          <thead className="bg-fw-wash border-b border-fw-secondary">
            <tr>
              <th className="w-10 px-4 h-12 align-middle">
                <input type="checkbox" className="h-4 w-4 rounded border-fw-secondary" />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-6 h-12 text-left text-[14px] font-medium text-fw-heading whitespace-nowrap overflow-hidden text-ellipsis align-middle"
                >
                  <button onClick={() => handleSort(col.key)} className="group inline-flex items-center space-x-1">
                    <span>{col.label}</span>
                    <span className="flex flex-col">
                      <ChevronUp className={`h-3 w-3 ${sortColumn === col.key && sortDirection === 'asc' ? 'text-fw-body' : 'text-fw-bodyLight group-hover:text-fw-body'}`} />
                      <ChevronDown className={`h-3 w-3 -mt-1 ${sortColumn === col.key && sortDirection === 'desc' ? 'text-fw-body' : 'text-fw-bodyLight group-hover:text-fw-body'}`} />
                    </span>
                  </button>
                </th>
              ))}
              <th className="w-16 px-6 h-12 align-middle" />
            </tr>
          </thead>
          <tbody className="bg-fw-base divide-y divide-fw-secondary">
            {paginatedTickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-fw-wash transition-colors cursor-pointer" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                <td className="px-4 py-4 align-middle" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" className="h-4 w-4 rounded border-fw-secondary" />
                </td>
                <td className="px-6 py-4 text-[14px] text-fw-link font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {ticket.ticketNumber}
                </td>
                <td className="px-6 py-4 text-[14px] text-fw-body whitespace-nowrap overflow-hidden text-ellipsis">
                  {ticket.description}
                </td>
                <td className="px-6 py-4 text-[14px] text-fw-heading whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full border-2 border-fw-active" />
                    {ticket.state}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium ${PRIORITY_STYLES[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium ${STATUS_STYLES[ticket.stage]}`}>
                    {ticket.stage}
                  </span>
                </td>
                <td className="px-6 py-4 text-[14px] text-fw-body whitespace-nowrap overflow-hidden text-ellipsis">
                  {ticket.asset}
                </td>
                <td className="w-16 px-6 py-4" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-end">
                    <OverflowMenu items={[
                      { id: 'view', label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => navigate(`/tickets/${ticket.id}`) },
                      { id: 'edit', label: 'Edit Ticket', icon: <Edit className="h-4 w-4" />, onClick: () => navigate(`/tickets/${ticket.id}`) },
                      { id: 'delete', label: 'Delete', icon: <Trash2 className="h-4 w-4" />, onClick: () => {}, variant: 'danger' as const },
                    ]} />
                  </div>
                </td>
              </tr>
            ))}
            {paginatedTickets.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-16 text-center">
                  <Ticket className="h-12 w-12 text-fw-bodyLight mx-auto mb-4" />
                  <h3 className="text-[16px] font-bold text-fw-heading mb-2">No tickets found</h3>
                  <p className="text-[14px] text-fw-bodyLight max-w-md mx-auto mb-6">
                    {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No support tickets have been created yet.'}
                  </p>
                  <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/create')}>
                    Create Ticket
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-fw-secondary">
          <span className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em]">
            {startItem} - {endItem} of {filteredTickets.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-fw-wash disabled:opacity-30"
            >
              <ChevronsLeft className="h-5 w-5 text-fw-heading" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-fw-wash disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5 text-fw-heading" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-5 w-5 flex items-center justify-center rounded text-figma-sm font-medium ${
                  page === currentPage ? 'bg-fw-active text-white' : 'text-fw-heading hover:bg-fw-wash'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-fw-wash disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5 text-fw-heading" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-fw-wash disabled:opacity-30"
            >
              <ChevronsRight className="h-5 w-5 text-fw-heading" />
            </button>
            <div className="w-px h-5 bg-fw-secondary mx-1" />
            <span className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">20</span>
            <ChevronDown className="h-4 w-4 text-fw-heading" />
          </div>
        </div>
      </div>
    </div>
  );
}
