export interface MockMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  operationCard?: OperationCard;
  thinking?: boolean;
}

export interface OperationCard {
  type: 'capacity' | 'cost' | 'schedule' | 'monitoring' | 'troubleshoot';
  title: string;
  summary: string;
  details: OperationDetail[];
  action?: {
    label: string;
    type: 'primary' | 'secondary';
  };
  metrics?: {
    label: string;
    value: string;
    change?: string;
    positive?: boolean;
  }[];
  timeline?: {
    start: string;
    end: string;
    duration: string;
  };
  cost?: {
    current: number;
    projected: number;
    savings: number;
  };
}

export interface OperationDetail {
  label: string;
  value: string;
  highlight?: boolean;
}

export const examplePrompts = [
  {
    id: 'capacity-scale',
    label: 'Scale capacity for event',
    prompt: 'Our marketing campaign launches tomorrow, ensure we have 3x capacity from 9am-5pm EST',
    icon: 'TrendingUp'
  },
  {
    id: 'cost-optimize',
    label: 'Optimize costs',
    prompt: 'Optimize costs while maintaining 99.9% SLA',
    icon: 'DollarSign'
  },
  {
    id: 'status-check',
    label: 'Check network status',
    prompt: 'Show me the status of all AWS connections',
    icon: 'Activity'
  },
  {
    id: 'troubleshoot',
    label: 'Troubleshoot issue',
    prompt: 'Why is latency high on our Azure connection?',
    icon: 'AlertTriangle'
  }
];

export interface NLPattern {
  patterns: string[];
  response: (matches: RegExpMatchArray | null, input: string) => {
    message: string;
    operationCard?: OperationCard;
  };
}

