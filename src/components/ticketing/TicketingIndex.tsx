import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, Settings, Ticket, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchFilterBar } from '../common/SearchFilterBar';
import { OverflowMenu } from '../common/OverflowMenu';
import { ColumnVisibilityPopover, ColumnDefinition } from '../common/ColumnVisibilityPopover';
import { useColumnVisibility } from '../../hooks/useColumnVisibility';

type TicketStatus = 'open' | 'in-progress' | 'pending' | 'closed';
type TroubleType = 'info' | 'trouble' | 'configuration';

interface TicketRow {
  id: string;
  ticketNumber: string;
  description: string;
  troubleType: TroubleType;
  status: TicketStatus;
  connection: string;
  vnf: string;
  created: string;
}

const STATUS_STYLES: Record<TicketStatus, string> = {
  'open': 'bg-fw-active/10 text-fw-link',
  'in-progress': 'bg-fw-warn/10 text-fw-warn',
  'pending': 'bg-fw-neutral text-fw-bodyLight',
  'closed': 'bg-fw-success/10 text-fw-success',
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  'open': 'Open',
  'in-progress': 'In Progress',
  'pending': 'Pending',
  'closed': 'Closed',
};

const TROUBLE_TYPE_STYLES: Record<TroubleType, string> = {
  'info': 'bg-fw-wash text-fw-bodyLight',
  'trouble': 'bg-fw-error/10 text-fw-error',
  'configuration': 'bg-fw-active/10 text-fw-link',
};

const TROUBLE_TYPE_LABELS: Record<TroubleType, string> = {
  'info': 'Information',
  'trouble': 'Trouble',
  'configuration': 'Configuration',
};

const MOCK_TICKETS: TicketRow[] = [
  { id: '1', ticketNumber: 'SDNTCK0006232', description: 'SYSLOG: tunnel-status-down', troubleType: 'trouble', status: 'open', connection: 'AWS Direct Connect - US East', vnf: 'PALO-MACD-TEST1', created: '2024-10-13' },
  { id: '2', ticketNumber: 'SDNTCK0006233', description: 'Bandwidth upgrade request for ExpressRoute', troubleType: 'configuration', status: 'in-progress', connection: 'Azure ExpressRoute - West Europe', vnf: 'FGT-ALP-FW01', created: '2024-10-12' },
  { id: '3', ticketNumber: 'SDNTCK0006234', description: 'Request BGP peering configuration details', troubleType: 'info', status: 'open', connection: 'Google Cloud Interconnect - US Central', vnf: 'RTR-GCP-01', created: '2024-10-12' },
  { id: '4', ticketNumber: 'SDNTCK0006235', description: 'Firewall rule change for DMZ access', troubleType: 'configuration', status: 'pending', connection: 'AWS Direct Connect - US East', vnf: 'PALO-MACD-TEST1', created: '2024-10-11' },
  { id: '5', ticketNumber: 'SDNTCK0006236', description: 'Intermittent packet loss on MPLS circuit', troubleType: 'trouble', status: 'open', connection: 'Oracle FastConnect - US Phoenix', vnf: '-', created: '2024-10-11' },
  { id: '6', ticketNumber: 'SDNTCK0006237', description: 'LMCC site addition - Dallas metro', troubleType: 'configuration', status: 'in-progress', connection: 'Google Cloud Interconnect - US Central', vnf: 'LMCC-GCP-01', created: '2024-10-10' },
  { id: '7', ticketNumber: 'SDNTCK0006238', description: 'Billing inquiry for Q3 usage', troubleType: 'info', status: 'closed', connection: '-', vnf: '-', created: '2024-10-09' },
  { id: '8', ticketNumber: 'SDNTCK0006239', description: 'SD-WAN edge failover not triggering', troubleType: 'trouble', status: 'open', connection: 'AWS Direct Connect - US East', vnf: 'SDWAN-EDGE-01', created: '2024-10-08' },
  { id: '9', ticketNumber: 'SDNTCK0006240', description: 'Add new VNF to existing connection', troubleType: 'configuration', status: 'closed', connection: 'Azure ExpressRoute - West Europe', vnf: '-', created: '2024-10-07' },
  { id: '10', ticketNumber: 'SDNTCK0006241', description: 'Request SLA report for September', troubleType: 'info', status: 'pending', connection: '-', vnf: '-', created: '2024-10-06' },
];

const PAGE_SIZE = 20;

