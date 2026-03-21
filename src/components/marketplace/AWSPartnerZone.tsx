import { useState } from 'react';
import { Cloud, ArrowRight, CheckCircle2, ExternalLink, Info, Sparkles, Network, Building2 } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

interface AWSConnection {
  id: string;
  requestId: string;
  connectionName: string;
  region: string;
  bandwidth: string;
  status: 'pending-config' | 'in-progress' | 'completed';
  customerEmail: string;
  timestamp: string;
}

export function AWSPartnerZone() {
  const navigate = useNavigate();

  const [pendingConnections] = useState<AWSConnection[]>([
    {
      id: 'aws-001',
      requestId: 'AWS-REQ-789012',
      connectionName: 'att-netbond-prod-001',
      region: 'us-east-1',
      bandwidth: '10 Gbps',
      status: 'pending-config',
      customerEmail: 'user@company.com',
      timestamp: new Date().toISOString()
    }
  ]);

  const handleConfigureConnection = (connection: AWSConnection) => {
    window.addToast?.({
      type: 'info',
      title: 'AWS Connection Configuration',
      message: `Opening configuration wizard for ${connection.connectionName}`,
      duration: 3000
    });
  };

  const handleViewWorkflow = () => {
    window.addToast?.({
      type: 'info',
      title: 'AWS Workflow',
      message: 'AWS workflow documentation coming soon',
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-fw-neutral flex items-center justify-center">
              <Cloud className="w-6 h-6 text-fw-bodyLight" />
            </div>
            <div>
              <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em]">AWS Partner Integration</h2>
              <p className="text-figma-base text-fw-bodyLight">Direct Connect via AWS Marketplace</p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Info className="h-4 w-4" />}
          onClick={handleViewWorkflow}
        >
          View Workflow
        </Button>
      </div>

      {/* Hero Banner */}
      <div className="bg-fw-wash border border-fw-secondary rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-fw-base rounded-full border border-fw-secondary mb-3">
              <Sparkles className="w-4 h-4 text-fw-body" />
              <span className="text-figma-sm font-semibold text-fw-heading">AWS Direct Connect Partner</span>
            </div>
            <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">
              Seamless Connection from AWS Console
            </h3>
            <p className="text-figma-base text-fw-body mb-4">
              Initiate your AT&T NetBond connection directly from the AWS Direct Connect console.
              We'll guide you through site selection, bandwidth allocation, and network configuration.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://console.aws.amazon.com/directconnect"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-fw-active text-white no-rounded rounded-lg hover:bg-fw-linkHover transition-colors font-medium text-figma-base tracking-[-0.03em]"
              >
                Open AWS Console
                <ExternalLink className="w-4 h-4" />
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewWorkflow}
              >
                Learn How It Works
              </Button>
            </div>
          </div>
          <div className="bg-fw-base rounded-lg border border-fw-secondary p-4">
            <div className="text-figma-sm font-semibold text-fw-bodyLight uppercase tracking-wider mb-3">Integration Flow</div>
            <div className="space-y-3">
              {[
                { icon: Cloud, label: 'AWS Console', desc: 'Select AT&T as partner' },
                { icon: ArrowRight, label: 'API Handoff', desc: 'AWS sends details to AT&T' },
                { icon: Network, label: 'NetBond Config', desc: 'Configure sites & routing' },
                { icon: Building2, label: 'Business Center', desc: 'Billing & provisioning' },
                { icon: CheckCircle2, label: 'Complete', desc: 'Connection activated' }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-fw-wash border border-fw-secondary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-fw-bodyLight" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-figma-sm font-semibold text-fw-heading">{step.label}</div>
                      <div className="text-figma-sm text-fw-bodyLight">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Connections */}
      {pendingConnections.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-figma-lg font-semibold text-fw-heading tracking-[-0.03em]">
              Pending AWS Connections
              <span className="ml-2 px-2 py-1 bg-fw-warn/10 text-fw-warn rounded-full text-figma-sm font-semibold">
                {pendingConnections.length}
              </span>
            </h3>
          </div>
          <div className="space-y-3">
            {pendingConnections.map((connection) => (
              <div
                key={connection.id}
                className="bg-fw-base border border-fw-warn/30 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-fw-warn/10 border border-fw-warn/30 flex items-center justify-center flex-shrink-0">
                        <Cloud className="w-5 h-5 text-fw-warn" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-fw-heading">{connection.connectionName}</h4>
                        <p className="text-figma-sm text-fw-bodyLight">Request ID: {connection.requestId}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div>
                        <div className="text-figma-sm text-fw-bodyLight">AWS Region</div>
                        <div className="text-figma-base font-medium text-fw-heading">{connection.region}</div>
                      </div>
                      <div>
                        <div className="text-figma-sm text-fw-bodyLight">Bandwidth</div>
                        <div className="text-figma-base font-medium text-fw-heading">{connection.bandwidth}</div>
                      </div>
                      <div>
                        <div className="text-figma-sm text-fw-bodyLight">Customer Email</div>
                        <div className="text-figma-base font-medium text-fw-heading">{connection.customerEmail}</div>
                      </div>
                      <div>
                        <div className="text-figma-sm text-fw-bodyLight">Status</div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-fw-warn/10 text-fw-warn rounded-md text-figma-sm font-semibold">
                          <div className="w-1.5 h-1.5 bg-fw-warn rounded-full animate-pulse"></div>
                          Awaiting Configuration
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleConfigureConnection(connection)}
                  >
                    Configure Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benefits Grid */}
      <div>
        <h3 className="text-figma-lg font-semibold text-fw-heading tracking-[-0.03em] mb-4">Why Connect via AWS?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-fw-base border border-fw-secondary rounded-lg p-4">
            <div className="w-10 h-10 rounded-lg bg-fw-wash border border-fw-secondary flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-fw-link" />
            </div>
            <h4 className="font-semibold text-fw-heading mb-2">Streamlined Onboarding</h4>
            <p className="text-figma-base text-fw-bodyLight">
              Start from AWS Console, complete configuration in NetBond portal. No duplicate data entry required.
            </p>
          </div>
          <div className="bg-fw-base border border-fw-secondary rounded-lg p-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-fw-success" />
            </div>
            <h4 className="font-semibold text-fw-heading mb-2">Unified Billing</h4>
            <p className="text-figma-base text-fw-bodyLight">
              Transparent pricing displayed in AWS Console before approval. All costs clearly outlined upfront.
            </p>
          </div>
          <div className="bg-fw-base border border-fw-secondary rounded-lg p-4">
            <div className="w-10 h-10 rounded-lg bg-fw-wash border border-fw-secondary flex items-center justify-center mb-3">
              <Network className="w-5 h-5 text-fw-purple" />
            </div>
            <h4 className="font-semibold text-fw-heading mb-2">Multi-Site Connectivity</h4>
            <p className="text-figma-base text-fw-bodyLight">
              Configure connections across multiple AT&T NetBond locations with flexible bandwidth allocation.
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-fw-wash border border-fw-secondary rounded-lg p-6">
        <h3 className="text-figma-lg font-semibold text-fw-heading tracking-[-0.03em] mb-4">Getting Started</h3>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-fw-primary text-white flex items-center justify-center text-figma-sm font-semibold">
              1
            </div>
            <div>
              <div className="font-medium text-fw-heading">Navigate to AWS Direct Connect</div>
              <div className="text-figma-base text-fw-bodyLight">
                In AWS Console: Networking & Content Delivery → Direct Connect → Create Connection
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-fw-primary text-white flex items-center justify-center text-figma-sm font-semibold">
              2
            </div>
            <div>
              <div className="font-medium text-fw-heading">Select AT&T as Partner</div>
              <div className="text-figma-base text-fw-bodyLight">
                Choose AT&T NetBond from the partner list and submit your connection request
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-fw-primary text-white flex items-center justify-center text-figma-sm font-semibold">
              3
            </div>
            <div>
              <div className="font-medium text-fw-heading">Configure in NetBond Portal</div>
              <div className="text-figma-base text-fw-bodyLight">
                You'll receive an email to complete network configuration. Your connection will appear above.
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-fw-primary text-white flex items-center justify-center text-figma-sm font-semibold">
              4
            </div>
            <div>
              <div className="font-medium text-fw-heading">Review & Approve</div>
              <div className="text-figma-base text-fw-bodyLight">
                Review pricing in AWS Console and approve to begin provisioning
              </div>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
