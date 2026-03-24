import { Ticket, Clock, CheckCircle } from 'lucide-react';

export function SupportTicketsWidget() {
  const tickets = [
    {
      id: '1',
      title: 'Connection Latency Issue',
      status: 'open',
      priority: 'high',
      created: '2024-03-10T15:30:00Z'
    },
    {
      id: '2',
      title: 'Bandwidth Upgrade Request',
      status: 'in-progress',
      priority: 'medium',
      created: '2024-03-09T10:15:00Z'
    },
    {
      id: '3',
      title: 'Security Configuration',
      status: 'resolved',
      priority: 'low',
      created: '2024-03-08T14:20:00Z'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Ticket className="h-5 w-5 text-fw-purple mr-2" />
          <span className="text-figma-base font-medium text-fw-heading">Recent Tickets</span>
        </div>
        <button className="text-figma-base text-fw-link hover:text-fw-linkHover">
          Create New
        </button>
      </div>

      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="p-2 bg-fw-wash rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-figma-base font-medium text-fw-heading">{ticket.title}</span>
              <span className={`px-2 py-0.5 text-figma-sm font-medium rounded-full ${
                ticket.status === 'open' ? 'bg-fw-errorLight text-fw-error' :
                ticket.status === 'in-progress' ? 'bg-fw-warn/10 text-fw-warn' :
                'bg-fw-successLight text-fw-success'
              }`}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center text-figma-sm text-fw-bodyLight">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(ticket.created).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-2 bg-fw-successLight rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 text-fw-success mr-2" />
          <span className="text-figma-base text-fw-success">All caught up!</span>
        </div>
        <span className="text-figma-sm text-fw-success">100% Response Rate</span>
      </div>
    </div>
  );
}