export const nlPatterns: NLPattern[] = [
  {
    patterns: [
      /(?:ensure|increase|scale|triple|double|boost).*?(\d+)x?\s*capacity/i,
      /(?:need|want|require).*?(\d+)x?\s*(?:more|additional).*?bandwidth/i,
      /(?:prepare|ready|setup).*?(?:campaign|event|launch|sale)/i
    ],
    response: (matches, input) => {
      const multiplier = matches?.[1] || '3';
      const hasTime = /(\d+(?:am|pm|:))/i.test(input);
      const hasTomorrow = /tomorrow/i.test(input);
      const hasDate = hasTomorrow || /\d{1,2}\/\d{1,2}/i.test(input);

      return {
        message: `I'll help you scale up your network capacity. Based on your request, I'll configure a ${multiplier}x capacity increase${hasDate ? ' scheduled for tomorrow' : ''}${hasTime ? ' during business hours (9am-5pm EST)' : ''}.`,
        operationCard: {
          type: 'capacity',
          title: 'Capacity Scaling Operation',
          summary: `Increase bandwidth by ${multiplier}x for peak demand`,
          details: [
            { label: 'Target Connections', value: 'AWS Primary, Azure West', highlight: true },
            { label: 'Capacity Multiplier', value: `${multiplier}x`, highlight: true },
            { label: 'Current Bandwidth', value: '1 Gbps' },
            { label: 'Scaled Bandwidth', value: `${multiplier} Gbps` },
            { label: 'Schedule', value: hasDate ? 'Tomorrow 9:00 AM - 5:00 PM EST' : 'Immediate' },
            { label: 'Auto-Revert', value: hasDate ? 'Yes, after 5:00 PM EST' : 'Manual' },
            { label: 'Estimated Cost', value: `$${(parseInt(multiplier) - 1) * 450}/day` }
          ],
          action: {
            label: 'Confirm & Schedule',
            type: 'primary'
          },
          metrics: [
            { label: 'Bandwidth', value: `${multiplier} Gbps`, change: `+${(parseInt(multiplier) - 1) * 100}%`, positive: true },
            { label: 'Capacity Headroom', value: '67%', change: '+45%', positive: true }
          ],
          timeline: hasDate ? {
            start: 'Tomorrow 9:00 AM EST',
            end: 'Tomorrow 5:00 PM EST',
            duration: '8 hours'
          } : undefined,
          cost: {
            current: 1200,
            projected: 1200 + ((parseInt(multiplier) - 1) * 450),
            savings: 0
          }
        }
      };
    }
  },
  {
    patterns: [
      /optimize.*?cost/i,
      /reduce.*?(?:cost|spending|bill)/i,
      /(?:save|lower).*?(?:money|expense)/i,
      /maintain.*?(?:\d+\.?\d*%?).*?sla/i
    ],
    response: (matches, input) => {
      const hasSLA = /(\d+\.?\d*)%?\s*sla/i.exec(input);
      const slaTarget = hasSLA ? hasSLA[1] : '99.9';

      return {
        message: `I've analyzed your current network configuration and found several optimization opportunities. I can reduce costs by 23% while maintaining your ${slaTarget}% SLA target.`,
        operationCard: {
          type: 'cost',
          title: 'Cost Optimization Plan',
          summary: `Reduce monthly costs by $2,750 while maintaining ${slaTarget}% uptime`,
          details: [
            { label: 'Current Monthly Cost', value: '$12,000' },
            { label: 'Optimized Monthly Cost', value: '$9,250', highlight: true },
            { label: 'Annual Savings', value: '$33,000', highlight: true },
            { label: 'SLA Guarantee', value: `${slaTarget}% uptime` },
            { label: 'Optimization Method', value: 'Bandwidth right-sizing + Connection consolidation' },
            { label: 'Affected Connections', value: '4 connections' },
            { label: 'Implementation Time', value: '15 minutes' }
          ],
          action: {
            label: 'Review & Apply',
            type: 'primary'
          },
          metrics: [
            { label: 'Cost Reduction', value: '23%', change: '-$2,750/mo', positive: true },
            { label: 'SLA Maintained', value: `${slaTarget}%`, change: '0%', positive: true },
            { label: 'Bandwidth Efficiency', value: '87%', change: '+12%', positive: true }
          ],
          cost: {
            current: 12000,
            projected: 9250,
            savings: 2750
          }
        }
      };
    }
  },
  {
    patterns: [
      /(?:show|check|status|what.?s).*?(?:aws|azure|google|all).*?connection/i,
      /(?:how|are).*?connection.*?(?:doing|performing)/i,
      /network.*?(?:status|health)/i
    ],
    response: (matches, input) => {
      const provider = /aws/i.test(input) ? 'AWS' : /azure/i.test(input) ? 'Azure' : /google/i.test(input) ? 'Google' : 'All';
      const connectionCount = provider === 'All' ? 8 : provider === 'AWS' ? 3 : 2;

      return {
        message: `Here's the current status of your ${provider} connection${connectionCount > 1 ? 's' : ''}. ${connectionCount > 1 ? 'All are' : 'It is'} operating normally with healthy performance metrics.`,
        operationCard: {
          type: 'monitoring',
          title: `${provider} Connection Status`,
          summary: `${connectionCount} active connection${connectionCount > 1 ? 's' : ''} with optimal performance`,
          details: [
            { label: 'Active Connections', value: `${connectionCount}`, highlight: true },
            { label: 'Overall Status', value: 'Healthy', highlight: true },
            { label: 'Average Latency', value: '12ms' },
            { label: 'Packet Loss', value: '0.01%' },
            { label: 'Bandwidth Utilization', value: '64%' },
            { label: 'Uptime (30d)', value: '99.98%' },
            { label: 'Last Incident', value: '23 days ago' }
          ],
          metrics: [
            { label: 'Latency', value: '12ms', change: '-2ms', positive: true },
            { label: 'Throughput', value: '8.2 Gbps', change: '+5%', positive: true },
            { label: 'Availability', value: '99.98%', change: '+0.01%', positive: true }
          ]
        }
      };
    }
  },
  {
    patterns: [
      /(?:why|what.?s).*?(?:latency|slow|performance|issue)/i,
      /troubleshoot.*?(?:azure|aws|connection)/i,
      /(?:problem|issue).*?connection/i
    ],
    response: (matches, input) => {
      const provider = /azure/i.test(input) ? 'Azure' : /aws/i.test(input) ? 'AWS' : 'primary';

      return {
        message: `I've analyzed the ${provider} connection and identified the root cause of the elevated latency. The issue is related to a suboptimal routing path through a congested peer.`,
        operationCard: {
          type: 'troubleshoot',
          title: 'Performance Diagnosis',
          summary: 'Identified routing inefficiency causing 40% latency increase',
          details: [
            { label: 'Issue Detected', value: 'Suboptimal routing path', highlight: true },
            { label: 'Affected Connection', value: `${provider} East` },
            { label: 'Current Latency', value: '28ms (↑40%)' },
            { label: 'Expected Latency', value: '12ms' },
            { label: 'Root Cause', value: 'Traffic routing through congested peer' },
            { label: 'Recommended Fix', value: 'Enable direct peering path' },
            { label: 'Time to Resolve', value: '2-3 minutes' }
          ],
          action: {
            label: 'Apply Fix',
            type: 'primary'
          },
          metrics: [
            { label: 'Latency Reduction', value: '57%', change: '-16ms', positive: true },
            { label: 'Path Efficiency', value: '95%', change: '+28%', positive: true }
          ]
        }
      };
    }
  },
  {
    patterns: [
      /(?:create|setup|new).*?connection/i,
      /connect.*?(?:to|with).*?(?:aws|azure|google)/i
    ],
    response: (matches, input) => {
      const provider = /aws/i.test(input) ? 'AWS' : /azure/i.test(input) ? 'Azure' : /google/i.test(input) ? 'Google Cloud' : 'cloud provider';

      return {
        message: `I'll help you set up a new ${provider} connection. Based on your requirements, I recommend a 1 Gbps Direct Connect with redundancy.`,
        operationCard: {
          type: 'schedule',
          title: 'New Connection Setup',
          summary: `Configure ${provider} Direct Connect with high availability`,
          details: [
            { label: 'Provider', value: provider, highlight: true },
            { label: 'Connection Type', value: 'Direct Connect' },
            { label: 'Bandwidth', value: '1 Gbps' },
            { label: 'Redundancy', value: 'Active-Active' },
            { label: 'Location', value: 'US East' },
            { label: 'Setup Time', value: '5-7 business days' },
            { label: 'Monthly Cost', value: '$1,200' }
          ],
          action: {
            label: 'Start Configuration',
            type: 'primary'
          }
        }
      };
    }
  },
  {
    patterns: [
      /(?:prepare|ready).*?(?:black friday|holiday|peak|busy season)/i,
      /handle.*?(?:traffic|load).*?(?:spike|increase)/i
    ],
    response: () => {
      return {
        message: `I'll prepare your network for peak season. I recommend a comprehensive scaling strategy across all critical connections with automated monitoring and fallback procedures.`,
        operationCard: {
          type: 'capacity',
          title: 'Peak Season Preparation',
          summary: 'Multi-connection scaling with auto-failover and monitoring',
          details: [
            { label: 'Scaling Strategy', value: 'Progressive capacity increase', highlight: true },
            { label: 'Affected Connections', value: 'All AWS & Azure (5 total)' },
            { label: 'Capacity Increase', value: '5x during peak hours' },
            { label: 'Schedule', value: 'Nov 24-27, 6am-11pm EST' },
            { label: 'Auto-Monitoring', value: 'Real-time with alerts' },
            { label: 'Failover', value: 'Automatic to backup paths' },
            { label: 'Total Additional Cost', value: '$3,200 for 4 days' }
          ],
          action: {
            label: 'Configure Peak Strategy',
            type: 'primary'
          },
          metrics: [
            { label: 'Total Capacity', value: '40 Gbps', change: '+32 Gbps', positive: true },
            { label: 'Headroom', value: '72%', change: '+55%', positive: true },
            { label: 'Redundancy', value: '100%', change: '+25%', positive: true }
          ],
          timeline: {
            start: 'Nov 24, 6:00 AM EST',
            end: 'Nov 27, 11:00 PM EST',
            duration: '4 days'
          }
        }
      };
    }
  }
];

