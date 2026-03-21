import { Cloud, ArrowRight, CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../common/Button';

interface AWSConnection {
  id: string;
  requestId: string;
  connectionName: string;
  region: string;
  bandwidth: string;
  status: 'pending-config' | 'in-progress' | 'completed';
  timestamp: string;
}

export default function AWSIntegrationWidget() {
  const navigate = useNavigate();

  const connections: AWSConnection[] = [
    {
      id: 'aws-001',
      requestId: 'AWS-REQ-789012',
      connectionName: 'att-netbond-prod-001',
      region: 'us-east-1',
      bandwidth: '10 Gbps',
      status: 'pending-config',
      timestamp: new Date().toISOString()
    }
  ];

  const stats = {
    pending: connections.filter(c => c.status === 'pending-config').length,
    inProgress: connections.filter(c => c.status === 'in-progress').length,
    completed: connections.filter(c => c.status === 'completed').length,
    total: connections.length
  };

  const handleViewAll = () => {
    navigate('/connections');
  };

  const handleConfigure = (connection: AWSConnection) => {
    navigate('/connections');
  };

  const getStatusIcon = (status: AWSConnection['status']) => {
    switch (status) {
      case 'pending-config':
        return <Clock className="w-4 h-4 text-fw-warn" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-fw-link" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-fw-success" />;
    }
  };

  const getStatusLabel = (status: AWSConnection['status']) => {
    switch (status) {
      case 'pending-config':
        return 'Awaiting Configuration';
      case 'in-progress':
        return 'Provisioning';
      case 'completed':
        return 'Active';
    }
  };

  const getStatusColor = (status: AWSConnection['status']) => {
    switch (status) {
      case 'pending-config':
        return 'bg-fw-warn/10 text-fw-warn border-fw-warn/30';
      case 'in-progress':
        return 'bg-fw-accent text-fw-linkHover border-fw-active';
      case 'completed':
        return 'bg-green-50 text-fw-success border-green-200';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-fw-active flex items-center justify-center">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-figma-base font-semibold text-fw-heading tracking-[-0.03em]">AWS Integration</h3>
            <p className="text-figma-sm text-fw-body">Partner connection status</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-fw-warn/10 border border-fw-warn/30 rounded-lg p-2">
          <div className="text-figma-sm text-fw-warn font-medium">Pending</div>
          <div className="text-figma-lg font-bold text-fw-warn">{stats.pending}</div>
        </div>
        <div className="bg-fw-accent border border-fw-active rounded-lg p-2">
          <div className="text-figma-sm text-fw-linkHover font-medium">In Progress</div>
          <div className="text-figma-lg font-bold text-fw-linkHover">{stats.inProgress}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
          <div className="text-figma-sm text-fw-success font-medium">Completed</div>
          <div className="text-figma-lg font-bold text-fw-success">{stats.completed}</div>
        </div>
      </div>

      {/* Connections List */}
      <div className="flex-1 overflow-auto space-y-2">
        {connections.length > 0 ? (
          connections.slice(0, 3).map((connection) => (
            <div
              key={connection.id}
              className="bg-fw-base border border-fw-secondary rounded-lg p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded bg-fw-warn/10 border border-fw-warn/30 flex items-center justify-center flex-shrink-0">
                    <Cloud className="w-4 h-4 text-fw-warn" />
                  </div>
                  <h4 className="text-figma-base font-semibold text-fw-heading truncate">
                    {connection.connectionName}
                  </h4>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-md text-figma-sm font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(connection.status)}`}>
                  {getStatusIcon(connection.status)}
                  <span>{getStatusLabel(connection.status)}</span>
                </div>
              </div>
              <div className="text-figma-sm text-fw-body space-y-1 mb-2 pl-10">
                <div className="flex items-center gap-1.5">
                  <span className="text-fw-bodyLight font-medium min-w-[70px]">Region:</span>
                  <span className="font-mono text-fw-heading">{connection.region}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-fw-bodyLight font-medium min-w-[70px]">Bandwidth:</span>
                  <span className="font-semibold text-fw-heading">{connection.bandwidth}</span>
                </div>
              </div>
              {connection.status === 'pending-config' && (
                <button
                  onClick={() => handleConfigure(connection)}
                  className="w-full mt-2 px-3 py-1.5 bg-fw-active text-white no-rounded rounded-md hover:bg-fw-linkHover transition-colors text-figma-sm font-medium flex items-center justify-center gap-1 tracking-[-0.03em]"
                >
                  Configure Now
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-lg bg-fw-neutral border border-fw-secondary flex items-center justify-center mb-3">
              <Cloud className="w-6 h-6 text-fw-bodyLight" />
            </div>
            <p className="text-figma-base text-fw-body mb-2">No AWS connections</p>
            <p className="text-figma-sm text-fw-bodyLight mb-3">
              Connect via AWS Direct Connect to get started
            </p>
            <a
              href="https://console.aws.amazon.com/directconnect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-fw-active text-white no-rounded rounded-md hover:bg-fw-linkHover transition-colors text-figma-sm font-medium tracking-[-0.03em]"
            >
              Open AWS Console
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      {connections.length > 0 && (
        <div className="mt-4 pt-3 border-t border-fw-secondary">
          <button
            onClick={handleViewAll}
            className="w-full text-figma-sm text-fw-link hover:text-fw-linkHover font-medium flex items-center justify-center gap-1"
          >
            View All AWS Connections
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
