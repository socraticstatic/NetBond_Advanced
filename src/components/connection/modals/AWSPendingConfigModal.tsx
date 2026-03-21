import { useState } from 'react';
import { flushSync } from 'react-dom';
import { Network, Settings, Zap, Shield } from 'lucide-react';
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
      {/* AWS Connection Info Bar - Figma: 714x80, fill=#0057b8, r=8, pad=16 */}
      <div className="bg-fw-active rounded-lg p-4" style={{ minHeight: 80 }}>
        <div className="flex items-center gap-3">
          {/* AWS logo container - Figma: 64x48, fill=#ffffff, stroke=#0057b8, r=6 */}
          <div className="flex items-center justify-center bg-white rounded-md border border-fw-active" style={{ width: 64, height: 48 }}>
            <svg className="h-8 w-12" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="scale(0.33)">
                <path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6s14.2-7.8 24.5-7.8c3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.6.3-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5C41.2.4 46.6 0 52.2 0c11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4c-.1 2.2-.1 3.9-.3 5.3zm-40.6 15.2c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4.6-2.4 1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7-3.2-.4-6.3-.6-9.4-.6-6.7 0-11.6 1.3-14.9 4-3.3 2.7-4.9 6.5-4.9 11.5 0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7zm80.3 10.8c-1.8 0-3-.3-3.8-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.9 0 3.2.3 3.9 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.2-1 4-1h8c1.9 0 3.2.3 4 1 .8.6 1.5 2 1.9 3.9l15.8 67.1 17.3-67.1c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.9-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6-.1.6-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.8 1h-8.6c-1.9 0-3.2-.3-4-1-.8-.7-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-4 1h-8.6zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-2.1.8-3.1 2.3-3.1.6 0 1.2.1 1.8.3.6.2 1.5.6 2.5 1 3.4 1.5 7.1 2.7 11 3.5 4 .8 7.9 1.2 11.9 1.2 6.3 0 11.2-1.1 14.6-3.3 3.4-2.2 5.2-5.4 5.2-9.5 0-2.8-.9-5.1-2.7-7-1.8-1.9-5.2-3.6-10.1-5.2L246 52c-7.3-2.3-12.7-5.7-16-10.2-3.3-4.4-5-9.3-5-14.5 0-4.2.9-7.9 2.7-11.1 1.8-3.2 4.2-6 7.2-8.2 3-2.3 6.4-4 10.4-5.2 4-1.2 8.2-1.7 12.6-1.7 2.2 0 4.5.1 6.7.4 2.3.3 4.4.7 6.5 1.1 2 .5 3.9 1 5.7 1.6 1.8.6 3.2 1.2 4.2 1.8 1.4.8 2.4 1.6 3 2.5.6.8.9 1.9.9 3.3v4.7c0 2.1-.8 3.2-2.3 3.2-.8 0-2.1-.4-3.8-1.2-5.7-2.6-12.1-3.9-19.2-3.9-5.7 0-10.2.9-13.3 2.8-3.1 1.9-4.7 4.8-4.7 8.9 0 2.8 1 5.2 3 7.1 2 1.9 5.7 3.8 11 5.5l14.2 4.5c7.2 2.3 12.4 5.5 15.5 9.6 3.1 4.1 4.6 8.8 4.6 14 0 4.3-.9 8.2-2.6 11.6-1.8 3.4-4.2 6.4-7.3 8.8-3.1 2.5-6.8 4.3-11.1 5.6-4.5 1.4-9.2 2.1-14.3 2.1z" fill="#FF9900"/>
                <path d="M273.5 143.7c-32.9 24.3-80.7 37.2-121.8 37.2-57.6 0-109.5-21.3-148.7-56.7-3.1-2.8-.3-6.6 3.4-4.4 42.4 24.6 94.7 39.5 148.8 39.5 36.5 0 76.6-7.6 113.5-23.2 5.5-2.5 10.2 3.6 4.8 7.6z" fill="#FF9900"/>
                <path d="M287.2 128.1c-4.2-5.4-27.8-2.6-38.5-1.3-3.2.4-3.7-2.4-.8-4.5 18.8-13.2 49.7-9.4 53.3-5 3.6 4.5-1 35.4-18.6 50.2-2.7 2.3-5.3 1.1-4.1-1.9 4-9.9 12.9-32.2 8.7-37.5z" fill="#FF9900"/>
              </g>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-figma-sm font-medium text-white/80 uppercase tracking-wide">AWS Direct Connect</div>
            <div className="flex items-center gap-3 text-figma-base mt-1">
              <span className="font-semibold text-white">{awsRegion}</span>
              <span className="text-white/60">|</span>
              <span className="font-semibold text-white">{awsBandwidth}</span>
              <span className="text-white/60">|</span>
              <span className="text-white/80 font-mono text-figma-sm">{awsConnectionId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section title - Figma: 14px w700 #1d2329 */}
      <div>
        <h3 className="text-figma-base font-bold text-fw-heading tracking-[-0.03em] mb-4">Select Connection Type</h3>

        {/* Type cards - Figma: 345x320 each, stroke=#dcdfe3, r=16, centered content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Internet to Cloud */}
          <button
            onClick={() => handleTypeSelect('internet-to-cloud')}
            className="no-rounded group bg-fw-base border border-fw-secondary hover:border-fw-active hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
            style={{ minHeight: 320, borderRadius: 16 }}
          >
            <div className="w-12 h-12 bg-fw-active rounded-lg flex items-center justify-center mb-5">
              <Network className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">Internet to Cloud</h4>
            <p className="text-figma-base font-medium text-fw-body px-6 tracking-[-0.03em]">
              Public connectivity to AWS services via Direct Connect
            </p>
          </button>

          {/* VPN to Cloud - disabled */}
          <button
            disabled
            className="no-rounded group bg-fw-wash border border-fw-secondary cursor-not-allowed opacity-60 flex flex-col items-center justify-center text-center relative"
            style={{ minHeight: 320, borderRadius: 16 }}
          >
            <div className="w-12 h-12 bg-fw-success rounded-lg flex items-center justify-center mb-5">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">VPN to Cloud</h4>
            <p className="text-figma-base font-medium text-fw-body px-6 tracking-[-0.03em]">
              Secure private connectivity to AWS
            </p>
            <span className="absolute top-3 right-3 badge-coming-soon badge-coming-soon-dark">
              Coming Soon
            </span>
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
          helpText="1500-9001 bytes"
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
      {/* Network Configuration */}
      <div className="bg-fw-wash border border-fw-secondary rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Network className="h-4 w-4 text-fw-link" />
          <h4 className="text-figma-base font-semibold text-fw-heading tracking-[-0.03em]">Network Configuration</h4>
        </div>
        <div className="space-y-4">
          <FormField
            label="Internet Subnets"
            required
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
                <option value="ipv4">IPv4</option>
                <option value="ipv6">IPv6</option>
                <option value="dual">Dual Stack</option>
              </select>
            </FormField>

            <FormField label="Layer 3 MTU">
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

          <div className="flex items-center gap-3 p-3 bg-fw-base rounded-lg border border-fw-secondary">
            <input
              type="checkbox"
              id="bfd"
              checked={config.bfdEnabled}
              onChange={(e) => handleConfigChange('bfdEnabled', e.target.checked)}
              className="h-4 w-4 text-fw-link focus:ring-fw-active border-fw-primary rounded"
            />
            <label htmlFor="bfd" className="text-figma-base font-medium text-fw-body cursor-pointer tracking-[-0.03em]">
              Enable BFD (Bidirectional Forwarding Detection)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="QoS">
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

      {/* Service Configuration */}
      <div className="bg-fw-wash border border-fw-secondary rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-fw-link" />
          <h4 className="text-figma-base font-semibold text-fw-heading tracking-[-0.03em]">Service Configuration</h4>
        </div>
        <div className="space-y-4">
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
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-5">
      {/* AWS Connection Info - compact bar */}
      <div className="bg-fw-accent rounded-lg p-4 border border-fw-active">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center bg-white rounded-md flex-shrink-0 border border-fw-warn" style={{ width: 64, height: 48 }}>
              <svg className="h-8 w-12" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="scale(0.33)">
                  <path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6s14.2-7.8 24.5-7.8c3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.6.3-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5C41.2.4 46.6 0 52.2 0c11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4c-.1 2.2-.1 3.9-.3 5.3zm-40.6 15.2c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4.6-2.4 1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7-3.2-.4-6.3-.6-9.4-.6-6.7 0-11.6 1.3-14.9 4-3.3 2.7-4.9 6.5-4.9 11.5 0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7zm80.3 10.8c-1.8 0-3-.3-3.8-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.9 0 3.2.3 3.9 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.2-1 4-1h8c1.9 0 3.2.3 4 1 .8.6 1.5 2 1.9 3.9l15.8 67.1 17.3-67.1c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.9-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6-.1.6-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.8 1h-8.6c-1.9 0-3.2-.3-4-1-.8-.7-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-4 1h-8.6zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-2.1.8-3.1 2.3-3.1.6 0 1.2.1 1.8.3.6.2 1.5.6 2.5 1 3.4 1.5 7.1 2.7 11 3.5 4 .8 7.9 1.2 11.9 1.2 6.3 0 11.2-1.1 14.6-3.3 3.4-2.2 5.2-5.4 5.2-9.5 0-2.8-.9-5.1-2.7-7-1.8-1.9-5.2-3.6-10.1-5.2L246 52c-7.3-2.3-12.7-5.7-16-10.2-3.3-4.4-5-9.3-5-14.5 0-4.2.9-7.9 2.7-11.1 1.8-3.2 4.2-6 7.2-8.2 3-2.3 6.4-4 10.4-5.2 4-1.2 8.2-1.7 12.6-1.7 2.2 0 4.5.1 6.7.4 2.3.3 4.4.7 6.5 1.1 2 .5 3.9 1 5.7 1.6 1.8.6 3.2 1.2 4.2 1.8 1.4.8 2.4 1.6 3 2.5.6.8.9 1.9.9 3.3v4.7c0 2.1-.8 3.2-2.3 3.2-.8 0-2.1-.4-3.8-1.2-5.7-2.6-12.1-3.9-19.2-3.9-5.7 0-10.2.9-13.3 2.8-3.1 1.9-4.7 4.8-4.7 8.9 0 2.8 1 5.2 3 7.1 2 1.9 5.7 3.8 11 5.5l14.2 4.5c7.2 2.3 12.4 5.5 15.5 9.6 3.1 4.1 4.6 8.8 4.6 14 0 4.3-.9 8.2-2.6 11.6-1.8 3.4-4.2 6.4-7.3 8.8-3.1 2.5-6.8 4.3-11.1 5.6-4.5 1.4-9.2 2.1-14.3 2.1z" fill="#FF9900"/>
                  <path d="M273.5 143.7c-32.9 24.3-80.7 37.2-121.8 37.2-57.6 0-109.5-21.3-148.7-56.7-3.1-2.8-.3-6.6 3.4-4.4 42.4 24.6 94.7 39.5 148.8 39.5 36.5 0 76.6-7.6 113.5-23.2 5.5-2.5 10.2 3.6 4.8 7.6z" fill="#FF9900"/>
                  <path d="M287.2 128.1c-4.2-5.4-27.8-2.6-38.5-1.3-3.2.4-3.7-2.4-.8-4.5 18.8-13.2 49.7-9.4 53.3-5 3.6 4.5-1 35.4-18.6 50.2-2.7 2.3-5.3 1.1-4.1-1.9 4-9.9 12.9-32.2 8.7-37.5z" fill="#FF9900"/>
                </g>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-figma-sm text-fw-bodyLight uppercase tracking-wide">AWS Direct Connect</span>
                <span className="px-2 py-0.5 bg-fw-base text-figma-sm font-medium text-fw-link rounded-lg">
                  {selectedType === 'internet-to-cloud' ? 'Internet to Cloud' : 'VPN to Cloud'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-figma-base">
                <span className="font-semibold text-fw-heading tracking-[-0.03em]">{awsRegion}</span>
                <span className="text-fw-bodyLight">|</span>
                <span className="font-semibold text-fw-heading tracking-[-0.03em]">{awsBandwidth}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleBack}
            className="text-figma-sm text-fw-link hover:text-fw-linkHover font-medium transition-colors whitespace-nowrap"
          >
            Change Type
          </button>
        </div>
      </div>

      {/* Configuration Mode Toggle - Figma: segmented control, quick-action-btn pattern */}
      <div>
        <div className="inline-flex rounded-md border border-fw-secondary overflow-hidden">
          <button
            onClick={() => setConfigMode('simple')}
            className={`no-rounded flex items-center gap-2 px-5 h-9 text-figma-base font-medium transition-all tracking-[-0.03em] ${
              configMode === 'simple'
                ? 'bg-fw-active text-white'
                : 'bg-fw-base text-fw-heading hover:bg-fw-neutral'
            }`}
            style={{ borderRadius: 0 }}
          >
            <Zap className="h-4 w-4" />
            Simple
          </button>
          <button
            onClick={() => setConfigMode('advanced')}
            className={`no-rounded flex items-center gap-2 px-5 h-9 text-figma-base font-medium transition-all tracking-[-0.03em] ${
              configMode === 'advanced'
                ? 'bg-fw-active text-white'
                : 'bg-fw-base text-fw-heading hover:bg-fw-neutral'
            }`}
            style={{ borderRadius: 0 }}
          >
            <Settings className="h-4 w-4" />
            Advanced
          </button>
        </div>
      </div>

      {/* Configuration Form */}
      <div>
        {configMode === 'simple' ? renderSimpleConfig() : renderAdvancedConfig()}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-fw-secondary">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button variant="primary" onClick={handleActivate}>
          Activate Connection
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'type-selection' ? connection.name : 'Configure Connection'}
      size="xl"
    >
      {step === 'type-selection' ? renderTypeSelection() : renderConfiguration()}
    </Modal>
  );
}
