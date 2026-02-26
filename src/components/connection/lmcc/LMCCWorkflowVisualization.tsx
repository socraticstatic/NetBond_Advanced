import React, { useState } from 'react';
import { Cloud, Building2, CheckCircle, AlertCircle, ArrowRight, Users, Lock, CreditCard, Settings, FileText, Zap } from 'lucide-react';
import { Button } from '../../common/Button';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  type: 'customer' | 'aws' | 'netbond' | 'business-center' | 'decision';
  icon: React.ComponentType<{ className?: string }>;
}

export default function LMCCWorkflowVisualization() {
  const [activeStep, setActiveStep] = useState<string>('customer-start');
  const [showAWSConsole, setShowAWSConsole] = useState(false);
  const [showBusinessCenter, setShowBusinessCenter] = useState(false);
  const [showNetBondPortal, setShowNetBondPortal] = useState(false);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'customer-start',
      title: 'Customer Initiates',
      description: 'Existing AT&T customer logs into AWS Console',
      status: activeStep === 'customer-start' ? 'active' : 'completed',
      type: 'customer',
      icon: Users
    },
    {
      id: 'aws-console',
      title: 'AWS Console',
      description: 'Navigate to Direct Connect, select AT&T connection option',
      status: activeStep === 'aws-console' ? 'active' : activeStep === 'customer-start' ? 'pending' : 'completed',
      type: 'aws',
      icon: Cloud
    },
    {
      id: 'aws-api-call',
      title: 'AWS API Integration',
      description: 'AWS calls AT&T API with customer details and connection parameters',
      status: activeStep === 'aws-api-call' ? 'active' : activeStep === 'customer-start' || activeStep === 'aws-console' ? 'pending' : 'completed',
      type: 'aws',
      icon: Zap
    },
    {
      id: 'netbond-portal',
      title: 'NetBond Advanced Portal',
      description: 'Customer receives notification to complete connection setup',
      status: activeStep === 'netbond-portal' ? 'active' : ['customer-start', 'aws-console', 'aws-api-call'].includes(activeStep) ? 'pending' : 'completed',
      type: 'netbond',
      icon: Settings
    },
    {
      id: 'business-center',
      title: 'Business Center Check',
      description: 'System validates if customer is registered with BC (3Wreqs) or needs registration',
      status: activeStep === 'business-center' ? 'active' : ['customer-start', 'aws-console', 'aws-api-call', 'netbond-portal'].includes(activeStep) ? 'pending' : 'completed',
      type: 'decision',
      icon: AlertCircle
    },
    {
      id: 'bc-registration',
      title: 'Business Center Registration',
      description: 'If needed, customer registers with Business Center for billing and account management',
      status: activeStep === 'bc-registration' ? 'active' : 'pending',
      type: 'business-center',
      icon: Building2
    },
    {
      id: 'customer-sign-email',
      title: 'Customer Authentication',
      description: 'Customer signs in with Email address for verification',
      status: activeStep === 'customer-sign-email' ? 'active' : 'pending',
      type: 'netbond',
      icon: Lock
    },
    {
      id: 'connection-configuration',
      title: 'Connection Configuration',
      description: 'Configure LMCC sites, bandwidth allocation, and TAO settings',
      status: activeStep === 'connection-configuration' ? 'active' : 'pending',
      type: 'netbond',
      icon: Settings
    },
    {
      id: 'billing-surprise',
      title: 'Billing Confirmation',
      description: 'Billing must be surprise-free for connections ordered from AWS',
      status: activeStep === 'billing-surprise' ? 'active' : 'pending',
      type: 'decision',
      icon: CreditCard
    },
    {
      id: 'aws-approval',
      title: 'AWS Console Final Review',
      description: 'AWS console displays connection details and billing information',
      status: activeStep === 'aws-approval' ? 'active' : 'pending',
      type: 'aws',
      icon: FileText
    },
    {
      id: 'provisioning',
      title: 'Connection Provisioning',
      description: 'NetBond Advanced provisions LMCC connection across selected sites',
      status: activeStep === 'provisioning' ? 'active' : 'pending',
      type: 'netbond',
      icon: Zap
    },
    {
      id: 'complete',
      title: 'Connection Active',
      description: 'LMCC connection is live and ready for use',
      status: activeStep === 'complete' ? 'active' : 'pending',
      type: 'netbond',
      icon: CheckCircle
    }
  ];

  const getStepColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-500 text-green-700';
      case 'active': return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'error': return 'bg-red-100 border-red-500 text-red-700';
      default: return 'bg-gray-100 border-gray-300 text-gray-500';
    }
  };

  const getTypeColor = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'aws': return 'bg-orange-50 border-orange-300';
      case 'netbond': return 'bg-blue-50 border-blue-300';
      case 'business-center': return 'bg-purple-50 border-purple-300';
      case 'decision': return 'bg-yellow-50 border-yellow-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">LMCC Integration Workflow</h2>
        <p className="text-sm text-gray-600 mt-1">
          Complete end-to-end flow from AWS Console to NetBond Advanced provisioning
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
          <span>AWS Console</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span>NetBond Advanced</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
          <span>Business Center</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>Decision Point</span>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="relative">
        <div className="space-y-4">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative">
                {/* Connector Line */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-8 bg-gray-300"></div>
                )}

                {/* Step Card */}
                <div
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${getTypeColor(step.type)} ${getStepColor(step.status)}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'active' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      {step.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                      {step.status === 'active' && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>

                    {/* Action Buttons */}
                    {step.status === 'active' && (
                      <div className="mt-3 flex gap-2">
                        {step.id === 'aws-console' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAWSConsole(true);
                            }}
                          >
                            View AWS Console Mockup
                          </Button>
                        )}
                        {step.id === 'bc-registration' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowBusinessCenter(true);
                            }}
                          >
                            Open Business Center
                          </Button>
                        )}
                        {step.id === 'netbond-portal' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowNetBondPortal(true);
                            }}
                          >
                            Open NetBond Portal
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = workflowSteps.findIndex(s => s.id === step.id);
                            if (currentIndex < workflowSteps.length - 1) {
                              setActiveStep(workflowSteps[currentIndex + 1].id);
                            }
                          }}
                        >
                          Continue <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Annotations */}
                {step.id === 'business-center' && (
                  <div className="ml-20 mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-gray-700">
                    <strong>Decision Point:</strong> Link will only work if customer is registered with BC (3Wreqs).
                    If not registered, customer must register with Business Center before proceeding.
                  </div>
                )}
                {step.id === 'billing-surprise' && (
                  <div className="ml-20 mt-2 p-3 bg-red-50 border-l-4 border-red-400 text-sm text-gray-700">
                    <strong>Critical Requirement:</strong> Billing must be surprise-free for connections ordered from AWS.
                    All cost parameters must be passed back to console for customer approval.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Integration Points */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Key Integration Points</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
            <span><strong>AWS API:</strong> AT&T receives connection request with customer parameters via REST API</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
            <span><strong>Business Center:</strong> Customer registration validated through 3Wreqs system</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
            <span><strong>NetBond Advanced:</strong> Portal handles LMCC configuration and provisioning</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
            <span><strong>Billing Integration:</strong> Connection costs must be displayed in AWS Console before final approval</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
            <span><strong>IP vs Cloud:</strong> LMCC provides IP to Cloud connectivity (not Internet to Cloud)</span>
          </li>
        </ul>
      </div>

      {/* AWS Console Mockup Modal */}
      {showAWSConsole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAWSConsole(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">AWS Direct Connect Console</h2>
                <button onClick={() => setShowAWSConsole(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm">
                  <div className="text-orange-400 mb-2">AWS Direct Connect &gt; Connections &gt; Create Connection</div>
                  <div className="space-y-2">
                    <div><span className="text-gray-400">Connection Name:</span> att-lmcc-connection-01</div>
                    <div><span className="text-gray-400">Location:</span> AT&T NetBond</div>
                    <div><span className="text-gray-400">Port Speed:</span> 10 Gbps</div>
                    <div><span className="text-gray-400">Partner:</span> AT&T</div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Next Step:</strong> After creating the connection in AWS, you'll receive a notification
                    to complete the setup in NetBond Advanced portal where you'll configure LMCC sites and bandwidth.
                  </p>
                </div>
                <Button onClick={() => { setShowAWSConsole(false); setActiveStep('aws-api-call'); }}>
                  Continue to NetBond
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Center Mockup Modal */}
      {showBusinessCenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowBusinessCenter(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">AT&T Business Center Registration</h2>
                <button onClick={() => setShowBusinessCenter(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter company name" />
                </div>
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                  <input type="email" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="email@company.com" />
                </div>
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                  <textarea className="w-full border border-gray-300 rounded px-3 py-2" rows={3} placeholder="Enter billing address"></textarea>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>3Wreqs Integration:</strong> This registration will link your account to Business Center
                    for billing and account management purposes.
                  </p>
                </div>
                <Button onClick={() => { setShowBusinessCenter(false); setActiveStep('customer-sign-email'); }}>
                  Complete Registration
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NetBond Portal Mockup Modal */}
      {showNetBondPortal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowNetBondPortal(false)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">NetBond Advanced Portal</h2>
                <button onClick={() => setShowNetBondPortal(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2">Connection Request from AWS</h3>
                  <div className="text-sm space-y-1">
                    <div><span className="text-gray-600">Request ID:</span> AWS-REQ-789012</div>
                    <div><span className="text-gray-600">Connection Type:</span> LMCC (Link Multipoint Cloud Connection)</div>
                    <div><span className="text-gray-600">Requested Bandwidth:</span> 10 Gbps</div>
                    <div><span className="text-gray-600">Status:</span> <span className="text-orange-600 font-medium">Pending Configuration</span></div>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    To complete your LMCC connection setup, you need to:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Select LMCC sites for your connection</li>
                    <li>Allocate bandwidth across selected sites</li>
                    <li>Configure Traffic Adapter Options (TAO)</li>
                    <li>Review and confirm billing details</li>
                  </ol>
                </div>
                <Button onClick={() => { setShowNetBondPortal(false); setActiveStep('connection-configuration'); }}>
                  Start Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
