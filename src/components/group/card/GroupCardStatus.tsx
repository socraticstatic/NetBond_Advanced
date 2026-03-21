import { Group } from '../../../types/group';

interface GroupCardStatusProps {
  group: Group;
}

export function GroupCardStatus({ group }: GroupCardStatusProps) {
  const getPerformanceScore = () => {
    if (!group.performance) return 75;

    const uptime = group.performance.aggregatedMetrics.averageUptime;
    if (typeof uptime === 'string') {
      const match = uptime.match(/(\d+\.\d+)/);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    }

    return 75;
  };

  const getHealthStatus = () => {
    if (group.status !== 'active') return { label: 'Inactive', color: 'bg-fw-wash text-fw-body' };

    const score = getPerformanceScore();
    if (score > 95) {
      return { label: 'Optimal', color: 'bg-green-50 text-fw-success' };
    } else if (score > 90) {
      return { label: 'Good', color: 'bg-fw-blue-light text-fw-link' };
    } else if (score > 80) {
      return { label: 'Warning', color: 'bg-orange-50 text-fw-warn' };
    } else {
      return { label: 'Critical', color: 'bg-red-50 text-fw-error' };
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center justify-between">
        <span
          className={`
            inline-flex items-center px-2 py-0.5 rounded-[8px] text-[12px] leading-4 font-medium
            ${group.status === 'active'
              ? 'text-fw-success'
              : 'text-fw-body'
            }
          `}
          style={{
            backgroundColor: group.status === 'active'
              ? 'rgba(45,126,36,0.12)'
              : 'rgba(104,110,116,0.12)',
          }}
        >
          {group.status === 'active' ? 'Active' : 'Inactive'}
        </span>

        <span
          className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[12px] leading-4 font-medium"
          style={{
            color: healthStatus.color.includes('success') ? '#2d7e24'
              : healthStatus.color.includes('blue') ? '#0057b8'
              : healthStatus.color.includes('orange') ? '#ea712f'
              : healthStatus.color.includes('red') ? '#c70032'
              : '#686e74',
            backgroundColor: healthStatus.color.includes('success') ? 'rgba(45,126,36,0.12)'
              : healthStatus.color.includes('blue') ? 'rgba(0,87,184,0.12)'
              : healthStatus.color.includes('orange') ? 'rgba(234,113,47,0.12)'
              : healthStatus.color.includes('red') ? 'rgba(199,0,50,0.12)'
              : 'rgba(104,110,116,0.12)',
          }}
        >
          {healthStatus.label}
        </span>
      </div>
    </div>
  );
}