export function findMatchingPattern(input: string): { message: string; operationCard?: OperationCard } | null {
  for (const pattern of nlPatterns) {
    for (const regex of pattern.patterns) {
      const match = input.match(regex);
      if (match) {
        return pattern.response(match, input);
      }
    }
  }
  return null;
}

export const defaultResponses = {
  greeting: "Hello! I'm your NetBond AI Assistant. I can help you manage your network connections using natural language. Try asking me to scale capacity, optimize costs, check connection status, or troubleshoot issues.",
  unclear: "I'm not quite sure what you'd like me to do. Could you try rephrasing? For example, you can say things like:\n\n• 'Increase capacity by 3x tomorrow from 9am-5pm'\n• 'Optimize costs while maintaining 99.9% SLA'\n• 'Show me the status of all AWS connections'\n• 'Why is latency high on my Azure connection?'",
  help: "I can help you with:\n\n**Capacity Management**\n• Scale bandwidth up or down\n• Schedule capacity changes\n• Prepare for traffic spikes\n\n**Cost Optimization**\n• Analyze spending patterns\n• Recommend optimizations\n• Maintain SLA targets\n\n**Monitoring**\n• Check connection status\n• View performance metrics\n• Track uptime and availability\n\n**Troubleshooting**\n• Diagnose performance issues\n• Identify root causes\n• Apply recommended fixes\n\nJust describe what you need in plain English!"
};
