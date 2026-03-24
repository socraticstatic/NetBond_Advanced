import { useState } from 'react';
import { 
  GitBranch, GitCommit, GitMerge, GitPullRequest, History, 
  Clock, Check, AlertTriangle, ArrowLeft, ArrowRight,
  Download, Upload, RefreshCw, Lock, Diff, Command
} from 'lucide-react';
import { Button } from '../../common/Button';

interface Version {
  id: string;
  number: string;
  timestamp: string;
  author: string;
  type: 'major' | 'minor' | 'patch' | 'config';
  status: 'deployed' | 'pending' | 'rollback' | 'failed';
  changes: Array<{
    component: string;
    type: 'added' | 'modified' | 'removed';
    description: string;
  }>;
  metadata: {
    deploymentId?: string;
    environment: string;
    approvedBy?: string;
    reviewers: string[];
    deploymentStatus: 'deployed' | 'pending' | 'failed';
    rollbackVersion?: string;
    configHash: string;
    dependencies: {
      name: string;
      version: string;
    }[];
  };
  compliance: {
    changeRequest: string;
    riskAssessment: 'low' | 'medium' | 'high';
    approvals: {
      required: number;
      received: number;
    };
    auditTrail: {
      created: string;
      reviewed: string;
      deployed: string;
    };
  };
}

interface VersioningConfigurationProps {
  connectionId: string;
  currentVersion: string;
}

