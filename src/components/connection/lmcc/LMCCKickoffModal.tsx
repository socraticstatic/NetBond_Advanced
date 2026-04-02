import { CheckCircle2, ArrowRight, Shield, Server, ExternalLink } from 'lucide-react';
import { Button } from '../../common/Button';
import { LMCCConnection } from '../../../types/lmcc';
import { formatBandwidth } from '../../../data/lmccService';

interface LMCCKickoffModalProps {
  connection: LMCCConnection;
  isOpen: boolean;
  onClose: () => void;
  onStartSetup: () => void;
}

const PHASES = [
  {
    number: '1',
    title: 'ACCEPT',
    description: 'Accept 4 hosted connections in your AWS Console',
    detail: 'Each connection must be individually accepted before it can carry traffic.',
  },
  {
    number: '2',
    title: 'SET UP',
    description: 'Configure BGP, naming, and monitoring in NetBond Advanced',
    detail: 'Provide your BGP ASN, choose alert preferences, and name your Cloud Router.',
  },
  {
    number: '3',
    title: 'ACTIVATE',
    description: 'Confirm billing and go live',
    detail: 'Review your configuration, acknowledge billing terms, and activate.',
  },
];

export function LMCCKickoffModal({ connection, isOpen, onClose, onStartSetup }: LMCCKickoffModalProps) {
  if (!isOpen) return null;

  const activePaths = connection.paths.filter(p => p.status === 'active').length;
  const pendingPaths = connection.paths.filter(p => p.status === 'pending').length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-fw-base rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with AWS branding */}
        <div className="px-6 py-5 bg-fw-wash border-b border-fw-secondary">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded-lg bg-fw-base border border-fw-secondary flex items-center justify-center p-1">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em]">New LMCC Connection Detected</h2>
              <p className="text-figma-xs text-fw-bodyLight">AWS Direct Connect - Maximum Resiliency</p>
            </div>
          </div>
        </div>

        {/* Connection summary */}
        <div className="px-6 py-4 border-b border-fw-secondary">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-fw-link" />
            <span className="text-figma-sm font-semibold text-fw-heading">{connection.metro.name}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[10px] font-medium" style={{ color: '#0057b8', backgroundColor: 'rgba(0,87,184,0.16)' }}>4 paths</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {connection.metro.datacenters.map((dc, i) => (
              <div key={dc} className="flex items-center gap-1.5 p-2 rounded-lg bg-fw-wash border border-fw-secondary text-figma-xs">
                <Server className="h-3 w-3 text-fw-bodyLight" />
                <span className="text-fw-heading font-medium">{dc}</span>
                <span className="text-fw-bodyLight">- 2 IPEs</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-figma-xs text-fw-bodyLight">
            <span>AWS Account: {connection.awsAccountId}</span>
            <span>{formatBandwidth(connection.bandwidth)} per path</span>
          </div>
        </div>

        {/* 3 phases */}
        <div className="px-6 py-5">
          <p className="text-figma-sm text-fw-body mb-4">
            AT&T has provisioned your 4 hosted connections. To activate, complete these 3 steps:
          </p>

          <div className="space-y-3">
            {PHASES.map((phase) => (
              <div key={phase.number} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-fw-primary text-white flex items-center justify-center text-figma-sm font-bold shrink-0 mt-0.5">
                  {phase.number}
                </div>
                <div>
                  <p className="text-figma-sm font-bold text-fw-heading">{phase.title}</p>
                  <p className="text-figma-xs text-fw-body">{phase.description}</p>
                  <p className="text-figma-xs text-fw-bodyLight mt-0.5">{phase.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Acceptance status */}
          {pendingPaths > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-fw-warn/10 border border-fw-warn/30">
              <div className="flex items-center justify-between">
                <p className="text-figma-xs text-fw-warn font-medium">
                  {pendingPaths} of 4 connections awaiting acceptance in AWS Console
                </p>
                <a
                  href="https://console.aws.amazon.com/directconnect/v2/home#/connections"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-figma-xs text-fw-link hover:text-fw-linkHover flex items-center gap-1"
                >
                  Open AWS Console
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-fw-secondary bg-fw-wash flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-figma-sm font-medium text-fw-bodyLight hover:text-fw-body"
          >
            I'll Do This Later
          </button>
          <Button variant="primary" size="sm" onClick={onStartSetup}>
            Start Setup
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
