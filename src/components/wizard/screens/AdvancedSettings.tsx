import { useState, useEffect } from 'react';
import { Network, Globe, Activity, Settings, Info, Upload, X, AlertTriangle } from 'lucide-react';
import { CloudProvider } from '../../../types/connection';
import { BillingPreview } from '../BillingPreview';

interface AdvancedSettingsProps {
  config: {
    provider?: CloudProvider;
    type?: string;
    bandwidth?: string;
    location?: string;
    configuration?: {
      internetSubnets?: string[];
      stackType?: 'ipv4' | 'ipv6' | 'dual';
      bfdEnabled?: boolean;
      qosClassifier?: 'best-effort' | 'out-of-contract';
      peerAsn?: 'public' | 'private' | 'global';
      peerAsnRange?: string;
      l3mtu?: number;
      subscriptionId?: string;
      vifType?: 'internet' | 'L3VPN' | 'restricted' | '3rd party internet' | 'ethernet';
      serviceAccessType?: 'internet' | 'l3vmp' | 'restricted';
      ddosProtection?: boolean;
      advancedMonitoring?: boolean;
    };
  };
  onConfigChange: (updates: any) => void;
  billingChoice: {
    planId: string;
    term: string;
    addons: string[];
  };
  onBillingChange: (updates: any) => void;
}

