import { useState } from 'react';
import { CheckCircle2, ExternalLink, Shield, Server, Wifi, Bell, Mail, AlertTriangle, Activity, DollarSign } from 'lucide-react';
import { SideDrawer } from '../../common/SideDrawer';
import { Button } from '../../common/Button';
import { LMCCConnection, LMCCOnboardingConfig } from '../../../types/lmcc';
import { formatBandwidth, CURRENT_PHASE } from '../../../data/lmccService';

interface LMCCOnboardingDrawerProps {
  connection: LMCCConnection;
  isOpen: boolean;
  onClose: () => void;
  onActivate: (config: LMCCOnboardingConfig) => void;
}

const STEP_LABELS = ['Connection Status', 'NetBond Configuration', 'Monitoring', 'Review & Activate'];

export function LMCCOnboardingDrawer({ connection, isOpen, onClose, onActivate }: LMCCOnboardingDrawerProps) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<LMCCOnboardingConfig>({
    cloudRouterName: '',
    contractType: 'trial',
    transport: 'mpls',
    vifType: 'private',
    customerASN: 65000,
    bgpMd5Key: '',
    pathPreference: 'active-active',
    alerts: { bgpPathDown: true, bfdFailover: true, contractExpiry: true, pathAsymmetry: false },
    notifications: { email: '', slack: false, pagerduty: false },
    billingAcknowledged: false,
  });

  const updateConfig = (updates: Partial<LMCCOnboardingConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Connection status is read-only
      case 1: return config.cloudRouterName.trim().length > 0 && config.customerASN > 0;
      case 2: return true; // Monitoring is optional
      case 3: return config.billingAcknowledged;
      default: return false;
    }
  };

  // Per-path cost from LMCC pricing
  const perPathCost = 1249; // 1 Gbps tier
  const monthlyCost = perPathCost * 4;

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title="AWS Max Onboarding" width="lg">
      <div className="space-y-6">
        {/* AWS branding */}
        <div className="flex items-center gap-3 pb-3 border-b border-fw-secondary">
          <div className="w-10 h-7 rounded-lg bg-fw-base border border-fw-secondary flex items-center justify-center p-1">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-figma-sm font-semibold text-fw-heading">AWS Direct Connect - Maximum Resiliency</p>
            <p className="text-figma-xs text-fw-bodyLight">AT&T NetBond Advanced Max</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1 rounded-full ${i <= step ? 'bg-fw-primary' : 'bg-fw-secondary'}`} />
              <p className={`text-[10px] mt-1 ${i === step ? 'text-fw-link font-medium' : 'text-fw-bodyLight'}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Step 1: Connection Status */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-fw-link" />
              <h4 className="text-figma-base font-semibold text-fw-heading">Connection Status</h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[10px] font-medium" style={{ color: '#cc7a00', backgroundColor: 'rgba(204,122,0,0.16)' }}>
                Pending Acceptance
              </span>
            </div>

            <div className="p-4 rounded-xl bg-fw-wash border border-fw-secondary">
              <div className="grid grid-cols-2 gap-3 text-figma-xs mb-3">
                <div><span className="text-fw-bodyLight">AWS Account</span><p className="font-medium text-fw-heading">{connection.awsAccountId}</p></div>
                <div><span className="text-fw-bodyLight">Metro</span><p className="font-medium text-fw-heading">{connection.metro.name}</p></div>
                <div><span className="text-fw-bodyLight">Bandwidth</span><p className="font-medium text-fw-heading">{formatBandwidth(connection.bandwidth)} per path</p></div>
                <div><span className="text-fw-bodyLight">Transport</span><p className="font-medium text-fw-heading">{connection.transport.toUpperCase()}</p></div>
              </div>
            </div>

            {/* 4 paths with acceptance status */}
            <div className="space-y-2">
              <p className="text-figma-xs font-semibold text-fw-heading">4 Hosted Connections</p>
              {connection.paths.map((path, i) => (
                <div key={path.id} className="flex items-center justify-between p-3 rounded-lg border border-fw-secondary">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${path.status === 'active' ? 'bg-fw-success' : 'bg-fw-warn animate-pulse'}`} />
                    <div>
                      <p className="text-figma-xs font-medium text-fw-heading">{path.datacenter} - {path.ipeId}</p>
                      <p className="text-figma-xs text-fw-bodyLight">{path.awsConnectionId} - VLAN {path.vlanId}</p>
                    </div>
                  </div>
                  <span className={`text-figma-xs font-medium ${path.status === 'active' ? 'text-fw-success' : 'text-fw-warn'}`}>
                    {path.status === 'active' ? 'Accepted' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="https://console.aws.amazon.com/directconnect/v2/home#/connections"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-fw-active text-white rounded-lg hover:bg-fw-linkHover transition-colors font-medium text-figma-xs w-full justify-center"
            >
              Open AWS Console to Accept Connections
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Step 2: NetBond Configuration */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-figma-base font-semibold text-fw-heading">NetBond Configuration</h4>

            <div>
              <label className="block text-figma-xs font-medium text-fw-body mb-1">Cloud Router Name</label>
              <input
                type="text"
                value={config.cloudRouterName}
                onChange={(e) => updateConfig({ cloudRouterName: e.target.value })}
                placeholder="e.g., AWSMax-Production-SanJose"
                className="w-full h-9 px-3 rounded-lg border border-fw-secondary text-figma-base focus:border-fw-active focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-figma-xs font-medium text-fw-body mb-1">
                  Contract Term
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium" style={{ color: '#cc7a00', backgroundColor: 'rgba(204,122,0,0.12)' }}>June</span>
                </label>
                <select
                  value={config.contractType}
                  onChange={(e) => updateConfig({ contractType: e.target.value as any })}
                  className="w-full h-9 px-3 rounded-lg border border-fw-secondary text-figma-base focus:border-fw-active focus:outline-none"
                >
                  <option value="trial">Trial (zero-penalty)</option>
                  <option value="monthly" disabled>Month-to-Month (Nov 2026)</option>
                  <option value="fixed-12" disabled>12 Month (Nov 2026)</option>
                  <option value="fixed-24" disabled>24 Month (Nov 2026)</option>
                  <option value="fixed-36" disabled>36 Month (Nov 2026)</option>
                </select>
              </div>
              <div>
                <label className="block text-figma-xs font-medium text-fw-body mb-1">
                  Transport
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium" style={{ color: '#cc7a00', backgroundColor: 'rgba(204,122,0,0.12)' }}>June</span>
                </label>
                <select
                  value={config.transport}
                  onChange={(e) => updateConfig({ transport: e.target.value as any })}
                  className="w-full h-9 px-3 rounded-lg border border-fw-secondary text-figma-base focus:border-fw-active focus:outline-none"
                >
                  <option value="mpls">MPLS (AT&T AVPN)</option>
                  <option value="internet" disabled>Internet (Nov 2026)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-figma-xs font-medium text-fw-body mb-1">VIF Type (what you created on AWS side)</label>
              <select
                value={config.vifType}
                onChange={(e) => updateConfig({ vifType: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-fw-secondary text-figma-base focus:border-fw-active focus:outline-none"
              >
                <option value="private">Private VIF (VPC access via VGW)</option>
                <option value="transit">Transit VIF (Transit Gateway)</option>
                <option value="public">Public VIF (AWS public services)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-figma-xs font-medium text-fw-body mb-1">Customer BGP ASN</label>
                <input
                  type="number"
                  value={config.customerASN}
                  onChange={(e) => updateConfig({ customerASN: parseInt(e.target.value) || 0 })}
                  className="w-full h-9 px-3 rounded-lg border border-fw-secondary text-figma-base focus:border-fw-active focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-figma-xs font-medium text-fw-body mb-1">BGP MD5 Auth Key</label>
                <input
                  type="password"
                  value={config.bgpMd5Key}
                  onChange={(e) => updateConfig({ bgpMd5Key: e.target.value })}
                  placeholder="Must match AWS side"
                  className="w-full h-9 px-3 rounded-lg border border-fw-secondary text-figma-base focus:border-fw-active focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-figma-xs font-medium text-fw-body mb-2">BGP Path Preference</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'active-active', label: 'Active/Active (ECMP)', desc: 'Equal traffic across all 4 paths' },
                  { value: 'active-passive', label: 'Active/Passive', desc: 'Prefer primary datacenter paths' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateConfig({ pathPreference: opt.value as any })}
                    className={`p-3 border-2 rounded-lg text-left text-figma-xs transition-all ${
                      config.pathPreference === opt.value
                        ? 'border-fw-active bg-fw-accent'
                        : 'border-fw-secondary bg-fw-base hover:border-fw-active/50'
                    }`}
                  >
                    <p className="font-medium text-fw-heading">{opt.label}</p>
                    <p className="text-fw-bodyLight mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Monitoring */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-figma-base font-semibold text-fw-heading">Monitoring Setup</h4>

            <div>
              <p className="text-figma-xs font-medium text-fw-body mb-2">Alert Rules</p>
              <div className="space-y-2">
                {[
                  { key: 'bgpPathDown', label: 'BGP Path Down', desc: 'Alert when any BGP session drops', severity: 'Critical' },
                  { key: 'bfdFailover', label: 'BFD Failover Triggered', desc: 'Sub-second failover detected', severity: 'High' },
                  { key: 'contractExpiry', label: 'Contract Expiration', desc: '30/60/90 day warnings', severity: 'Medium' },
                  { key: 'pathAsymmetry', label: 'Path Asymmetry', desc: 'One path carrying >40% of traffic', severity: 'Low' },
                ].map(alert => (
                  <label key={alert.key} className="flex items-start gap-3 p-3 rounded-lg border border-fw-secondary hover:bg-fw-wash cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.alerts[alert.key as keyof typeof config.alerts]}
                      onChange={(e) => updateConfig({ alerts: { ...config.alerts, [alert.key]: e.target.checked } })}
                      className="mt-0.5 h-4 w-4 rounded border-fw-secondary text-fw-link focus:ring-fw-active"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-figma-xs font-medium text-fw-heading">{alert.label}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                          alert.severity === 'Critical' ? 'bg-fw-errorLight text-fw-error' :
                          alert.severity === 'High' ? 'bg-fw-warn/10 text-fw-warn' :
                          alert.severity === 'Medium' ? 'bg-fw-accent text-fw-link' :
                          'bg-fw-wash text-fw-bodyLight'
                        }`}>{alert.severity}</span>
                      </div>
                      <p className="text-figma-xs text-fw-bodyLight">{alert.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-figma-xs font-medium text-fw-body mb-2">Notification Channels</p>
              <div className="space-y-2">
                <div>
                  <label className="block text-figma-xs text-fw-bodyLight mb-1">Email</label>
                  <input
                    type="email"
                    value={config.notifications.email}
                    onChange={(e) => updateConfig({ notifications: { ...config.notifications, email: e.target.value } })}
                    placeholder="admin@company.com"
                    className="w-full h-9 px-3 rounded-lg border border-fw-secondary text-figma-base focus:border-fw-active focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.notifications.slack}
                      onChange={(e) => updateConfig({ notifications: { ...config.notifications, slack: e.target.checked } })}
                      className="h-4 w-4 rounded border-fw-secondary text-fw-link"
                    />
                    <span className="text-figma-xs text-fw-body">Slack</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.notifications.pagerduty}
                      onChange={(e) => updateConfig({ notifications: { ...config.notifications, pagerduty: e.target.checked } })}
                      className="h-4 w-4 rounded border-fw-secondary text-fw-link"
                    />
                    <span className="text-figma-xs text-fw-body">PagerDuty</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Activate */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-figma-base font-semibold text-fw-heading">Review & Activate</h4>

            <div className="p-4 rounded-xl bg-fw-wash border border-fw-secondary space-y-2 text-figma-xs">
              <div className="flex justify-between"><span className="text-fw-bodyLight">Cloud Router</span><span className="font-medium text-fw-heading">{config.cloudRouterName || 'Not named'}</span></div>
              <div className="flex justify-between"><span className="text-fw-bodyLight">Metro</span><span className="font-medium text-fw-heading">{connection.metro.name}</span></div>
              <div className="flex justify-between"><span className="text-fw-bodyLight">Datacenters</span><span className="font-medium text-fw-heading">{connection.metro.datacenters.join(' + ')}</span></div>
              <div className="flex justify-between"><span className="text-fw-bodyLight">Paths</span><span className="font-medium text-fw-heading">4 x {formatBandwidth(connection.bandwidth)}</span></div>
              <div className="flex justify-between"><span className="text-fw-bodyLight">Contract</span><span className="font-medium text-fw-heading">{config.contractType === 'trial' ? 'Trial (zero-penalty)' : config.contractType}</span></div>
              <div className="flex justify-between"><span className="text-fw-bodyLight">Transport</span><span className="font-medium text-fw-heading">{config.transport === 'mpls' ? 'MPLS (AT&T AVPN)' : 'Internet'}</span></div>
              <div className="flex justify-between"><span className="text-fw-bodyLight">VIF Type</span><span className="font-medium text-fw-heading capitalize">{config.vifType} VIF</span></div>
              <div className="flex justify-between"><span className="text-fw-bodyLight">Customer ASN</span><span className="font-medium text-fw-heading">{config.customerASN}</span></div>
              <div className="flex justify-between"><span className="text-fw-bodyLight">BGP Auth</span><span className="font-medium text-fw-heading">{config.bgpMd5Key ? 'MD5 configured' : 'None'}</span></div>
              <div className="flex justify-between"><span className="text-fw-bodyLight">Path Preference</span><span className="font-medium text-fw-heading">{config.pathPreference === 'active-active' ? 'Active/Active (ECMP)' : 'Active/Passive'}</span></div>
            </div>

            {/* Billing */}
            <div className="p-4 rounded-xl border-2 border-fw-active/30 bg-fw-accent">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-fw-link" />
                <span className="text-figma-sm font-semibold text-fw-heading">Billing Summary</span>
              </div>
              <div className="space-y-1.5 text-figma-xs">
                <div className="flex justify-between"><span className="text-fw-bodyLight">{formatBandwidth(connection.bandwidth)} x 4 paths</span><span className="font-medium text-fw-heading">${monthlyCost.toLocaleString()}.00/mo</span></div>
                <div className="flex justify-between"><span className="text-fw-bodyLight">MPLS Transport</span><span className="font-medium text-fw-heading">Included</span></div>
                <div className="flex justify-between"><span className="text-fw-bodyLight">Trial Contract</span><span className="font-medium text-fw-heading">Zero-penalty disconnect</span></div>
                <div className="pt-2 border-t border-fw-active/20 flex justify-between">
                  <span className="font-semibold text-fw-heading">Estimated Monthly</span>
                  <span className="font-bold text-fw-link">${monthlyCost.toLocaleString()}.00</span>
                </div>
              </div>
              <p className="text-figma-xs text-fw-bodyLight mt-2">Billing starts when BGP reaches "Established" state.</p>
            </div>

            {/* Billing acknowledgment */}
            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-fw-secondary hover:border-fw-active/50 cursor-pointer">
              <input
                type="checkbox"
                checked={config.billingAcknowledged}
                onChange={(e) => updateConfig({ billingAcknowledged: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-fw-secondary text-fw-link focus:ring-fw-active"
              />
              <p className="text-figma-xs text-fw-body">
                I acknowledge that billing begins when BGP sessions establish across all 4 paths. Preview phase uses fixed-rate billing. GA (November 2026) transitions to 95th percentile burstable billing.
              </p>
            </label>
          </div>
        )}

        {/* Footer navigation */}
        <div className="pt-4 border-t border-fw-secondary flex items-center justify-between">
          {step > 0 ? (
            <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>Back</Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          )}

          {step < 3 ? (
            <Button variant="primary" size="sm" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onActivate(config)}
              disabled={!canProceed()}
            >
              <Activity className="w-4 h-4 mr-1" />
              Activate Connection
            </Button>
          )}
        </div>
      </div>
    </SideDrawer>
  );
}
