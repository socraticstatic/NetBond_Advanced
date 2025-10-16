import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code, Database, Zap, ArrowRight, ArrowLeft, Check, Upload, Download,
  PlayCircle, AlertCircle, CheckCircle, XCircle, Copy, RefreshCw,
  Globe, Lock, Key, FileJson, Plug, Network, Sparkles, Link2
} from 'lucide-react';
import { Button } from '../common/Button';
import { APIImportStep } from './steps/APIImportStep';
import { APIConfigureStep } from './steps/APIConfigureStep';
import { APIMappingStep } from './steps/APIMappingStep';
import { APITestStep } from './steps/APITestStep';
import { APIReviewStep } from './steps/APIReviewStep';

export interface APIConfig {
  name: string;
  description: string;
  baseUrl: string;
  authType: 'none' | 'apiKey' | 'bearer' | 'oauth2' | 'basic';
  authConfig?: {
    apiKey?: string;
    headerName?: string;
    token?: string;
    username?: string;
    password?: string;
  };
  endpoints: APIEndpoint[];
  headers?: Record<string, string>;
  timeout?: number;
  retryPolicy?: {
    enabled: boolean;
    maxRetries: number;
    backoffMultiplier: number;
  };
}

export interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description?: string;
  parameters?: APIParameter[];
  requestBody?: any;
  responseSchema?: any;
  mapping?: DataMapping;
}

export interface APIParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'body';
  type: string;
  required: boolean;
  description?: string;
  default?: any;
}

export interface DataMapping {
  source: string;
  target: string;
  transformation?: string;
  filter?: string;
}

export function APIToolbox() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [apiConfig, setApiConfig] = useState<Partial<APIConfig>>({
    authType: 'none',
    timeout: 30000,
    retryPolicy: {
      enabled: true,
      maxRetries: 3,
      backoffMultiplier: 2
    }
  });

  const steps = [
    {
      number: 1,
      title: 'Import API',
      description: 'Import OpenAPI/Swagger or JSON definition',
      icon: Upload,
      component: APIImportStep
    },
    {
      number: 2,
      title: 'Configure',
      description: 'Set authentication and connection details',
      icon: Key,
      component: APIConfigureStep
    },
    {
      number: 3,
      title: 'Map Data',
      description: 'Map API data to network connections',
      icon: Link2,
      component: APIMappingStep
    },
    {
      number: 4,
      title: 'Test',
      description: 'Test API connectivity and responses',
      icon: PlayCircle,
      component: APITestStep
    },
    {
      number: 5,
      title: 'Review',
      description: 'Review and deploy your API integration',
      icon: Check,
      component: APIReviewStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    window.addToast?.({
      type: 'success',
      title: 'API Integration Created',
      message: `API "${apiConfig.name}" has been successfully configured`,
      duration: 3000
    });
    navigate('/manage');
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Code className="h-8 w-8 mr-3 text-blue-600" />
                API Toolbox
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Connect external APIs and enhance your network with dynamic data integrations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/create')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white px-8 py-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                          isActive
                            ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                            : isCompleted
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div
                          className={`text-sm font-medium ${
                            isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 max-w-[120px]">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-24 h-0.5 mx-4 mb-8 transition-all ${
                          currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-8">
            <CurrentStepComponent
              config={apiConfig}
              onChange={setApiConfig}
              onNext={handleNext}
            />
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    icon={ArrowLeft}
                  >
                    Back
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500">
                  Step {currentStep} of {steps.length}
                </div>
                {currentStep < steps.length ? (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleComplete}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Complete Setup
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Smart Integration</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Automatically detects API schema and suggests optimal mappings
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start">
              <div className="p-3 bg-green-50 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Real-time Sync</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Keep your network data synchronized with external systems
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Enterprise Security</h3>
                <p className="mt-1 text-sm text-gray-500">
                  OAuth2, API keys, and secure credential management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
