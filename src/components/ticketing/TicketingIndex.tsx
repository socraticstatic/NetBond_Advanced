import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, ArrowUpDown, Ticket } from 'lucide-react';
import { Button } from '../common/Button';

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
    <div className="max-w-7xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fw-link" />
          <input
            type="text"
            placeholder="Search tickets ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-9 w-[429px] pl-9 pr-4 rounded-full border border-fw-secondary bg-fw-base text-figma-base text-fw-heading placeholder:text-fw-bodyLight focus:outline-none focus:ring-1 focus:ring-fw-active tracking-[-0.03em]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="h-9 px-3 rounded-full border border-fw-secondary bg-fw-base text-figma-base text-fw-heading tracking-[-0.03em] focus:outline-none focus:ring-1 focus:ring-fw-active appearance-none cursor-pointer"
          >
            <option value="all">All stages</option>
            <option value="active">Active</option>
            <option value="queued">Queued</option>
            <option value="deferred">Deferred</option>
            <option value="ready to close">Ready to Close</option>
            <option value="device down">Device Down</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
            className="h-9 px-3 rounded-full border border-fw-secondary bg-fw-base text-figma-base text-fw-heading tracking-[-0.03em] focus:outline-none focus:ring-1 focus:ring-fw-active appearance-none cursor-pointer"
          >
            <option value="all">All priorities</option>
            <option value="device down">Device Down</option>
            <option value="partially impacting">Partially Impacting</option>
            <option value="minor problems">Minor Problems</option>
            <option value="info tickets">Info Tickets</option>
          </select>

          <div className="w-px h-9 bg-fw-secondary" />

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/tickets/create')}
          >
            Create
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-fw-wash border-b border-fw-secondary">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" className="h-5 w-5 rounded border-fw-secondary" />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-figma-base font-medium text-fw-heading tracking-[-0.03em] cursor-pointer select-none"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="h-3.5 w-3.5 text-fw-bodyLight" />
                  </span>
                </th>
              ))}
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.map(ticket => (
              <tr
                key={ticket.id}
                className="border-b border-fw-secondary last:border-b-0 hover:bg-fw-wash/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <input type="checkbox" className="h-5 w-5 rounded border-fw-secondary" />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="text-figma-base font-medium text-fw-link tracking-[-0.03em] hover:underline"
                  >
                    {ticket.ticketNumber}
                  </button>
                </td>
                <td className="px-4 py-3 text-figma-base font-medium text-fw-body tracking-[-0.03em]">
                  {ticket.description}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-figma-base font-medium text-fw-heading tracking-[-0.03em]">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-fw-active" />
                    {ticket.state}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-figma-sm font-medium ${PRIORITY_STYLES[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-figma-sm font-medium ${STATUS_STYLES[ticket.stage]}`}>
                    {ticket.stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-figma-base font-medium text-fw-heading tracking-[-0.03em]">
                  {ticket.asset}
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 rounded hover:bg-fw-wash">
                    <MoreHorizontal className="h-5 w-5 text-fw-body" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedTickets.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <Ticket className="h-12 w-12 text-fw-bodyLight mb-4" />
                    <h3 className="text-figma-lg font-bold text-fw-heading mb-2">No tickets found</h3>
                    <p className="text-figma-base text-fw-bodyLight max-w-md mx-auto mb-6 tracking-[-0.03em]">
                      {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No support tickets have been created yet.'}
                    </p>
                    <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/create')}>
                      Create Ticket
                    </Button>
                  </div>
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
            <ArrowUpDown className="h-4 w-4 text-fw-heading" />
          </div>
        </div>
      </div>
    </div>
  );
}