export function VersioningConfiguration({ connectionId, currentVersion }: VersioningConfigurationProps) {
  const [versions] = useState<Version[]>([
    {
      id: 'v1.0.0',
      number: '1.0.0',
      timestamp: '2024-03-10T15:30:00Z',
      author: 'Sarah Chen',
      type: 'major',
      status: 'deployed',
      changes: [
        {
          component: 'Security',
          type: 'added',
          description: 'Implemented AES-256 encryption'
        },
        {
          component: 'Network',
          type: 'added',
          description: 'Configured BGP routing'
        }
      ],
      metadata: {
        deploymentId: 'dep-001',
        environment: 'production',
        approvedBy: 'John Smith',
        reviewers: ['John Smith', 'Maria Garcia'],
        deploymentStatus: 'deployed',
        configHash: 'abc123',
        dependencies: [
          { name: 'routing-module', version: '2.1.0' },
          { name: 'security-module', version: '1.5.0' }
        ]
      },
      compliance: {
        changeRequest: 'CR-001',
        riskAssessment: 'low',
        approvals: {
          required: 2,
          received: 2
        },
        auditTrail: {
          created: '2024-03-10T14:00:00Z',
          reviewed: '2024-03-10T14:30:00Z',
          deployed: '2024-03-10T15:30:00Z'
        }
      }
    },
    {
      id: 'v1.1.0',
      number: '1.1.0',
      timestamp: '2024-03-11T10:15:00Z',
      author: 'Maria Garcia',
      type: 'minor',
      status: 'deployed',
      changes: [
        {
          component: 'QoS',
          type: 'added',
          description: 'Added traffic prioritization'
        }
      ],
      metadata: {
        deploymentId: 'dep-002',
        environment: 'production',
        approvedBy: 'John Smith',
        reviewers: ['John Smith', 'Sarah Chen'],
        deploymentStatus: 'deployed',
        configHash: 'def456',
        dependencies: [
          { name: 'qos-module', version: '1.0.0' }
        ]
      },
      compliance: {
        changeRequest: 'CR-002',
        riskAssessment: 'medium',
        approvals: {
          required: 2,
          received: 2
        },
        auditTrail: {
          created: '2024-03-11T09:00:00Z',
          reviewed: '2024-03-11T09:30:00Z',
          deployed: '2024-03-11T10:15:00Z'
        }
      }
    }
  ]);

  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const getStatusColor = (status: Version['status']) => {
    switch (status) {
      case 'deployed':
        return 'bg-fw-successLight text-fw-success';
      case 'pending':
        return 'bg-fw-warn/10 text-fw-warn';
      case 'rollback':
        return 'bg-fw-accent text-fw-linkHover';
      case 'failed':
        return 'bg-fw-errorLight text-fw-error';
    }
  };

  const getTypeColor = (type: Version['type']) => {
    switch (type) {
      case 'major':
        return 'bg-fw-purpleLight text-fw-purple';
      case 'minor':
        return 'bg-fw-accent text-fw-linkHover';
      case 'patch':
        return 'bg-fw-successLight text-fw-success';
      case 'config':
        return 'bg-fw-neutral text-fw-heading';
    }
  };

  const getChangeTypeColor = (type: 'added' | 'modified' | 'removed') => {
    switch (type) {
      case 'added':
        return 'text-fw-success';
      case 'modified':
        return 'text-fw-link';
      case 'removed':
        return 'text-fw-error';
    }
  };

  return (
    <div className="space-y-6">
      {/* Version Control Header */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.04em]">Version Control</h3>
            <span className="px-2 py-1 text-figma-sm bg-fw-accent text-brand-blue rounded-lg">
              Current: v{currentVersion}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              icon={History}
              onClick={() => setShowHistory(!showHistory)}
            >
              Version History
            </Button>
            <Button
              variant="outline"
              icon={Diff}
              onClick={() => setShowDiff(true)}
              disabled={selectedVersions.length !== 2}
              className={
                selectedVersions.length === 2
                  ? "border-brand-blue text-brand-blue hover:bg-brand-blue/5"
                  : ""
              }
            >
              Compare Versions
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-fw-accent rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-figma-base font-medium text-fw-linkHover">Create Version</span>
              <GitCommit className="h-5 w-5 text-fw-link" />
            </div>
            <p className="text-figma-sm text-fw-link mb-3">Create a new version from current configuration</p>
            <Button variant="primary" className="w-full">
              Create Version
            </Button>
          </div>

          <div className="p-4 bg-fw-successLight rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-figma-base font-medium text-fw-success">Backup Configuration</span>
              <Download className="h-5 w-5 text-fw-success" />
            </div>
            <p className="text-figma-sm text-fw-success mb-3">Export current configuration as backup</p>
            <Button variant="primary" className="w-full bg-fw-success hover:bg-fw-success">
              Export Config
            </Button>
          </div>

          <div className="p-4 bg-fw-purpleLight rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-figma-base font-medium text-fw-purple">Restore Version</span>
              <Upload className="h-5 w-5 text-fw-purple" />
            </div>
            <p className="text-figma-sm text-fw-purple mb-3">Restore configuration from backup</p>
            <Button variant="primary" className="w-full bg-fw-purple hover:bg-fw-purple">
              Restore Config
            </Button>
          </div>
        </div>

        {/* Version Timeline or List */}
        {showHistory ? (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-fw-neutral" />
            <div className="space-y-6">
              {versions.map((version) => (
                <div key={version.id} className="relative pl-8">
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    version.id === currentVersion
                      ? 'bg-fw-cobalt-600 text-white'
                      : 'bg-fw-neutral text-fw-bodyLight'
                  }`}>
                    <GitCommit className="h-4 w-4" />
                  </div>
                  <div className="bg-fw-base p-4 rounded-2xl border border-fw-secondary">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-fw-heading">v{version.number}</span>
                        <span className={`px-2 py-1 text-figma-sm font-medium rounded-lg ${getTypeColor(version.type)}`}>
                          {version.type}
                        </span>
                        <span className={`px-2 py-1 text-figma-sm font-medium rounded-lg ${getStatusColor(version.status)}`}>
                          {version.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-figma-sm text-fw-bodyLight">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(version.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      {version.changes.map((change, idx) => (
                        <div key={idx} className={`text-figma-base ${getChangeTypeColor(change.type)}`}>
                          {change.type === 'added' && '+'}
                          {change.type === 'removed' && '-'}
                          {change.type === 'modified' && '•'}
                          {change.component}: {change.description}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-figma-base">
                      <div className="flex items-center space-x-2">
                        <span className="text-fw-bodyLight">Author:</span>
                        <span className="font-medium text-fw-heading">{version.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-fw-bodyLight">CR:</span>
                        <span className="font-medium text-fw-heading">{version.compliance.changeRequest}</span>
                      </div>
                    </div>

                    {version.metadata.approvedBy && (
                      <div className="mt-2 pt-2 border-t border-fw-secondary flex items-center justify-between text-figma-base">
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-fw-success" />
                          <span className="text-fw-bodyLight">Approved by {version.metadata.approvedBy}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-fw-bodyLight">Risk:</span>
                          <span className={`font-medium ${
                            version.compliance.riskAssessment === 'low' ? 'text-fw-success' :
                            version.compliance.riskAssessment === 'medium' ? 'text-fw-warn' : 'text-fw-error'
                          }`}>
                            {version.compliance.riskAssessment}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-4 border rounded-2xl ${
                  selectedVersions.includes(version.id)
                    ? 'border-fw-active bg-fw-accent'
                    : 'border-fw-secondary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedVersions.includes(version.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (selectedVersions.length < 2) {
                            setSelectedVersions([...selectedVersions, version.id]);
                          }
                        } else {
                          setSelectedVersions(selectedVersions.filter(id => id !== version.id));
                        }
                      }}
                      className="rounded border-fw-secondary text-fw-link"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-fw-heading">Version {version.number}</span>
                        <span className={`px-2 py-1 text-figma-sm font-medium rounded-lg ${getTypeColor(version.type)}`}>
                          {version.type}
                        </span>
                        {version.id === currentVersion && (
                          <span className="px-2 py-1 text-figma-sm font-medium bg-fw-accent text-fw-linkHover rounded-lg">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-figma-sm text-fw-bodyLight mt-1">
                        {new Date(version.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      className="text-fw-bodyLight hover:text-fw-body p-2 rounded-full hover:bg-fw-neutral"
                      title="Download Configuration"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      className="text-fw-bodyLight hover:text-fw-body p-2 rounded-full hover:bg-fw-neutral"
                      title="Restore Version"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </button>
                    <button
                      className="text-fw-bodyLight hover:text-fw-body p-2 rounded-full hover:bg-fw-neutral"
                      title="Lock Version"
                    >
                      <Lock className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Version Details */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-figma-base">
                  <div>
                    <span className="text-fw-bodyLight">Change Request:</span>
                    <span className="ml-2 text-fw-heading">{version.compliance.changeRequest}</span>
                  </div>
                  <div>
                    <span className="text-fw-bodyLight">Risk Level:</span>
                    <span className={`ml-2 font-medium ${
                      version.compliance.riskAssessment === 'low' ? 'text-fw-success' :
                      version.compliance.riskAssessment === 'medium' ? 'text-fw-warn' : 'text-fw-error'
                    }`}>
                      {version.compliance.riskAssessment.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-fw-bodyLight">Approvals:</span>
                    <span className="ml-2 text-fw-heading">
                      {version.compliance.approvals.received}/{version.compliance.approvals.required}
                    </span>
                  </div>
                  <div>
                    <span className="text-fw-bodyLight">Environment:</span>
                    <span className="ml-2 text-fw-heading">{version.metadata.environment}</span>
                  </div>
                </div>

                {/* Dependencies */}
                <div className="mt-4">
                  <span className="text-figma-sm text-fw-bodyLight">Dependencies:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {version.metadata.dependencies.map((dep) => (
                      <span key={dep.name} className="px-2 py-1 text-figma-sm bg-fw-neutral text-fw-body rounded-lg">
                        {dep.name}@{dep.version}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}