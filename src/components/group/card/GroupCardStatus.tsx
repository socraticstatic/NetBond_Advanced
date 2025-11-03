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
    if (group.status !== 'active') return { label: 'Inactive', color: 'bg-gray-100 text-gray-600' };

    const score = getPerformanceScore();
    if (score > 95) {
      return { label: 'Optimal', color: 'bg-complementary-green/10 text-complementary-green' };
    } else if (score > 90) {
      return { label: 'Good', color: 'bg-brand-lightBlue text-brand-blue' };
    } else if (score > 80) {
      return { label: 'Warning', color: 'bg-amber-50 text-amber-700' };
    } else {
      return { label: 'Critical', color: 'bg-red-50 text-red-700' };
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between mt-4">
        <button
          className={`
            inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
            transition-all duration-200 border
            ${group.status === 'active'
              ? 'bg-white text-complementary-green border-complementary-green/20'
              : 'bg-white text-gray-700 border-gray-200'
            }
          `}
        >
          {group.status === 'active' ? 'Active' : 'Inactive'}
        </button>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${healthStatus.color}`}>
          {healthStatus.label}
        </span>
      </div>
    </div>
  );
}