export function TicketingIndex() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [troubleTypeFilter, setTroubleTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string>('ticketNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnPopover, setShowColumnPopover] = useState(false);
  const columnButtonRef = useRef<HTMLButtonElement>(null);
  const { isVisible, visibleColumns } = useColumnVisibility('tickets');

  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter(ticket => {
      const matchesSearch = searchQuery === '' ||
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.connection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.vnf.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesTroubleType = troubleTypeFilter === 'all' || ticket.troubleType === troubleTypeFilter;
      return matchesSearch && matchesStatus && matchesTroubleType;
    });
  }, [searchQuery, statusFilter, troubleTypeFilter]);

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

  const allColumns: Array<{ key: string; label: string }> = [
    { key: 'ticketNumber', label: 'Ticket Number' },
    { key: 'description', label: 'Description' },
    { key: 'troubleType', label: 'Trouble Type' },
    { key: 'status', label: 'Status' },
    { key: 'connection', label: 'Connection' },
    { key: 'vnf', label: 'VNF / Asset' },
    { key: 'created', label: 'Created' },
  ];

  const columns = visibleColumns.length === 0
    ? allColumns
    : allColumns.filter(c => isVisible(c.key));

  const columnDefs: ColumnDefinition[] = allColumns.map(c => ({ id: c.key, label: c.label }));

  const renderCell = (ticket: TicketRow, key: string) => {
    switch (key) {
      case 'ticketNumber':
        return <span className="text-fw-link font-medium">{ticket.ticketNumber}</span>;
      case 'description':
        return <span className="text-fw-body">{ticket.description}</span>;
      case 'troubleType':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-figma-sm font-medium ${TROUBLE_TYPE_STYLES[ticket.troubleType]}`}>
            {TROUBLE_TYPE_LABELS[ticket.troubleType]}
          </span>
        );
      case 'status':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-figma-sm font-medium ${STATUS_STYLES[ticket.status]}`}>
            {STATUS_LABELS[ticket.status]}
          </span>
        );
      case 'connection':
        return <span className="text-fw-body truncate">{ticket.connection}</span>;
      case 'vnf':
        return <span className="text-fw-body font-mono text-figma-sm">{ticket.vnf}</span>;
      case 'created':
        return <span className="text-fw-bodyLight">{ticket.created}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-fw-secondary overflow-hidden">
        {/* SearchFilterBar */}
        <div className="px-6 py-4 border-b border-fw-secondary">
          <SearchFilterBar
            searchPlaceholder="Search tickets..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onFilter={() => setShowFilters(!showFilters)}
            onExport={() => window.addToast?.({ type: 'success', title: 'Exported', message: 'Tickets exported', duration: 3000 })}
            actions={
              <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/create')}>
                Create
              </Button>
            }
          />
          {showFilters && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-fw-secondary">
              <div>
                <label className="fw-label">Status</label>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="fw-select" style={{ width: '180px' }}>
                  <option value="all">All statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="fw-label">Trouble Type</label>
                <select value={troubleTypeFilter} onChange={e => { setTroubleTypeFilter(e.target.value); setCurrentPage(1); }} className="fw-select" style={{ width: '200px' }}>
                  <option value="all">All types</option>
                  <option value="info">Information</option>
                  <option value="trouble">Trouble</option>
                  <option value="configuration">Configuration</option>
                </select>
              </div>
            </div>
          )}
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
                  className="px-6 h-12 text-left text-figma-sm font-medium text-fw-heading whitespace-nowrap overflow-hidden text-ellipsis align-middle"
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
              <th className="w-16 px-6 h-12 align-middle">
                <div className="flex justify-end">
                  <button
                    ref={columnButtonRef}
                    onClick={() => setShowColumnPopover(!showColumnPopover)}
                    className="p-2 text-fw-bodyLight hover:text-fw-body rounded-full hover:bg-fw-neutral transition-colors"
                    title="Manage Columns"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-fw-base divide-y divide-fw-secondary">
            {paginatedTickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-fw-wash transition-colors cursor-pointer" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                <td className="px-4 py-4 align-middle" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" className="h-4 w-4 rounded border-fw-secondary" />
                </td>
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-figma-base whitespace-nowrap overflow-hidden text-ellipsis">
                    {renderCell(ticket, col.key)}
                  </td>
                ))}
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
                  <h3 className="text-figma-base font-bold text-fw-heading mb-2">No tickets found</h3>
                  <p className="text-figma-sm text-fw-bodyLight max-w-md mx-auto mb-6">
                    {searchQuery || statusFilter !== 'all' || troubleTypeFilter !== 'all'
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
          <span className="text-figma-sm font-medium text-fw-bodyLight">
            {startItem} - {endItem} of {filteredTickets.length}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1 rounded hover:bg-fw-wash disabled:opacity-30">
              <ChevronsLeft className="h-5 w-5 text-fw-heading" />
            </button>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-fw-wash disabled:opacity-30">
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
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-fw-wash disabled:opacity-30">
              <ChevronRight className="h-5 w-5 text-fw-heading" />
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-fw-wash disabled:opacity-30">
              <ChevronsRight className="h-5 w-5 text-fw-heading" />
            </button>
            <div className="w-px h-5 bg-fw-secondary mx-1" />
            <span className="text-figma-sm font-medium text-fw-heading">20</span>
            <ChevronDown className="h-4 w-4 text-fw-heading" />
          </div>
        </div>
      </div>

      {showColumnPopover && (
        <ColumnVisibilityPopover
          tableId="tickets"
          allColumns={columnDefs}
          onClose={() => setShowColumnPopover(false)}
          anchorEl={columnButtonRef.current}
        />
      )}
    </div>
  );
}
