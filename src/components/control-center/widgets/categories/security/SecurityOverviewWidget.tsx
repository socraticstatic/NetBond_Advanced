import { Shield, Lock, Activity, AlertTriangle } from 'lucide-react';
import { Connection } from '../../../../../types';

interface SecurityOverviewWidgetProps {
  connections: Connection[];
}

export function SecurityOverviewWidget({ connections }: SecurityOverviewWidgetProps) {
  // Calculate security metrics
  const secureConnections = connections.filter(c =>
    c.security?.encryption &&
    c.security?.firewall &&
    c.security?.ddosProtection
  ).length;

  const securityScore = Math.round((secureConnections / connections.length) * 100);
  const activeThreats = 2; // Example value
  const vulnerabilities = 5; // Example value
  const complianceScore = 98; // Example value

  return (
    <div className="space-y-4">
      {/* Security Score */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em]">{securityScore}%</div>
          <div className="flex items-center mt-1">
            <Shield className="h-4 w-4 text-fw-success mr-1" />
            <span className="text-figma-base text-fw-success">Security Score</span>
          </div>
        </div>
        <div className="h-16 w-16 rounded-full border-4 border-fw-success flex items-center justify-center">
          <span className="text-figma-lg font-bold text-fw-success">{securityScore}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-fw-errorLight rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <AlertTriangle className="h-4 w-4 text-fw-error" />
            <span className="text-figma-sm text-fw-error">Threats</span>
          </div>
          <div className="text-xl font-bold text-fw-error">{activeThreats}</div>
        </div>

        <div className="p-3 bg-fw-warn/10 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <Shield className="h-4 w-4 text-fw-warn" />
            <span className="text-figma-sm text-fw-warn">Vulnerabilities</span>
          </div>
          <div className="text-xl font-bold text-fw-warn">{vulnerabilities}</div>
        </div>

        <div className="p-3 bg-fw-successLight rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <Lock className="h-4 w-4 text-fw-success" />
            <span className="text-figma-sm text-fw-success">Compliance</span>
          </div>
          <div className="text-xl font-bold text-fw-success">{complianceScore}%</div>
        </div>
      </div>

      {/* Security Features */}
      <div className="space-y-2">
        {[
          { name: 'Encryption', enabled: true },
          { name: 'Firewall', enabled: true },
          { name: 'DDoS Protection', enabled: true },
          { name: 'IPSec', enabled: true }
        ].map((feature) => (
          <div key={feature.name} className="flex items-center justify-between p-2 bg-fw-wash rounded-lg">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-fw-bodyLight mr-2" />
              <span className="text-figma-base text-fw-body">{feature.name}</span>
            </div>
            <span className={`text-figma-base ${feature.enabled ? 'text-fw-success' : 'text-fw-error'}`}>
              {feature.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
