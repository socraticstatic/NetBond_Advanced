import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Globe, Server, Cloud, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { PhaseIndicator } from './PhaseIndicator';
import { CloudProvider, ConnectionType, BandwidthOption, LocationOption, ConnectionConfig } from '../../types/connection';
import { ProviderSelection } from './screens/ProviderSelection';
import { ConnectionTypeSelection } from './screens/ConnectionTypeSelection';
import { ConnectionConfiguration } from './screens/ConnectionConfiguration';
import { AdvancedSettings } from './screens/AdvancedSettings';
import { ReviewConfiguration } from './screens/ReviewConfiguration';
import { ModeSelection } from './modes';
import { useStore } from '../../store/useStore';
import { Button } from '../common/Button';
import { Toggle } from '../common/Toggle';
import { NetworkAI } from './NetworkAI';
import { Connection, NetworkNode, NetworkEdge } from '../../types';
import { AsyncBoundary } from '../common/AsyncBoundary';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { tryCatch, handleApiError } from '../../utils/errorHandling';
import { LoadingSpinner } from '../common/LoadingSpinner';

// Lazy load the NetworkDesigner component with improved error handling and loading states
const LazyNetworkDesigner = lazy(() => 
  import('../network-designer/LazyNetworkDesigner')
    .then(module => ({ default: module.default }))
    .catch(error => {
      console.error('Failed to load NetworkDesigner component:', error);
      // Re-throw to be caught by error boundary
      throw error;
    })
);

const STEPS = [
  { title: 'Your Cloud Router', description: 'Name Your Cloud Router' },
  { title: 'Choose Provider', description: 'Select your cloud service provider' },
  { title: 'Connection Type', description: 'Select how you want to connect' },
  { title: 'Basic Settings', description: 'Set bandwidth and location' },
  { title: 'Advanced Settings', description: 'Configure network settings' },
  { title: 'Review', description: 'Review your selections' }
];

type WizardMode = 'step-by-step' | 'visual';

interface ConnectionWizardProps {
  onComplete: (config: ConnectionConfig) => void;
  onCancel: () => void;
  initialConnection?: Connection;
  editMode?: boolean;
}

interface BillingChoice {
  planId: string;
  term: string;
  addons: string[];
}