export function AdvancedSettings({ 
  config, 
  onConfigChange,
  billingChoice,
  onBillingChange
}: AdvancedSettingsProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkSubnets, setBulkSubnets] = useState('');
  const [bulkImportError, setBulkImportError] = useState<string>();

  useEffect(() => {
    let mtu = 1500;

    if (config.provider === 'AWS') {
      if (config.configuration?.vifType === 'private') {
        mtu = 9001;
      } else if (config.configuration?.vifType === 'transit') {
        mtu = 8500;
      }
    }
    
    handleConfigChange('l3mtu', mtu);
  }, [config.provider, config.configuration?.vifType]);

  const handleConfigChange = (key: string, value: any) => {
    onConfigChange({
      configuration: {
        ...config.configuration,
        [key]: value
      }
    });
  };

  const validateSubnet = (subnet: string): boolean => {
    const cidrPattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[1-2][0-9]|3[0-2])$/;
    if (!cidrPattern.test(subnet)) return false;

    const ipParts = subnet.split('/')[0].split('.');
    return ipParts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const handleBulkImport = () => {
    setBulkImportError(undefined);
    
    const subnets = bulkSubnets
      .split('\n')
      .map(s => s.trim())
      .filter(s => s);

    const invalidSubnets = subnets.filter(subnet => !validateSubnet(subnet));
    if (invalidSubnets.length > 0) {
      setBulkImportError(`Invalid subnets found: ${invalidSubnets.join(', ')}`);
      return;
    }

    handleConfigChange('internetSubnets', subnets);
    setShowBulkImport(false);
    setBulkSubnets('');

    window.addToast({
      type: 'success',
      title: 'Subnets Imported',
      message: `Successfully imported ${subnets.length} subnets`,
      duration: 3000
    });
  };

  const getMtuTooltip = () => {
    switch (config.provider) {
      case 'AWS':
        return 'AWS Direct Connect MTU: 1500 for Public VIF, 9001 for Private VIF, 8500 for Transit VIF';
      case 'Azure':
        return 'Azure ExpressRoute uses a fixed MTU of 1500';
      case 'Google':
        return 'Google Cloud Interconnect uses a fixed MTU of 1500';
      default:
        return 'Default MTU is 1500';
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">Advanced Configuration</h3>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-fw-base p-6 rounded-xl border border-fw-secondary">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-fw-accent rounded-lg">
                <Network className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <h4 className="text-figma-lg font-semibold text-fw-heading tracking-[-0.03em]">Network Configuration</h4>
                <p className="text-figma-sm text-fw-bodyLight">Configure network addressing and routing settings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-figma-base font-medium text-fw-body">
                    Internet Subnets
                    <button
                      className="ml-2 text-fw-bodyLight hover:text-fw-bodyLight"
                      onMouseEnter={() => setShowTooltip('subnets')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-4 w-4 inline" />
                    </button>
                  </label>
                </div>
                {showTooltip === 'subnets' && (
                  <div className="absolute z-10 w-72 px-3 py-2 bg-fw-heading text-white text-figma-base rounded-lg -top-2 left-full ml-2">
                    Enter your network subnets in CIDR notation (e.g., 192.168.1.0/24). These define the IP ranges for your connection.
                  </div>
                )}
                <div className="space-y-2">
                  {(config.configuration?.internetSubnets || ['']).map((subnet, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={subnet}
                        onChange={(e) => {
                          const newSubnets = [...(config.configuration?.internetSubnets || [''])];
                          newSubnets[index] = e.target.value;
                          handleConfigChange('internetSubnets', newSubnets);
                        }}
                        placeholder="e.g., 192.168.1.0/24"
                        className="flex-1 px-3 h-9 rounded-lg border border-fw-primary shadow-sm focus:border-fw-active focus:ring-fw-active text-figma-base"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setShowBulkImport(true)}
                    className="px-3 py-2 bg-brand-lightBlue text-brand-blue rounded-lg hover:bg-brand-lightBlue/80 w-full flex items-center justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Import
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block text-figma-base font-medium text-fw-body mb-2">
                  IP Stack Type
                  <button
                    className="ml-2 text-fw-bodyLight hover:text-fw-bodyLight"
                    onMouseEnter={() => setShowTooltip('stack')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-4 w-4 inline" />
                  </button>
                </label>
                {showTooltip === 'stack' && (
                  <div className="absolute z-10 w-72 px-3 py-2 bg-fw-heading text-white text-figma-base rounded-lg -top-2 left-full ml-2">
                    Choose your IP protocol version. Dual Stack supports both IPv4 and IPv6 simultaneously for maximum compatibility.
                  </div>
                )}
                <select
                  value={config.configuration?.stackType || 'ipv4'}
                  onChange={(e) => handleConfigChange('stackType', e.target.value)}
                  className="w-full px-3 h-9 rounded-lg border border-fw-primary shadow-sm focus:border-fw-active focus:ring-fw-active text-figma-base"
                >
                  <option value="ipv4">IPv4 Only</option>
                  <option value="ipv6">IPv6 Only</option>
                  <option value="dual">Dual Stack (IPv4 + IPv6)</option>
                </select>
              </div>

              <div className="relative">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.configuration?.bfdEnabled || false}
                    onChange={(e) => handleConfigChange('bfdEnabled', e.target.checked)}
                    className="h-4 w-4 rounded border-fw-secondary text-brand-blue focus:ring-fw-active"
                  />
                  <div>
                    <span className="text-figma-base font-medium text-fw-body">
                      Enable BFD (Bidirectional Forwarding Detection)
                      <button
                        className="ml-2 text-fw-bodyLight hover:text-fw-bodyLight"
                        onMouseEnter={() => setShowTooltip('bfd')}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <Info className="h-4 w-4 inline" />
                      </button>
                    </span>
                  </div>
                </label>
                {showTooltip === 'bfd' && (
                  <div className="absolute z-10 w-72 px-3 py-2 bg-fw-heading text-white text-figma-base rounded-lg -top-2 left-full ml-2">
                    BFD provides fast path failure detection between two routers. It helps in quick failover and improved network reliability.
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-figma-base font-medium text-fw-body mb-2">
                  Quality of Service Classifier
                  <button
                    className="ml-2 text-fw-bodyLight hover:text-fw-bodyLight"
                    onMouseEnter={() => setShowTooltip('qos')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-4 w-4 inline" />
                  </button>
                </label>
                {showTooltip === 'qos' && (
                  <div className="absolute z-10 w-72 px-3 py-2 bg-fw-heading text-white text-figma-base rounded-lg -top-2 left-full ml-2">
                    Determines how your traffic is prioritized. Best Effort provides standard delivery, while Out of Contract handles excess traffic.
                  </div>
                )}
                <select
                  value={config.configuration?.qosClassifier || 'best-effort'}
                  onChange={(e) => handleConfigChange('qosClassifier', e.target.value)}
                  className="w-full px-3 h-9 rounded-lg border border-fw-primary shadow-sm focus:border-fw-active focus:ring-fw-active text-figma-base"
                >
                  <option value="best-effort">Best Effort</option>
                  <option value="out-of-contract">Out of Contract</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-figma-base font-medium text-fw-body mb-2">
                    Peer ASN Type
                    <button
                      className="ml-2 text-fw-bodyLight hover:text-fw-bodyLight"
                      onMouseEnter={() => setShowTooltip('asn')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-4 w-4 inline" />
                    </button>
                  </label>
                  {showTooltip === 'asn' && (
                    <div className="absolute z-10 w-72 px-3 py-2 bg-fw-heading text-white text-figma-base rounded-lg -top-2 left-full ml-2">
                      Autonomous System Number type for BGP routing. Choose based on your network's scope and requirements.
                    </div>
                  )}
                  <select
                    value={config.configuration?.peerAsn || 'public'}
                    onChange={(e) => handleConfigChange('peerAsn', e.target.value)}
                    className="w-full px-3 h-9 rounded-lg border border-fw-primary shadow-sm focus:border-fw-active focus:ring-fw-active text-figma-base"
                  >
                    <option value="public">Public ASN</option>
                    <option value="private">Private ASN</option>
                    <option value="global">Global ASN</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-figma-base font-medium text-fw-body mb-2">
                    Peer ASN Range
                    <button
                      className="ml-2 text-fw-bodyLight hover:text-fw-bodyLight"
                      onMouseEnter={() => setShowTooltip('asnRange')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-4 w-4 inline" />
                    </button>
                  </label>
                  {showTooltip === 'asnRange' && (
                    <div className="absolute z-10 w-72 px-3 py-2 bg-fw-heading text-white text-figma-base rounded-lg -top-2 left-full ml-2">
                      Specify the ASN range for your BGP peering. For private ASNs use 64512-65534, for public ASNs use assigned range.
                    </div>
                  )}
                  <input
                    type="text"
                    value={config.configuration?.peerAsnRange || ''}
                    onChange={(e) => handleConfigChange('peerAsnRange', e.target.value)}
                    placeholder={config.configuration?.peerAsn === 'private' ? '64512-65534' : '1-64511'}
                    className="w-full px-3 h-9 rounded-lg border border-fw-primary shadow-sm focus:border-fw-active focus:ring-fw-active text-figma-base"
                  />
                  <p className="mt-1 text-figma-xs text-fw-bodyLight">
                    {config.configuration?.peerAsn === 'private' 
                      ? 'Private ASN range: 64512-65534'
                      : 'Public ASN range: 1-64511'}
                  </p>
                </div>
              </div>

              <div className="relative">
                <label className="block text-figma-base font-medium text-fw-body mb-2">
                  Layer 3 MTU
                  <button
                    className="ml-2 text-fw-bodyLight hover:text-fw-bodyLight"
                    onMouseEnter={() => setShowTooltip('mtu')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-4 w-4 inline" />
                  </button>
                </label>
                {showTooltip === 'mtu' && (
                  <div className="absolute z-10 w-72 px-3 py-2 bg-fw-heading text-white text-figma-base rounded-lg -top-2 left-full ml-2">
                    {getMtuTooltip()}
                  </div>
                )}
                <input
                  type="number"
                  value={config.configuration?.l3mtu || 1500}
                  onChange={(e) => handleConfigChange('l3mtu', parseInt(e.target.value))}
                  disabled
                  className="w-full px-3 h-9 rounded-lg border border-fw-primary bg-fw-wash shadow-sm text-figma-base cursor-not-allowed"
                />
                <p className="mt-1 text-figma-xs text-fw-bodyLight">
                  MTU is automatically set based on your provider and VIF type selection
                </p>
              </div>
            </div>
          </div>

          <div className="bg-fw-base p-6 rounded-xl border border-fw-secondary">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-fw-wash rounded-lg">
                <Settings className="h-5 w-5 text-fw-purple" />
              </div>
              <div>
                <h4 className="text-figma-lg font-semibold text-fw-heading tracking-[-0.03em]">Service Configuration</h4>
                <p className="text-figma-sm text-fw-bodyLight">Configure service-specific settings</p>
              </div>
            </div>

            <div className="space-y-6">
              {config.provider === 'AWS' && (
                <div className="relative">
                  <label className="block text-figma-base font-medium text-fw-body mb-2">
                    VIF Type
                    <button
                      className="ml-2 text-fw-bodyLight hover:text-fw-bodyLight"
                      onMouseEnter={() => setShowTooltip('vif')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-4 w-4 inline" />
                    </button>
                  </label>
                  {showTooltip === 'vif' && (
                    <div className="absolute z-10 w-72 px-3 py-2 bg-fw-heading text-white text-figma-base rounded-lg -top-2 left-full ml-2">
                      Virtual Interface type determines how your connection interfaces with AWS services. Private for VPC access, Public for internet services, or Transit for use with Transit Gateway.
                    </div>
                  )}
                  <select
                    value={config.configuration?.vifType || 'private'}
                    onChange={(e) => handleConfigChange('vifType', e.target.value)}
                    className="w-full px-3 h-9 rounded-lg border border-fw-primary shadow-sm focus:border-fw-active focus:ring-fw-active text-figma-base"
                  >
                    <option value="internet">internet</option>
                    <option value="L3VPN">L3VPN</option>
                    <option value="private">private</option>
                    <option value="3rd party internet">3rd party internet</option>
                    <option value="ethernet">ethernet</option>
                  </select>
                </div>
              )}

              <div className="relative">
                <label className="block text-figma-base font-medium text-fw-body mb-2">
                  Service Access Type
                  <button
                    className="ml-2 text-fw-bodyLight hover:text-fw-bodyLight"
                    onMouseEnter={() => setShowTooltip('access')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-4 w-4 inline" />
                  </button>
                </label>
                {showTooltip === 'access' && (
                  <div className="absolute z-10 w-72 px-3 py-2 bg-fw-heading text-white text-figma-base rounded-lg -top-2 left-full ml-2">
                    Specifies the sub-type of service access for specialized network configurations and use cases.
                  </div>
                )}
                <select
                  value={config.configuration?.serviceAccessType || 'internet'}
                  onChange={(e) => handleConfigChange('serviceAccessType', e.target.value)}
                  className="w-full px-3 h-9 rounded-lg border border-fw-primary shadow-sm focus:border-fw-active focus:ring-fw-active text-figma-base"
                >
                  <option value="internet">Internet</option>
                  <option value="l3vmp">L3VMP</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <BillingPreview
              provider={config.provider}
              type={config.type as any}
              bandwidth={config.bandwidth as any}
              location={config.location}
              configuration={config.configuration}
              selectedPlanId={billingChoice.planId}
              onPlanChange={(planId) => onBillingChange({ ...billingChoice, planId })}
            />
          </div>
        </div>
      </div>

      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-fw-base rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-fw-secondary flex items-center justify-between">
              <h3 className="text-figma-lg font-medium text-fw-heading tracking-[-0.03em]">Bulk Import Subnets</h3>
              <button
                onClick={() => setShowBulkImport(false)}
                className="text-fw-bodyLight hover:text-fw-body"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-figma-base text-fw-bodyLight">
                  Enter one subnet per line in CIDR notation (e.g., 192.168.1.0/24).
                  You can paste directly from a spreadsheet or text file.
                </p>
              </div>

              <textarea
                value={bulkSubnets}
                onChange={(e) => setBulkSubnets(e.target.value)}
                placeholder="192.168.1.0/24&#10;192.168.2.0/24&#10;192.168.3.0/24"
                rows={10}
                className="w-full rounded-lg border border-fw-primary shadow-sm focus:border-fw-active focus:ring-fw-active font-mono text-figma-base"
              />

              {bulkImportError && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-start">
                  <AlertTriangle className="h-5 w-5 text-fw-error mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-figma-base text-fw-error">{bulkImportError}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="px-4 py-2 text-figma-base font-medium text-fw-body bg-fw-base border border-fw-secondary rounded-lg hover:bg-fw-wash"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  className="px-4 py-2 text-figma-base font-medium text-white bg-brand-blue rounded-full hover:bg-brand-darkBlue"
                >
                  Import Subnets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}