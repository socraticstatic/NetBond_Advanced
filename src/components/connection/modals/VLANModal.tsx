import { useState, useEffect } from 'react';
import { X, Tag, AlertTriangle, Plus, CheckCircle, HelpCircle, Info } from 'lucide-react';
import { Button } from '../../common/Button';
import { FormField } from '../../form/FormField';

export interface VLAN {
  id: string;
  name: string;
  vlanId: number;
  status: 'active' | 'inactive';
  description?: string;
  tags?: string[];
  ipSubnet?: string;
  mtu?: number;
  qosPriority?: number;
  type?: 'data' | 'voice' | 'management' | 'storage' | 'guest' | 'dmz' | 'other' | 'application';
  createdAt: string;
  updatedAt?: string;
  bandwidth?: string; // Added bandwidth field
}

interface Link extends VLAN {
  // Link is essentially the same as VLAN with potentially additional properties
  linkId?: number; // Some implementations might use linkId instead of vlanId
  bandwidth?: string; // Bandwidth allocation for this link
}

interface VLANModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vlan: Partial<VLAN>) => void;
  vlan?: VLAN; // If provided, we're in edit mode
  connectionId: string;
  availableBandwidth?: number; // Available bandwidth in Gbps
}

export function VLANModal({ 
  isOpen, 
  onClose, 
  onSave, 
  vlan, 
  connectionId,
  availableBandwidth = 10
}: VLANModalProps) {
  const isEditMode = !!vlan;

  // Form state
  const [name, setName] = useState('');
  const [vlanId, setVlanId] = useState<number | ''>('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [ipSubnet, setIpSubnet] = useState('');
  const [mtu, setMtu] = useState<number>(1500);
  const [qosPriority, setQosPriority] = useState<number>(0);
  const [trafficType, setTrafficType] = useState<VLAN['type']>('data');
  const [linkType, setLinkType] = useState<'Layer 1' | 'Layer 2' | 'Layer 3'>('Layer 3');
  const [bandwidth, setBandwidth] = useState<string>('1');
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Populate form fields in edit mode
  useEffect(() => {
    if (vlan) {
      setName(vlan.name);
      setVlanId(vlan.vlanId);
      setStatus(vlan.status);
      setDescription(vlan.description || '');
      setTags(vlan.tags || []);
      setIpSubnet(vlan.ipSubnet || '');
      setMtu(vlan.mtu || 1500);
      setQosPriority(vlan.qosPriority || 0);
      setTrafficType(vlan.type || 'data');
      // Set bandwidth if available, otherwise default to 1
      setBandwidth(vlan.bandwidth ? vlan.bandwidth.replace(/[^\d.]/g, '') : '1');
      // Default to Layer 3 for existing VLANs if not specified
      setLinkType('Layer 3');
    } else {
      // Default values for new VLANs
      setName('');
      setVlanId('');
      setStatus('active');
      setDescription('');
      setTags([]);
      setIpSubnet('');
      setMtu(1500);
      setQosPriority(0);
      setTrafficType('data');
      setBandwidth('1');
      setLinkType('Layer 3');
    }
    setErrors({});
  }, [vlan, isOpen]);

  // Field validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (vlanId === '') {
      newErrors.vlanId = 'Link ID is required';
    } else if (typeof vlanId === 'number') {
      if (vlanId < 1 || vlanId > 4094) {
        newErrors.vlanId = 'Link ID must be between 1 and 4094';
      }
    }

    if (ipSubnet && !isValidCIDR(ipSubnet)) {
      newErrors.ipSubnet = 'Enter a valid CIDR notation (e.g., 192.168.1.0/24)';
    }

    if (mtu < 1280 || mtu > 9216) {
      newErrors.mtu = 'MTU must be between 1280 and 9216';
    }

    // Validate bandwidth
    if (!bandwidth || isNaN(parseFloat(bandwidth)) || parseFloat(bandwidth) <= 0) {
      newErrors.bandwidth = 'Bandwidth must be a positive number';
    } else if (parseFloat(bandwidth) > availableBandwidth) {
      newErrors.bandwidth = `Bandwidth cannot exceed available ${availableBandwidth.toFixed(1)} Gbps`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidCIDR = (cidr: string): boolean => {
    const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[1-2][0-9]|3[0-2])$/;
    if (!cidrRegex.test(cidr)) {
      return false;
    }

    // Validate IP portion is valid
    const ip = cidr.split('/')[0];
    const ipParts = ip.split('.');
    for (const part of ipParts) {
      const num = parseInt(part, 10);
      if (num < 0 || num > 255) {
        return false;
      }
    }
    return true;
  };

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // If this is a deletion confirmation, skip this step
    if (showConfirmation) {
      setShowConfirmation(false);
      return;
    }

    // Prepare data for save
    const vlanData: Partial<VLAN> = {
      name,
      vlanId: vlanId as number,
      status,
      description: description || undefined,
      tags: tags.length > 0 ? tags : undefined,
      ipSubnet: ipSubnet || undefined,
      mtu: mtu !== 1500 ? mtu : undefined,
      qosPriority: qosPriority !== 0 ? qosPriority : undefined,
      type: trafficType,
      bandwidth: `${bandwidth} Gbps` // Add bandwidth to the VLAN data
    };

    // If in edit mode, retain the original ID
    if (isEditMode && vlan) {
      vlanData.id = vlan.id;
      vlanData.createdAt = vlan.createdAt;
      vlanData.updatedAt = new Date().toISOString();
    } else {
      // Generate ID for new VLANs
      vlanData.id = `vlan-${Date.now()}`;
      vlanData.createdAt = new Date().toISOString();
    }

    onSave(vlanData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            {isEditMode ? 'Edit Link' : 'Add New Link'}
            {isEditMode && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                ID: {vlan?.vlanId}
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Warning message when editing */}
        {isEditMode && (
          <div className="m-6 mb-0 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800 font-medium">
                Warning: Editing Link Configuration
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Changes to link settings may impact network traffic. Ensure all connected systems are properly configured for the updated settings.
              </p>
            </div>
          </div>
        )}
        
        {/* Body - Form */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <form id="vlan-form" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic VLAN Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <FormField 
                    label="Link Name" 
                    error={errors.name} 
                    required
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Production Network"
                    />
                  </FormField>
                </div>
                
                <div className="col-span-1">
                  <FormField 
                    label="Link ID" 
                    error={errors.vlanId} 
                    required
                    helpText="Valid range: 1-4094"
                  >
                    <input
                      type="number"
                      value={vlanId}
                      onChange={(e) => setVlanId(e.target.value ? parseInt(e.target.value) : '')}
                      className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1-4094"
                      min="1"
                      max="4094"
                    />
                  </FormField>
                </div>
                
                <div className="col-span-1">
                  <FormField 
                    label="Status" 
                    required
                  >
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                      className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </FormField>
                </div>
                
                <div className="col-span-1">
                  <FormField 
                    label="Traffic Type"
                  >
                    <select
                      value={trafficType}
                      onChange={(e) => setTrafficType(e.target.value as VLAN['type'])}
                      className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="data">Data</option>
                      <option value="voice">Voice</option>
                      <option value="management">Management</option>
                      <option value="storage">Storage</option>
                      <option value="guest">Guest Network</option>
                      <option value="dmz">DMZ</option>
                      <option value="application">Application</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>
                </div>

                <div className="col-span-1">
                  <FormField 
                    label="Link Type"
                  >
                    <select
                      value={linkType}
                      onChange={(e) => setLinkType(e.target.value as 'Layer 1' | 'Layer 2' | 'Layer 3')}
                      className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Layer 1">Layer 1</option>
                      <option value="Layer 2">Layer 2</option>
                      <option value="Layer 3">Layer 3</option>
                    </select>
                  </FormField>
                </div>

                <div className="col-span-1">
                  <FormField 
                    label="Bandwidth (Gbps)" 
                    error={errors.bandwidth}
                    helpText={`Available: ${availableBandwidth.toFixed(1)} Gbps`}
                    required
                  >
                    <input
                      type="number"
                      value={bandwidth}
                      onChange={(e) => setBandwidth(e.target.value)}
                      className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 1"
                      min="0.1"
                      max={availableBandwidth}
                      step="0.1"
                    />
                  </FormField>
                </div>
                
                <div className="col-span-2">
                  <FormField 
                    label="IP Subnet" 
                    error={errors.ipSubnet}
                    helpText="CIDR notation (e.g., 192.168.1.0/24)"
                  >
                    <input
                      type="text"
                      value={ipSubnet}
                      onChange={(e) => setIpSubnet(e.target.value)}
                      className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 192.168.1.0/24"
                    />
                  </FormField>
                </div>
                
                <div className="col-span-2">
                  <FormField 
                    label="Description"
                  >
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Enter a description for this link"
                    />
                  </FormField>
                </div>
                
                <div className="col-span-2">
                  <FormField 
                    label="Tags"
                    helpText="Add tags to categorize this link"
                  >
                    <div className="flex">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mr-2 flex-1"
                        placeholder="Enter a tag and press Enter"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {/* Display tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag, index) => (
                          <div 
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1.5 text-blue-400 hover:text-blue-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormField>
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform transform ${showAdvanced ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <div className="pt-4 pb-2 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                      <FormField 
                        label="MTU Size" 
                        error={errors.mtu}
                        helpText="Maximum Transmission Unit (1280-9216)"
                      >
                        <input
                          type="number"
                          value={mtu}
                          onChange={(e) => setMtu(parseInt(e.target.value))}
                          className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1280"
                          max="9216"
                          step="1"
                        />
                      </FormField>
                    </div>
                    
                    <div className="col-span-1">
                      <FormField 
                        label="QoS Priority" 
                        helpText="0 (lowest) to 7 (highest)"
                      >
                        <select
                          value={qosPriority}
                          onChange={(e) => setQosPriority(parseInt(e.target.value))}
                          className="vlan-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="0">0 - Background (lowest)</option>
                          <option value="1">1 - Best Effort</option>
                          <option value="2">2 - Excellent Effort</option>
                          <option value="3">3 - Critical Applications</option>
                          <option value="4">4 - Video</option>
                          <option value="5">5 - Voice</option>
                          <option value="6">6 - Internetwork Control</option>
                          <option value="7">7 - Network Control (highest)</option>
                        </select>
                      </FormField>
                    </div>
                  </div>

                  {/* Help information */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <HelpCircle className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Advanced Link Settings</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            <strong>MTU Size:</strong> Defines the maximum packet size. Standard is 1500, but jumbo frames allow values up to 9216.
                          </p>
                          <p className="mt-1">
                            <strong>QoS Priority:</strong> Determines traffic priority for this link. Higher values receive preferential treatment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="vlan-form"
          >
            {isEditMode ? 'Update Link' : 'Create Link'}
          </Button>
        </div>
      </div>

      {/* Add custom styles for form fields within the VLAN modal */}
      <style jsx>{`
        /* Custom styles for VLAN modal inputs */
        .vlan-input {
          border-radius: 0.375rem !important; /* More squared corners */
          transition: all 0.2s ease;
        }
        
        .vlan-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
          outline: none;
          border-radius: 0.375rem !important; /* Maintain squared corners on focus */
        }
        
        /* Ensure all form elements in the VLAN modal use the custom style */
        #vlan-form input[type="text"],
        #vlan-form input[type="number"],
        #vlan-form select,
        #vlan-form textarea {
          border-radius: 0.375rem !important;
        }
        
        #vlan-form input[type="text"]:focus,
        #vlan-form input[type="number"]:focus,
        #vlan-form select:focus,
        #vlan-form textarea:focus {
          border-radius: 0.375rem !important;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
          outline: none;
        }
      `}</style>
    </div>
  );
}

// Export as both VLANModal and LinkModal
;