export function ConnectionWizard({ onComplete, onCancel, initialConnection, editMode = false }: ConnectionWizardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const addConnection = useStore(state => state.addConnection);
  const updateConnection = useStore(state => state.updateConnection);
  const connections = useStore(state => state.connections);
  
  // Check for state passed via router navigation
  const locationState = location.state as any;

  // Check if there's a template from the application solution zone
  const template = locationState?.template;

  // Show mode selection screen on Create, skip to visual on edit
  const initialMode: WizardMode | null = editMode || (locationState?.editMode) ? 'visual' :
                     locationState?.mode ? locationState.mode as WizardMode :
                     template ? 'step-by-step' :
                     null;

  // Get initialConnection from props or location state
  const connectionToEdit = initialConnection || locationState?.initialConnection;
  const isEditMode = editMode || locationState?.editMode || false;

  // Initialize with mode from navigation state or props
  const [mode, setMode] = useState<WizardMode | null>(initialMode);
  const [step, setStep] = useState(template ? 2 : 0); // Skip to connection type if template exists
  const [cloudRouterName, setCloudRouterName] = useState('');
  const [config, setConfig] = useState<Partial<ConnectionConfig>>(
    template ? {
      provider: template.provider as CloudProvider,
      connectionType: template.connectionType as ConnectionType,
      bandwidth: template.bandwidth as BandwidthOption,
      name: template.name
    } : {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(true);

  // Persistent state for all selections
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>();
  const [selectedType, setSelectedType] = useState<ConnectionType>();
  const [selectedBandwidth, setSelectedBandwidth] = useState<BandwidthOption>();
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>();
  const [billingChoice, setBillingChoice] = useState<BillingChoice>({
    planId: 'pay-as-you-go',
    term: 'monthly',
    addons: []
  });

  // For visual editor, convert connection to nodes and edges
  const [initialNodes, setInitialNodes] = useState<NetworkNode[]>([]);
  const [initialEdges, setInitialEdges] = useState<NetworkEdge[]>([]);

  // Initialize from existing connection if provided
  useEffect(() => {
    if (connectionToEdit) {
      // Log initialization information
      console.log("Initializing connection wizard with connection:", connectionToEdit);
      
      // Set basic config values safely
      tryCatch(() => {
        setSelectedProvider(connectionToEdit.provider as CloudProvider);
        setSelectedType(connectionToEdit.type as ConnectionType);
        setSelectedBandwidth(connectionToEdit.bandwidth as BandwidthOption);
        setSelectedLocation(connectionToEdit.location as LocationOption);
        
        if (connectionToEdit.billing) {
          setBillingChoice({
            planId: connectionToEdit.billing.planId || 'pay-as-you-go',
            term: connectionToEdit.billing.term || 'monthly',
            addons: connectionToEdit.billing.addons || []
          });
        }
        
        // For visual mode, set up initial nodes and edges
        if (mode === 'visual') {
          console.log("Setting up visual editor with connection data:", connectionToEdit);
          
          // Use initialNodes/initialEdges from location state if available
          if (locationState?.initialNodes && locationState?.initialEdges) {
            console.log("Using provided initial nodes and edges from location state");
            setInitialNodes(locationState.initialNodes);
            setInitialEdges(locationState.initialEdges);
          } else {
            // Source node (represents customer side)
            const sourceNode: NetworkNode = {
              id: 'source-1',
              type: 'source',
              x: 100,
              y: 200,
              name: 'Your Network',
              status: connectionToEdit.status === 'Active' ? 'active' : 'inactive',
              config: {
                location: connectionToEdit.location,
                connectionType: connectionToEdit.type // Add this to help determine icon
              }
            };
            
            // Target node (represents cloud provider)
            const targetNode: NetworkNode = {
              id: 'destination-1',
              type: 'destination',
              x: 500,
              y: 200,
              name: connectionToEdit.provider || 'Cloud Provider',
              status: connectionToEdit.status === 'Active' ? 'active' : 'inactive',
              config: {
                provider: connectionToEdit.provider,
                region: connectionToEdit.location
              }
            };
            
            // Create edge between nodes
            const edge: NetworkEdge = {
              id: 'edge-1',
              source: 'source-1',
              target: 'destination-1',
              type: connectionToEdit.type,
              bandwidth: connectionToEdit.bandwidth,
              status: connectionToEdit.status === 'Active' ? 'active' : 'inactive'
            };
            
            console.log("Created default nodes and edges:", [sourceNode, targetNode], [edge]);
            setInitialNodes([sourceNode, targetNode]);
            setInitialEdges([edge]);
          }
        }
      }, () => {
        console.error('Error initializing connection data');
      });
    }
  }, [connectionToEdit, mode, locationState]);

  // Update config when selections change
  useEffect(() => {
    setConfig({
      provider: selectedProvider,
      type: selectedType,
      bandwidth: selectedBandwidth,
      location: selectedLocation
    });
  }, [selectedProvider, selectedType, selectedBandwidth, selectedLocation]);

  const handleCancel = () => {
    if (isEditMode && connectionToEdit) {
      // If editing, return to connection details
      navigate(`/connections/${connectionToEdit.id}`);
    } else {
      // Otherwise return to connections list
      navigate('/manage');
    }
  };

  const handleModeChange = (newMode: WizardMode | 'api') => {
    if (newMode === 'api') {
      navigate('/api-toolbox');
      return;
    }
    setMode(newMode);
    setStep(0);
    setConfig({});
    setCloudRouterName('');
    setBillingChoice({
      planId: 'pay-as-you-go',
      term: 'monthly',
      addons: []
    });
    setError(null);
  };

  const updateConfig = (updates: Partial<ConnectionConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateBillingChoice = (updates: Partial<BillingChoice>) => {
    setBillingChoice(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    // For standard flow
    switch (step) {
      case 0:
        return cloudRouterName.trim().length > 0; // Cloud Router Name required
      case 1:
        return !!selectedProvider;
      case 2:
        return !!selectedType;
      case 3:
        return !!selectedBandwidth && !!selectedLocation;
      case 4:
        return true; // Advanced settings are optional
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  const handleComplete = async (config: ConnectionConfig | Connection[]) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Handle visual designer output (array of connections)
      if (Array.isArray(config)) {
        if (config.length === 0) {
          throw new Error('No connections created. Please design your network first.');
        }
        
        // If we're editing an existing connection
        if (isEditMode && connectionToEdit) {
          // Take the first connection from the visual designer
          const designerConnection = config[0];
          
          // Update the existing connection with the designer changes
          await updateConnection(connectionToEdit.id.toString(), {
            type: designerConnection.type,
            bandwidth: designerConnection.bandwidth,
            location: designerConnection.location,
            provider: designerConnection.provider,
            features: designerConnection.features,
            security: designerConnection.security
          });
          
          window.addToast?.({
            type: 'success',
            title: 'Connection Updated',
            message: 'Connection topology has been updated successfully',
            duration: 3000
          });
          
          // Navigate back to connection details
          navigate(`/connections/${connectionToEdit.id}`);
          return;
        }
        
        // Otherwise add the new connection(s)
        for (const connection of config) {
          await addConnection(connection);
        }
        
        navigate('/manage');
        return;
      }

      // Standard wizard flow - create a single connection
      
      // Use cloudRouterName if provided, otherwise generate one
      const baseName = cloudRouterName.trim() || `Internet to ${config.provider} Cloud`;
      let connectionName = baseName;
      let counter = 1;

      // Check for duplicate names and append a number if needed
      while (connections.some(conn => conn.name.toLowerCase() === connectionName.toLowerCase())) {
        connectionName = `${baseName} (${counter})`;
        counter++;
      }

      // Create the new connection object with inactive status
      const newConnection = {
        name: connectionName,
        type: `Internet to ${config.provider} Cloud`,
        status: 'Inactive',
        bandwidth: config.bandwidth,
        location: config.location,
        provider: config.provider,
        features: {
          dedicatedConnection: true,
          redundantPath: config.redundancy || false,
          autoScaling: false,
          loadBalancing: false
        },
        security: {
          encryption: 'AES-256',
          firewall: true,
          ddosProtection: true,
          ipSecEnabled: true
        },
        performance: {
          latency: '<10ms',
          packetLoss: '<0.1%',
          jitter: '<2ms',
          uptime: '99.9%',
          throughput: '0%',
          tunnels: 'Inactive',
          bandwidthUtilization: 0,
          currentUsage: '0 Gbps',
          utilizationTrend: [0, 0, 0, 0, 0, 0, 0]
        },
        configuration: config.configuration || {},
        billing: {
          planId: billingChoice.planId,
          term: billingChoice.term,
          addons: billingChoice.addons,
          baseFee: billingChoice.planId === '36-months' ? 1999.99 : 999.99,
          usage: 0,
          total: billingChoice.planId === '36-months' ? 1999.99 : 999.99,
          currency: 'USD'
        }
      };

      // Add to local store - handle potential network errors
      try {
        await addConnection(newConnection);
        
        // Navigate to manage page after a short delay
        setTimeout(() => {
          navigate('/manage');
        }, 500);
      } catch (error) {
        console.error('Error creating connection:', error);
        setError('Failed to create connection. Please try again.');
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('Error creating connection:', error);
      setError(handleApiError(error, 'Failed to create connection'));
      setIsSubmitting(false);
    }
  };

  // Apply AI suggestion
  const handleAISuggestion = (suggestion: any) => {
    try {
      if (suggestion.provider) {
        setSelectedProvider(suggestion.provider);
      }
      if (suggestion.type) {
        setSelectedType(suggestion.type);
      }
      if (suggestion.bandwidth) {
        setSelectedBandwidth(suggestion.bandwidth);
      }
      if (suggestion.location) {
        setSelectedLocation(suggestion.location);
      }
    } catch (error) {
      console.error('Error applying AI suggestion:', error);
    }
  };

  // If no mode is selected, show the mode selection screen
  if (!mode) {
    return (
      <div className="bg-fw-base rounded-3xl">
        <ModeSelection onModeSelect={handleModeChange} onCancel={handleCancel} />
      </div>
    );
  }

  const renderContent = () => {
    switch (mode) {
      case 'visual':
        return (
          <div>
            <AsyncBoundary
              fallback={
                <div className="min-h-[800px] flex items-center justify-center bg-fw-wash rounded-xl border border-fw-secondary">
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-fw-bodyLight">Loading Network Designer...</p>
                  </div>
                </div>
              }
              errorFallback={
                <div className="min-h-[800px] flex items-center justify-center bg-fw-wash rounded-xl border border-fw-secondary">
                  <div className="text-center max-w-md p-8">
                    <h3 className="text-figma-xl font-bold text-fw-error mb-4 tracking-[-0.03em]">Unable to load Network Designer</h3>
                    <p className="text-fw-bodyLight mb-6">We encountered an error loading the network designer component. This might be due to browser compatibility issues or network problems.</p>
                    <div className="space-y-4">
                      <button
                        onClick={() => setMode('step-by-step')}
                        className="w-full px-6 py-3 bg-fw-ctaPrimary text-white rounded-full hover:bg-fw-ctaPrimaryHover"
                      >
                        Switch to Step-by-Step Wizard
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full px-6 py-3 bg-fw-neutral text-fw-body rounded-full hover:bg-fw-neutral"
                      >
                        Refresh Page
                      </button>
                    </div>
                  </div>
                </div>
              }
              retryOnError={false}
            >
              <Suspense fallback={
                <div className="min-h-[800px] flex items-center justify-center bg-fw-wash rounded-xl border border-fw-secondary">
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-fw-bodyLight">Loading Network Designer...</p>
                  </div>
                </div>
              }>
                <LazyNetworkDesigner
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                  initialNodes={initialNodes}
                  initialEdges={initialEdges}
                  editMode={isEditMode}
                  connectionId={connectionToEdit?.id}
                />
              </Suspense>
            </AsyncBoundary>
          </div>
        );

      default:
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setMode(null)}
                className="text-fw-link hover:text-fw-linkHover flex items-center text-figma-base font-medium"
              >
                Change Creation Mode
              </button>

              <div className="flex items-center">
                <Toggle
                  checked={showAI}
                  onChange={setShowAI}
                  label="AI Assistant"
                />
              </div>
            </div>

            <div className="max-w-4xl mx-auto mb-12">
              <PhaseIndicator
                phases={STEPS}
                currentPhase={step}
                className="w-full"
              />
            </div>

            <div className="max-w-3xl mx-auto relative">
              {/* AI Assistant */}
              {showAI && (
                <NetworkAI
                  provider={selectedProvider}
                  type={selectedType}
                  bandwidth={selectedBandwidth}
                  location={selectedLocation}
                  step={step}
                  onNextStep={() => setStep(s => Math.min(s + 1, STEPS.length - 1))}
                  onSuggestion={handleAISuggestion}
                />
              )}

              {step === 0 && (
                <div className="space-y-6">
                  <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">Name Your Cloud Router</h3>
                  <div className="max-w-[500px] mx-auto">
                    <input
                      type="text"
                      value={cloudRouterName}
                      onChange={(e) => setCloudRouterName(e.target.value)}
                      placeholder="e.g., Production-Finance-Cloud-Router-East-01"
                      className="w-full h-9 px-3 rounded-lg border border-fw-primary text-figma-base font-medium text-fw-heading placeholder:text-fw-bodyLight focus:border-fw-active focus:ring-fw-active focus:outline-none"
                    />
                    <p className="mt-2 text-figma-xs font-medium text-fw-disabled">
                      Choose a meaningful name that reflects your Cloud Router's role in your network architecture.
                    </p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <ProviderSelection
                  selectedProvider={selectedProvider}
                  onSelect={(provider) => {
                    setSelectedProvider(provider);
                    setStep(2);
                  }}
                  billingChoice={billingChoice}
                  onBillingChange={updateBillingChoice}
                />
              )}

              {step === 2 && (
                <ConnectionTypeSelection
                  selectedType={selectedType}
                  provider={selectedProvider}
                  onSelect={(type) => {
                    setSelectedType(type);
                    setStep(3);
                  }}
                  billingChoice={billingChoice}
                  onBillingChange={updateBillingChoice}
                />
              )}

              {step === 3 && (
                <ConnectionConfiguration
                  selectedLocation={selectedLocation}
                  selectedBandwidth={selectedBandwidth}
                  provider={selectedProvider}
                  type={selectedType}
                  billingChoice={billingChoice}
                  onLocationSelect={setSelectedLocation}
                  onBandwidthSelect={setSelectedBandwidth}
                  onBillingChange={updateBillingChoice}
                />
              )}

              {step === 4 && (
                <AdvancedSettings
                  config={{
                    provider: selectedProvider,
                    type: selectedType,
                    bandwidth: selectedBandwidth,
                    location: selectedLocation,
                    ...config
                  }}
                  onConfigChange={updateConfig}
                  billingChoice={billingChoice}
                  onBillingChange={updateBillingChoice}
                />
              )}

              {step === 5 && (
                <ReviewConfiguration
                  config={{
                    provider: selectedProvider,
                    type: selectedType,
                    bandwidth: selectedBandwidth,
                    location: selectedLocation,
                    ...config
                  }}
                  billingChoice={billingChoice}
                />
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-fw-error rounded-xl">
                <p className="text-figma-base text-fw-error">{error}</p>
              </div>
            )}

            {/* Footer buttons - Figma spec: pill buttons, h-9 */}
            <div className="mt-12 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Cancel: text button with X icon, 14px w500 #0057b8 */}
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center text-figma-base font-medium text-fw-link hover:text-fw-linkHover"
                >
                  <X className="h-5 w-5 mr-1" />
                  Cancel
                </button>
                {/* Save draft: text button, 14px w500 #0057b8 */}
                <button
                  className="text-figma-base font-medium text-fw-link hover:text-fw-linkHover"
                >
                  Save draft
                </button>
              </div>
              <div className="flex items-center gap-3">
                {/* Back button: stroke=#0057b8, rounded-full, h-9 */}
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="inline-flex items-center h-9 px-5 border border-fw-active text-figma-base font-medium text-fw-link rounded-full hover:bg-fw-primary/5 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 mr-1.5" />
                    Back
                  </button>
                )}
                {/* Next/Create button: disabled bg-[#dcdfe3] text-[#878c94], active bg-[#0057b8] text-white, rounded-full, h-9 */}
                {step === STEPS.length - 1 ? (
                  <button
                    onClick={() => {
                      if (selectedProvider && selectedType && selectedBandwidth && selectedLocation) {
                        handleComplete({
                          provider: selectedProvider,
                          type: selectedType,
                          bandwidth: selectedBandwidth,
                          location: selectedLocation,
                          ...config
                        });
                      } else {
                        setError('Please complete all required fields before creating the connection.');
                      }
                    }}
                    disabled={isSubmitting}
                    className={`inline-flex items-center h-9 px-5 text-figma-base font-medium rounded-full transition-colors ${
                      isSubmitting
                        ? 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
                        : 'bg-fw-primary text-white hover:bg-fw-primaryHover'
                    }`}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Connection'}
                    <ArrowRight className="h-5 w-5 ml-1.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className={`inline-flex items-center h-9 px-5 text-figma-base font-medium rounded-full transition-colors ${
                      !canProceed()
                        ? 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
                        : 'bg-fw-primary text-white hover:bg-fw-primaryHover'
                    }`}
                  >
                    Next
                    <ArrowRight className="h-5 w-5 ml-1.5" />
                  </button>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-fw-base rounded-3xl p-8">
      <ErrorBoundary
        fallback={
          <div className="p-8 text-center">
            <h3 className="text-figma-xl font-bold text-fw-error mb-4 tracking-[-0.03em]">Something went wrong</h3>
            <p className="text-fw-bodyLight mb-6">We encountered an error while setting up your connection wizard.</p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-fw-ctaPrimary text-white rounded-full hover:bg-fw-ctaPrimaryHover"
              >
                Reload Page
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-fw-neutral text-fw-body rounded-full hover:bg-fw-neutral"
              >
                Back to Connections
              </button>
            </div>
          </div>
        }
      >
        {renderContent()}
      </ErrorBoundary>
    </div>
  );
}