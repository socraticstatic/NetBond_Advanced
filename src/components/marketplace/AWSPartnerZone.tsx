import { useState } from 'react';
import { Cloud, ArrowRight, CheckCircle2, ExternalLink, Info, Sparkles, Network, Building2, Shield, X, Server, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { LMCCStatusPanel } from '../connection/lmcc/LMCCStatusPanel';
import { MOCK_LMCC_CONNECTIONS, LMCC_METROS, formatBandwidth, CURRENT_PHASE, LMCC_PHASES, getPhaseTag, PHASE_DATES } from '../../data/lmccService';
import { LMCCConnection, LMCCMetro, LMCCOnboardingConfig } from '../../types/lmcc';
import { SideDrawer } from '../common/SideDrawer';
import { LMCCKickoffModal } from '../connection/lmcc/LMCCKickoffModal';
import { LMCCOnboardingDrawer } from '../connection/lmcc/LMCCOnboardingDrawer';

export function AWSPartnerZone() {
  const navigate = useNavigate();
  const [lmccConnections] = useState<LMCCConnection[]>(MOCK_LMCC_CONNECTIONS);
  const [expandedLmcc, setExpandedLmcc] = useState<string | null>(null);
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [selectedMetro, setSelectedMetro] = useState<LMCCMetro | null>(null);
  const [prereqChecks, setPrereqChecks] = useState({ awsAccount: false, enterpriseSupport: false, wellArchitected: false });

  // Onboarding flow for AWS-initiated connections
  const [kickoffConnection, setKickoffConnection] = useState<LMCCConnection | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartSetup = () => {
    setKickoffConnection(prev => prev); // keep the connection
    setShowOnboarding(true);
  };

  const handleActivate = (config: LMCCOnboardingConfig) => {
    setShowOnboarding(false);
    setKickoffConnection(null);
    window.addToast?.({
      type: 'success',
      title: 'LMCC Connection Activated',
      message: `${config.cloudRouterName} is now active with 4 paths in ${kickoffConnection?.metro.name}.`,
      duration: 5000,
    });
  };

  const activeConnections = lmccConnections.filter(c => c.status === 'active');
  const pendingConnections = lmccConnections.filter(c => c.status === 'pending-acceptance' || c.status === 'provisioning');

  const handleViewWorkflow = () => {
    navigate('/aws-workflow');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-fw-base border border-fw-secondary flex items-center justify-center p-1.5">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
                alt="AWS"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em]">AWS Partner Integration</h2>
              <p className="text-figma-base text-fw-bodyLight">LMCC (Last Mile Cloud Connectivity) via AWS Direct Connect</p>
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
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-8 h-4 object-contain" />
              <Shield className="w-4 h-4 text-fw-body" />
              <span className="text-figma-sm font-semibold text-fw-heading">Maximum Resiliency - LMCC</span>
            </div>
            <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">
              4-Path Automated Interconnect
            </h3>
            <p className="text-figma-base text-fw-body mb-4">
              AT&T LMCC auto-provisions 4 hosted connections across 4 IPEs in 2 diverse datacenters within your selected metro. Initiated from the AWS Console - AT&T handles the rest.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowInitiateModal(true)}
              >
                Initiate LMCC Connection
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
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
            <div className="text-figma-sm font-semibold text-fw-bodyLight uppercase tracking-wider mb-3">Customer Flow</div>
            <div className="space-y-3">
              {[
                { icon: Cloud, label: '1. AWS Console', desc: 'Select Maximum Resiliency + Metro' },
                { icon: Sparkles, label: '2. Choose AT&T', desc: 'Select AT&T as Direct Connect Partner' },
                { icon: Network, label: '3. Auto-Provision', desc: 'AT&T provisions 4 hosted connections' },
                { icon: CheckCircle2, label: '4. Accept in AWS', desc: 'Click Accept on each of 4 connections' },
                { icon: Building2, label: '5. BGP Establishes', desc: 'Billing starts, connection goes Active' },
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

      {/* Active LMCC Connections */}
      {activeConnections.length > 0 && (
        <div>
          <h3 className="text-figma-lg font-semibold text-fw-heading tracking-[-0.03em] mb-4">
            Active LMCC Connections
            <span className="ml-2 px-2 py-1 bg-fw-successLight text-fw-success rounded-full text-figma-sm font-semibold">
              {activeConnections.length}
            </span>
          </h3>
          <div className="space-y-4">
            {activeConnections.map((conn) => (
              <div key={conn.id} className="border border-fw-secondary rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedLmcc(expandedLmcc === conn.id ? null : conn.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-fw-wash transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-fw-base border border-fw-secondary flex items-center justify-center p-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left">
                      <p className="text-figma-base font-semibold text-fw-heading">{conn.metro.name}</p>
                      <p className="text-figma-sm text-fw-bodyLight">
                        {conn.paths.filter(p => p.status === 'active').length}/4 paths - AWS Account: {conn.awsAccountId}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-fw-bodyLight transition-transform ${expandedLmcc === conn.id ? 'rotate-90' : ''}`} />
                </button>
                {expandedLmcc === conn.id && (
                  <div className="px-5 pb-5 border-t border-fw-secondary pt-4">
                    <LMCCStatusPanel connection={conn} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending LMCC Connections */}
      {pendingConnections.length > 0 && (
        <div>
          <h3 className="text-figma-lg font-semibold text-fw-heading tracking-[-0.03em] mb-4">
            Pending LMCC Connections
            <span className="ml-2 px-2 py-1 bg-fw-warn/10 text-fw-warn rounded-full text-figma-sm font-semibold">
              {pendingConnections.length}
            </span>
          </h3>
          <div className="space-y-3">
            {pendingConnections.map((conn) => (
              <div
                key={conn.id}
                className="bg-fw-base border border-fw-warn/30 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-fw-base border border-fw-warn/30 flex items-center justify-center flex-shrink-0 p-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-semibold text-fw-heading">{conn.metro.name}</p>
                      <p className="text-figma-sm text-fw-bodyLight">
                        AWS Account: {conn.awsAccountId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-fw-warn/10 text-fw-warn rounded-md text-figma-sm font-semibold">
                      <div className="w-1.5 h-1.5 bg-fw-warn rounded-full animate-pulse" />
                      Awaiting Acceptance in AWS Console
                    </div>
                    <p className="text-figma-xs text-fw-bodyLight mt-1">
                      4 connections pending - Customer must click Accept on each
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {conn.paths.map((path) => (
                    <div key={path.id} className="p-2 rounded-lg bg-fw-wash border border-fw-secondary text-center">
                      <p className="text-figma-xs font-medium text-fw-heading">{path.datacenter}</p>
                      <p className="text-figma-xs text-fw-bodyLight">{path.awsConnectionId}</p>
                      <p className="text-figma-xs text-fw-warn mt-0.5">Pending</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setKickoffConnection(conn)}
                  >
                    Configure
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border-2 border-fw-warn/30 bg-fw-base overflow-hidden">
          <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: 'rgba(204,122,0,0.08)' }}>
            <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[10px] font-medium" style={{ color: '#cc7a00', backgroundColor: 'rgba(204,122,0,0.16)' }}>Current</span>
            <span className="text-figma-sm font-semibold text-fw-heading">Preview - {PHASE_DATES.preview}</span>
          </div>
          <div className="p-4 space-y-2 text-figma-xs text-fw-body">
            <div className="flex justify-between"><span className="text-fw-bodyLight">Metros</span><span className="font-medium">San Jose + Los Angeles</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Facilities</span><span className="font-medium">Equinix only</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Bandwidth</span><span className="font-medium">Fixed 1 Gbps</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Contracts</span><span className="font-medium">Trial (zero-penalty)</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Transport</span><span className="font-medium">MPLS (AVPN)</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Billing</span><span className="font-medium">Fixed rate</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Operations</span><span className="font-medium">Create + Delete</span></div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-fw-success/30 bg-fw-base overflow-hidden">
          <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: 'rgba(45,126,36,0.08)' }}>
            <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[10px] font-medium" style={{ color: '#2d7e24', backgroundColor: 'rgba(45,126,36,0.16)' }}>Upcoming</span>
            <span className="text-figma-sm font-semibold text-fw-heading">GA - {PHASE_DATES.ga}</span>
          </div>
          <div className="p-4 space-y-2 text-figma-xs text-fw-body">
            <div className="flex justify-between"><span className="text-fw-bodyLight">Metros</span><span className="font-medium">+ Ashburn, VA</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Facilities</span><span className="font-medium">Equinix + CoreSite</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Bandwidth</span><span className="font-medium">50 Mbps - 100 Gbps</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Contracts</span><span className="font-medium">M2M, 12, 24, 36 month</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Transport</span><span className="font-medium">MPLS + Internet</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Billing</span><span className="font-medium">95th percentile burstable</span></div>
            <div className="flex justify-between"><span className="text-fw-bodyLight">Operations</span><span className="font-medium">Full CRUD</span></div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-fw-wash border border-fw-secondary rounded-lg p-6">
        <h3 className="text-figma-lg font-semibold text-fw-heading tracking-[-0.03em] mb-4">Getting Started with LMCC</h3>
        <ol className="space-y-3">
          {[
            { title: 'Navigate to AWS Direct Connect', desc: 'In AWS Console: Networking & Content Delivery - Direct Connect - Create Connection' },
            { title: 'Select Maximum Resiliency', desc: 'Choose Maximum Resiliency and select your preferred metro (San Jose or Los Angeles)' },
            { title: 'Choose AT&T as Partner', desc: 'Select AT&T NetBond from the partner list. AT&T auto-detects the request via AWS Partner API.' },
            { title: 'AT&T Auto-Provisions', desc: 'AT&T validates your AWS Account ID, checks metro capacity, and provisions 4 hosted connections across 4 IPEs in 2 diverse sites.' },
            { title: 'Accept in AWS Console', desc: '4 "Pending" connections appear in your AWS Console. Click Accept on each one.' },
            { title: 'Create Virtual Interfaces', desc: 'Create a Private VIF, Transit VIF, or Public VIF on each accepted connection to route traffic to your VPCs.' },
            { title: 'BGP Establishes', desc: 'AT&T configures 802.1Q sub-interfaces with AWS-assigned VLAN IDs. BGP/BFD sessions establish. Billing starts.' },
            { title: 'Connection Active', desc: 'Your LMCC connection appears here in NetBond Advanced as "Active" with 4-path health monitoring.' },
          ].map((step, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-fw-primary text-white flex items-center justify-center text-figma-sm font-semibold">
                {idx + 1}
              </div>
              <div>
                <div className="font-medium text-fw-heading">{step.title}</div>
                <div className="text-figma-base text-fw-bodyLight">{step.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      {/* Initiate LMCC Modal */}
      <SideDrawer
        isOpen={showInitiateModal}
        onClose={() => { setShowInitiateModal(false); setSelectedMetro(null); }}
        title="Initiate LMCC Connection"
        width="lg"
      >
        <div className="space-y-6">
          {/* AWS branding header */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-fw-wash border border-fw-secondary">
            <div className="w-14 h-10 rounded-lg bg-fw-base border border-fw-secondary flex items-center justify-center p-1.5">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-figma-sm font-semibold text-fw-heading">AWS Direct Connect - Maximum Resiliency</p>
              <p className="text-figma-xs text-fw-bodyLight">AT&T LMCC (Last Mile Cloud Connectivity)</p>
            </div>
          </div>

          {/* Step 1: Select Metro */}
          <div>
            <h4 className="text-figma-base font-semibold text-fw-heading mb-1">1. Select Your Metro</h4>
            <p className="text-figma-xs text-fw-bodyLight mb-3">
              Each metro has 2 diverse datacenter sites. AT&T provisions 4 connections (2 per site) automatically.
            </p>
            <div className="space-y-2">
              {LMCC_METROS.map(metro => {
                const isGaOnly = metro.phase === 'ga' && CURRENT_PHASE === 'preview';
                const phaseTag = getPhaseTag(metro.phase);
                return (
                <button
                  key={metro.id}
                  disabled={isGaOnly}
                  onClick={() => !isGaOnly && setSelectedMetro(metro)}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                    isGaOnly
                      ? 'border-fw-secondary bg-fw-wash cursor-not-allowed opacity-60'
                      : selectedMetro?.id === metro.id
                        ? 'border-fw-active bg-fw-accent'
                        : 'border-fw-secondary bg-fw-base hover:border-fw-active/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className={`h-4 w-4 ${isGaOnly ? 'text-fw-disabled' : selectedMetro?.id === metro.id ? 'text-fw-link' : 'text-fw-bodyLight'}`} />
                      <span className={`text-figma-sm font-semibold ${isGaOnly ? 'text-fw-disabled' : 'text-fw-heading'}`}>{metro.name}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium" style={{ color: phaseTag.color, backgroundColor: phaseTag.bg }}>{phaseTag.label}</span>
                    </div>
                    {selectedMetro?.id === metro.id && !isGaOnly && <CheckCircle2 className="h-4 w-4 text-fw-link" />}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {metro.datacenters.map((dc, i) => (
                      <div key={dc} className="flex items-center gap-1.5 p-1.5 rounded bg-fw-wash text-figma-xs text-fw-bodyLight">
                        <Server className="h-3 w-3" />
                        <span>{dc}</span>
                        <span className="text-fw-disabled">- Site {i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <p className={`text-figma-xs mt-1.5 ${isGaOnly ? 'text-fw-disabled' : 'text-fw-bodyLight'}`}>{metro.facilities.join(' + ')}</p>
                </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Preview Phase Details */}
          <div className="p-4 rounded-xl bg-fw-wash border border-fw-secondary">
            <h4 className="text-figma-base font-semibold text-fw-heading mb-2">Preview Phase Details</h4>
            <div className="grid grid-cols-2 gap-3 text-figma-xs">
              <div>
                <span className="text-fw-bodyLight">Bandwidth</span>
                <p className="font-medium text-fw-heading">Fixed 1 Gbps per path</p>
              </div>
              <div>
                <span className="text-fw-bodyLight">Contract</span>
                <p className="font-medium text-fw-heading">Trial (zero-penalty)</p>
              </div>
              <div>
                <span className="text-fw-bodyLight">Transport</span>
                <p className="font-medium text-fw-heading">MPLS (AT&T AVPN)</p>
              </div>
              <div>
                <span className="text-fw-bodyLight">Operations</span>
                <p className="font-medium text-fw-heading">Create & Delete only</p>
              </div>
            </div>
          </div>

          {/* Step 3: Prerequisites Checklist */}
          <div>
            <h4 className="text-figma-base font-semibold text-fw-heading mb-3">2. Prerequisites Checklist</h4>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-fw-secondary hover:bg-fw-wash cursor-pointer">
                <input
                  type="checkbox"
                  checked={prereqChecks.awsAccount}
                  onChange={(e) => setPrereqChecks(prev => ({ ...prev, awsAccount: e.target.checked }))}
                  className="mt-0.5 h-4 w-4 rounded border-fw-secondary text-fw-link focus:ring-fw-active"
                />
                <div>
                  <p className="text-figma-sm font-medium text-fw-heading">AWS Account with Direct Connect access</p>
                  <p className="text-figma-xs text-fw-bodyLight">You'll need your AWS Account ID to initiate the connection</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-lg border border-fw-secondary hover:bg-fw-wash cursor-pointer">
                <input
                  type="checkbox"
                  checked={prereqChecks.enterpriseSupport}
                  onChange={(e) => setPrereqChecks(prev => ({ ...prev, enterpriseSupport: e.target.checked }))}
                  className="mt-0.5 h-4 w-4 rounded border-fw-secondary text-fw-link focus:ring-fw-active"
                />
                <div>
                  <p className="text-figma-sm font-medium text-fw-heading">AWS Enterprise Support plan</p>
                  <p className="text-figma-xs text-fw-bodyLight">Required for 99.99% SLA eligibility</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-lg border border-fw-secondary hover:bg-fw-wash cursor-pointer">
                <input
                  type="checkbox"
                  checked={prereqChecks.wellArchitected}
                  onChange={(e) => setPrereqChecks(prev => ({ ...prev, wellArchitected: e.target.checked }))}
                  className="mt-0.5 h-4 w-4 rounded border-fw-secondary text-fw-link focus:ring-fw-active"
                />
                <div>
                  <p className="text-figma-sm font-medium text-fw-heading">Well-Architected Review completed</p>
                  <p className="text-figma-xs text-fw-bodyLight">Complete with an AWS Solutions Architect for SLA coverage</p>
                </div>
              </label>
            </div>
          </div>

          {/* SLA Warning if missing prereqs */}
          {selectedMetro && (!prereqChecks.enterpriseSupport || !prereqChecks.wellArchitected) && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-fw-warningLight border border-fw-warning">
              <AlertTriangle className="h-4 w-4 text-fw-warning shrink-0 mt-0.5" />
              <p className="text-figma-xs text-fw-body">
                Without Enterprise Support and a Well-Architected Review, the 99.99% SLA will not apply. You can still provision LMCC but won't have SLA coverage.
              </p>
            </div>
          )}

          {/* Step 4: What Happens Next */}
          <div>
            <h4 className="text-figma-base font-semibold text-fw-heading mb-3">3. What Happens Next</h4>
            <div className="space-y-2">
              {[
                { step: '1', text: 'You\'ll be redirected to AWS Direct Connect console' },
                { step: '2', text: 'Select "Maximum Resiliency" and your metro' },
                { step: '3', text: 'Choose "AT&T" as your Direct Connect Partner' },
                { step: '4', text: 'AT&T auto-provisions 4 hosted connections in ~15 minutes' },
                { step: '5', text: '4 "Pending" connections appear in your AWS Console' },
                { step: '6', text: 'Accept each connection, then create Virtual Interfaces' },
                { step: '7', text: 'BGP establishes, billing starts, connection goes Active here' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-fw-primary text-white flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <p className="text-figma-xs text-fw-body">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-fw-secondary flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => { setShowInitiateModal(false); setSelectedMetro(null); }}>
              Cancel
            </Button>
            <a
              href="https://console.aws.amazon.com/directconnect/v2/home#/connections/create"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-figma-base transition-colors ${
                selectedMetro && prereqChecks.awsAccount
                  ? 'bg-fw-active text-white hover:bg-fw-linkHover'
                  : 'bg-fw-disabled text-fw-disabled cursor-not-allowed pointer-events-none'
              }`}
            >
              Continue to AWS Console
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </SideDrawer>

      {/* LMCC Kickoff Modal - appears when Configure is clicked on a pending connection */}
      {kickoffConnection && !showOnboarding && (
        <LMCCKickoffModal
          connection={kickoffConnection}
          isOpen={true}
          onClose={() => setKickoffConnection(null)}
          onStartSetup={handleStartSetup}
        />
      )}

      {/* LMCC Onboarding Drawer - 4-step configuration after kickoff */}
      {kickoffConnection && showOnboarding && (
        <LMCCOnboardingDrawer
          connection={kickoffConnection}
          isOpen={true}
          onClose={() => { setShowOnboarding(false); setKickoffConnection(null); }}
          onActivate={handleActivate}
        />
      )}
    </div>
  );
}
