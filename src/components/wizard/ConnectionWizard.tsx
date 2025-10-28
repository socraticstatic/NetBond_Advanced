import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { WizardProgress } from './WizardProgress';
import { useWizard } from '../../hooks/useWizard';
import { CloudProvider, ConnectionType, BandwidthOption, LocationOption, ConnectionConfig } from '../../types/connection';
import { Step1RouterNaming } from './screens/Step1RouterNaming';
import { Step2ConnectionType } from './screens/Step2ConnectionType';
import { Step3ProviderSelection } from './screens/Step3ProviderSelection';
import { Step4ResiliencySelection } from './screens/Step4ResiliencySelection';
import { Step5LocationBandwidth } from './screens/Step5LocationBandwidth';
import { Step6Review } from './screens/Step6Review';
import { ModeSelection } from './modes';
import { useStore } from '../../store/useStore';
import { Connection, NetworkNode, NetworkEdge } from '../../types';
import { AsyncBoundary } from '../common/AsyncBoundary';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { handleApiError } from '../../utils/errorHandling';
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

const TOTAL_STEPS = 6;

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

  // If in edit mode or if mode is specified in location state, use that mode
  const initialMode = editMode || (locationState?.editMode) ? 'visual' :
                     locationState?.mode ? locationState.mode as WizardMode :
                     null;

  // Get initialConnection from props or location state
  const connectionToEdit = initialConnection || locationState?.initialConnection;
  const isEditMode = editMode || locationState?.editMode || false;

  // Initialize with mode from navigation state or props
  const [mode, setMode] = useState<WizardMode | null>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the new wizard hook for step-by-step mode
  const {
    wizard,
    updateWizard,
    nextStep,
    prevStep,
    toggleProvider,
    updateProviderConfig,
    reset
  } = useWizard();

  // For visual editor, convert connection to nodes and edges
  const [initialNodes, setInitialNodes] = useState<NetworkNode[]>([]);
  const [initialEdges, setInitialEdges] = useState<NetworkEdge[]>([]);

  // Initialize from existing connection if provided
  useEffect(() => {
    if (connectionToEdit && mode === 'visual') {
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
    }
  }, [connectionToEdit, mode, locationState]);

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
    reset();
    setError(null);
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

      // Standard wizard flow - create connections for each provider
      // This handles the new wizard format where we can select multiple providers

      try {
        // Create a connection for each selected provider
        for (const provider of wizard.selectedProviders) {
          const providerConfig = wizard.providerConfigurations[provider];

          // Generate connection name
          const baseName = `${wizard.routerName} - ${provider} - ${providerConfig.location}`;
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
            type: wizard.connectionType as ConnectionType,
            status: 'Inactive' as const,
            bandwidth: providerConfig.bandwidth as string,
            location: providerConfig.location as string,
            provider: provider,
            features: {
              dedicatedConnection: true,
              redundantPath: wizard.resiliencyLevel === 'maximum',
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
            }
          };

          await addConnection(newConnection);
        }

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


  // If no mode is selected, show the mode selection screen
  if (!mode) {
    return (
      <div className="bg-white rounded-2xl shadow-xl">
        <ModeSelection onModeSelect={handleModeChange} onCancel={handleCancel} />
      </div>
    );
  }

  const renderContent = () => {
    switch (mode) {
      case 'visual':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setMode(null)}
                className="text-brand-blue hover:text-brand-darkBlue flex items-center"
              >
                Change Creation Mode
              </button>
            </div>
            <AsyncBoundary 
              fallback={
                <div className="min-h-[800px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Loading Network Designer...</p>
                  </div>
                </div>
              }
              errorFallback={
                <div className="min-h-[800px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="text-center max-w-md p-8">
                    <h3 className="text-xl font-bold text-red-800 mb-4">Unable to load Network Designer</h3>
                    <p className="text-gray-600 mb-6">We encountered an error loading the network designer component. This might be due to browser compatibility issues or network problems.</p>
                    <div className="space-y-4">
                      <button
                        onClick={() => setMode('step-by-step')}
                        className="w-full px-6 py-3 bg-brand-blue text-white rounded-xl hover:bg-brand-darkBlue"
                      >
                        Switch to Step-by-Step Wizard
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
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
                <div className="min-h-[800px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Loading Network Designer...</p>
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
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={() => setMode(null)}
                className="text-brand-blue hover:text-brand-darkBlue flex items-center text-sm font-medium"
              >
                Change Creation Mode
              </button>
            </div>

            <WizardProgress currentStep={wizard.step} totalSteps={TOTAL_STEPS} />

            <div className="max-w-6xl mx-auto">
              {wizard.step === 1 && (
                <Step1RouterNaming
                  wizard={wizard}
                  onUpdateWizard={updateWizard}
                  onNext={nextStep}
                  onCancel={handleCancel}
                />
              )}

              {wizard.step === 2 && (
                <Step2ConnectionType
                  wizard={wizard}
                  onUpdateWizard={updateWizard}
                  onNext={nextStep}
                  onPrevious={prevStep}
                />
              )}

              {wizard.step === 3 && (
                <Step3ProviderSelection
                  wizard={wizard}
                  onToggleProvider={toggleProvider}
                  onNext={nextStep}
                  onPrevious={prevStep}
                />
              )}

              {wizard.step === 4 && (
                <Step4ResiliencySelection
                  wizard={wizard}
                  onUpdateWizard={updateWizard}
                  onNext={nextStep}
                  onPrevious={prevStep}
                />
              )}

              {wizard.step === 5 && (
                <Step5LocationBandwidth
                  wizard={wizard}
                  onUpdateProviderConfig={updateProviderConfig}
                  onNext={nextStep}
                  onPrevious={prevStep}
                />
              )}

              {wizard.step === 6 && (
                <Step6Review
                  wizard={wizard}
                  onPrevious={prevStep}
                  onSubmit={() => handleComplete(wizard as any)}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-6xl mx-auto">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Cancel button for steps 2-6 (step 1 has its own buttons) */}
            {wizard.step > 1 && (
              <div className="mt-8 max-w-6xl mx-auto">
                <button
                  onClick={handleCancel}
                  className="px-8 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <ErrorBoundary 
        fallback={
          <div className="p-8 text-center">
            <h3 className="text-xl font-bold text-red-800 mb-4">Something went wrong</h3>
            <p className="text-gray-600 mb-6">We encountered an error while setting up your connection wizard.</p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-brand-blue text-white rounded-xl hover:bg-brand-darkBlue"
              >
                Reload Page
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
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