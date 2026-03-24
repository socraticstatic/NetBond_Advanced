import { useState } from 'react';
import { flushSync } from 'react-dom';
import { Network, Settings, Zap, Shield, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Connection } from '../../../types/connection';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { FormField } from '../../form/FormField';

interface AWSPendingConfigModalProps {
  connection: Connection;
  isOpen: boolean;
  onClose: () => void;
  onActivate: (config: any) => void;
}

type ConnectionTypeOption = 'internet-to-cloud' | 'vpn-to-cloud';
type ConfigMode = 'simple' | 'advanced';

export function AWSPendingConfigModal({ connection, isOpen, onClose, onActivate }: AWSPendingConfigModalProps) {
  const [step, setStep] = useState<'type-selection' | 'configuration'>('type-selection');
  const [selectedType, setSelectedType] = useState<ConnectionTypeOption | null>(null);
  const [configMode, setConfigMode] = useState<ConfigMode>('simple');

  // Extract AWS metadata
  const awsRegion = connection.origin?.metadata?.region || 'us-east-1';
  const awsBandwidth = connection.bandwidth || '10 Gbps';
  const awsConnectionId = connection.origin?.metadata?.awsConnectionId || 'dxcon-xxxxx';

  const [config, setConfig] = useState({
    internetSubnets: ['0.0.0.0/0'],
    stackType: 'ipv4' as 'ipv4' | 'ipv6' | 'dual',
    bfdEnabled: false,
    qosClassifier: 'best-effort',
    peerAsnType: 'public',
    peerAsnRange: 'Public ASN range: 1-64511',
    l3mtu: 1500,
    vifType: 'private' as 'private' | 'public' | 'transit',
    serviceAccessType: 'internet' as 'internet' | 'l3vpn' | 'restricted'
  });

  const handleTypeSelect = (type: ConnectionTypeOption) => {
    setSelectedType(type);
    setStep('configuration');
  };

  const handleBack = () => {
    setStep('type-selection');
    setSelectedType(null);
  };

  const handleActivate = () => {
    flushSync(() => {
      onClose();
    });
    onActivate({
      connectionType: selectedType,
      ...config
    });
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  /* Shared input class - Figma: h-9, r=8, border #686e74 */
  const inputClass = 'w-full px-3 h-9 border border-fw-primary rounded-lg text-figma-base text-fw-body bg-fw-base focus:ring-2 focus:ring-fw-active focus:border-fw-active transition-colors';

  const renderTypeSelection = () => (
    <div className="space-y-6">
      {/* AWS Connection Info Bar - Figma: 714x80, fill=#0057B8 @4%, r=8, stroke=cobalt inside 1px */}
      <div className="rounded-lg p-4 border border-fw-active/20 bg-fw-active/[0.04]">
        <div className="flex items-center gap-3">
          {/* AWS logo - Figma: 64x48, r=6, white fill, 1px border */}
          <div className="flex items-center justify-center bg-white border border-fw-secondary flex-shrink-0" style={{ width: 64, height: 48, borderRadius: 6 }}>
            <span className="text-[15px] font-black tracking-tight text-[#232f3e]">aws</span>
          </div>
          <div className="flex-1">
            <div className="text-figma-xs font-semibold text-fw-heading uppercase tracking-wider">AWS Direct Connect</div>
            <div className="flex items-center gap-3 text-figma-sm mt-0.5">
              <span className="font-medium text-fw-body">{awsRegion}</span>
              <span className="font-medium text-fw-body">{awsBandwidth}</span>
              <span className="text-fw-bodyLight font-mono text-figma-xs">{awsConnectionId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section title - Figma: 14px w700 #1d2329 */}
      <div>
        <h3 className="text-figma-sm font-semibold text-fw-heading tracking-[-0.03em] mb-4">Select Connection Type</h3>

        {/* Type cards - Figma: side by side, r=16, subtle border, compact height */}
        <div className="grid grid-cols-2 gap-6">
          {/* Internet to Cloud */}
          <button
            onClick={() => handleTypeSelect('internet-to-cloud')}
            className="mode-selection-card group bg-fw-base border border-fw-secondary hover:border-fw-active hover:shadow-lg transition-all flex flex-col items-start text-left px-6 pt-6 pb-14 relative rounded-lg"
            style={{ minHeight: 220 }}
          >
            <div className="w-10 h-10 bg-fw-infoLight rounded-lg flex items-center justify-center mb-5">
              <Shield className="h-5 w-5 text-fw-active" />
            </div>
            <h4 className="text-figma-base font-bold text-fw-heading tracking-[-0.03em] mb-1">Internet to Cloud</h4>
            <p className="text-figma-sm text-fw-bodyLight tracking-[-0.03em]">
              Public connectivity to AWS services
            </p>
            <div className="absolute bottom-5 right-5 w-8 h-8 bg-fw-active rounded-full flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
          </button>

          {/* VPN to Cloud */}
          <button
            onClick={() => handleTypeSelect('vpn-to-cloud')}
            className="mode-selection-card group bg-fw-base border border-fw-secondary hover:border-fw-active hover:shadow-lg transition-all flex flex-col items-start text-left px-6 pt-6 pb-14 relative rounded-lg"
            style={{ minHeight: 220 }}
          >
            <div className="w-10 h-10 bg-fw-successLight rounded-lg flex items-center justify-center mb-5">
              <Shield className="h-5 w-5 text-fw-success" />
            </div>
            <h4 className="text-figma-base font-bold text-fw-heading tracking-[-0.03em] mb-1">VPN to Cloud</h4>
            <p className="text-figma-sm text-fw-bodyLight tracking-[-0.03em]">
              Secure private connectivity to AWS
            </p>
            <div className="absolute bottom-5 right-5 w-8 h-8 bg-fw-active rounded-full flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSimpleConfig = () => (
    <div className="space-y-5 max-w-2xl mx-auto">
      <FormField
        label="Internet Subnets"
        required
        helpText="CIDR notation for internet subnets"
      >
        <input
          type="text"
          value={config.internetSubnets[0]}
          onChange={(e) => handleConfigChange('internetSubnets', [e.target.value])}
          className={inputClass}
          placeholder="e.g., 192.168.1.0/24 or 0.0.0.0/0"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="IP Stack Type"
          required
        >
          <select
            value={config.stackType}
            onChange={(e) => handleConfigChange('stackType', e.target.value)}
            className={inputClass}
          >
            <option value="ipv4">IPv4 Only</option>
            <option value="ipv6">IPv6 Only</option>
            <option value="dual">Dual Stack</option>
          </select>
        </FormField>

        <FormField
          label="Layer 3 MTU"
          required
          helpText="Valid range: 1500-9001 bytes"
        >
          <input
            type="number"
            value={config.l3mtu}
            onChange={(e) => handleConfigChange('l3mtu', parseInt(e.target.value))}
            className={inputClass}
            min="1500"
            max="9001"
          />
        </FormField>
      </div>

      <FormField
        label="Quality of Service"
        required
        helpText="Traffic prioritization setting"
      >
        <select
          value={config.qosClassifier}
          onChange={(e) => handleConfigChange('qosClassifier', e.target.value)}
          className={inputClass}
        >
          <option value="best-effort">Best Effort</option>
          <option value="out-of-contract">Out of Contract</option>
        </select>
      </FormField>
    </div>
  );

  const renderAdvancedConfig = () => (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Network Configuration - Figma: flat section, icon + heading, no card border */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-fw-heading" />
          <h4 className="text-figma-base font-semibold text-fw-heading tracking-[-0.03em]">Network Configuration</h4>
        </div>
        <div className="space-y-4">
          <FormField
            label="Internet Subnets"
            required
            helpText="CIDR notation for internet subnets"
          >
            <input
              type="text"
              value={config.internetSubnets[0]}
              onChange={(e) => handleConfigChange('internetSubnets', [e.target.value])}
              className={inputClass}
              placeholder="e.g., 192.168.1.0/24"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="IP Stack Type" required>
              <select
                value={config.stackType}
                onChange={(e) => handleConfigChange('stackType', e.target.value)}
                className={inputClass}
              >
                <option value="ipv4">IPv4 Only</option>
                <option value="ipv6">IPv6</option>
                <option value="dual">Dual Stack</option>
              </select>
            </FormField>

            <FormField label="Layer 3 MTU" helpText="Valid range: 1500-9001 bytes">
              <input
                type="number"
                value={config.l3mtu}
                onChange={(e) => handleConfigChange('l3mtu', parseInt(e.target.value))}
                className={inputClass}
                min="1500"
                max="9001"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Quality of Service" helpText="Traffic prioritization setting">
              <select
                value={config.qosClassifier}
                onChange={(e) => handleConfigChange('qosClassifier', e.target.value)}
                className={inputClass}
              >
                <option value="best-effort">Best Effort</option>
                <option value="out-of-contract">Out of Contract</option>
              </select>
            </FormField>

            <FormField label="Peer ASN Type">
              <select
                value={config.peerAsnType}
                onChange={(e) => handleConfigChange('peerAsnType', e.target.value)}
                className={inputClass}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="global">Global</option>
              </select>
            </FormField>
          </div>
        </div>
      </div>

      {/* Divider between sections */}
      <div className="border-t border-fw-secondary" />

      {/* Service Configuration - Figma: flat section, icon + heading, no card border */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-fw-heading" />
          <h4 className="text-figma-base font-semibold text-fw-heading tracking-[-0.03em]">Service Configuration</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="VIF Type">
            <select
              value={config.vifType}
              onChange={(e) => handleConfigChange('vifType', e.target.value)}
              className={inputClass}
            >
              <option value="private">Private VIF</option>
              <option value="public">Public VIF</option>
              <option value="transit">Transit VIF</option>
            </select>
          </FormField>

          <FormField label="Service Access">
            <select
              value={config.serviceAccessType}
              onChange={(e) => handleConfigChange('serviceAccessType', e.target.value)}
              className={inputClass}
            >
              <option value="internet">Internet</option>
              <option value="l3vpn">L3VPN</option>
              <option value="restricted">Restricted</option>
            </select>
          </FormField>
        </div>
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-5">
      {/* AWS Connection Info - Figma: 714x80, fill=#0057B8 @4%, r=8, stroke=cobalt inside 1px */}
      <div className="rounded-lg p-4 border border-fw-active/20 bg-fw-active/[0.04]">
        <div className="flex items-center gap-3">
          {/* AWS logo - Figma: 64x48, r=6, white fill, 1px border */}
          <div className="flex items-center justify-center bg-white border border-fw-secondary flex-shrink-0" style={{ width: 64, height: 48, borderRadius: 6 }}>
            <span className="text-[15px] font-black tracking-tight text-[#232f3e]">aws</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-figma-xs font-semibold text-fw-heading uppercase tracking-wider">AWS Direct Connect</span>
              {/* Figma: badge fill rgba(0,87,184,0.16) */}
              <span className="px-2 py-0.5 text-figma-xs font-medium text-fw-active rounded bg-fw-active/[0.16]" >
                {selectedType === 'internet-to-cloud' ? 'Internet to Cloud' : 'VPN to Cloud'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-figma-sm">
              {/* Figma: region/bandwidth are weight 700 */}
              <span className="font-bold text-fw-body">{awsRegion}</span>
              <span className="text-fw-bodyLight">|</span>
              <span className="font-bold text-fw-body">{awsBandwidth}</span>
              <span className="text-fw-bodyLight">|</span>
              <span className="text-fw-bodyLight font-mono text-figma-xs">{awsConnectionId}</span>
            </div>
          </div>
          {/* Figma: "Change type" link - 10px, weight 500 */}
          <button
            onClick={handleBack}
            className="tab-button text-[10px] font-medium text-fw-link hover:text-fw-active transition-colors whitespace-nowrap"
          >
            Change type
          </button>
        </div>
      </div>

      {/* Configuration Mode Toggle - Figma: underlined tabs with icons */}
      <div className="flex gap-6 border-b border-fw-secondary">
        <button
          onClick={() => setConfigMode('simple')}
          className={`tab-button flex items-center gap-2 px-1 pb-2.5 text-figma-base font-medium transition-all tracking-[-0.03em] border-b-2 -mb-px ${
            configMode === 'simple'
              ? 'border-fw-active text-fw-link'
              : 'border-transparent text-fw-bodyLight hover:text-fw-heading'
          }`}
        >
          <Zap className="h-4 w-4" />
          Simple
        </button>
        <button
          onClick={() => setConfigMode('advanced')}
          className={`tab-button flex items-center gap-2 px-1 pb-2.5 text-figma-base font-medium transition-all tracking-[-0.03em] border-b-2 -mb-px ${
            configMode === 'advanced'
              ? 'border-fw-active text-fw-link'
              : 'border-transparent text-fw-bodyLight hover:text-fw-heading'
          }`}
        >
          <Settings className="h-4 w-4" />
          Advanced
        </button>
      </div>

      {/* Configuration Form */}
      <div>
        {configMode === 'simple' ? renderSimpleConfig() : renderAdvancedConfig()}
      </div>

      {/* Action Buttons - Figma: ← Back outline, ✓ Activate Connection filled */}
      <div className="flex items-center justify-between pt-4 border-t border-fw-secondary">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </Button>
        <Button variant="primary" onClick={handleActivate}>
          <Check className="h-4 w-4 mr-1.5" />
          Activate Connection
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AWS Interconnect - Last Mile"
      size="xl"
    >
      {step === 'type-selection' ? renderTypeSelection() : renderConfiguration()}
    </Modal>
  );
}
