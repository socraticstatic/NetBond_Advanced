import { Pause, Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConnectionCardStatusProps {
  status: string;
  bandwidthUtilization: number;
  isPending: boolean;
  progress: number;
  remainingTime: number;
  handleToggleStatus: (e: React.MouseEvent) => void;
  healthStatus: {
    label: string;
    color: string;
  };
  showEffects: boolean;
}

/**
 * Status component for the connection card
 * Displays the connection status, health, and toggle button
 */
export function ConnectionCardStatus({
  status,
  bandwidthUtilization,
  isPending,
  progress,
  remainingTime,
  handleToggleStatus,
  healthStatus,
  showEffects
}: ConnectionCardStatusProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between mt-4">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(e);
          }}
          disabled={isPending}
          className={`
            inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
            transition-all duration-200 border
            ${isPending 
              ? 'bg-brand-lightBlue text-brand-blue border-brand-blue/20 cursor-wait' 
              : status === 'Active'
                ? 'bg-white text-complementary-green border-complementary-green/20 hover:bg-complementary-green/10'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }
          `}
          // Add animation for the pending state
          animate={isPending ? {
            backgroundColor: ['rgba(230, 246, 253, 0.6)', 'rgba(230, 246, 253, 1)', 'rgba(230, 246, 253, 0.6)'],
            borderColor: ['rgba(0, 159, 219, 0.1)', 'rgba(0, 159, 219, 0.3)', 'rgba(0, 159, 219, 0.1)'],
            transition: { 
              repeat: Infinity, 
              duration: 1.8,
              ease: "easeInOut" 
            }
          } : {}}
        >
          {isPending ? (
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span className="font-mono font-semibold">{formatTime(remainingTime)}</span>
              <span className="ml-2 text-xs opacity-75">remaining</span>
            </span>
          ) : status === 'Active' ? (
            <>
              <Pause className="h-3.5 w-3.5 mr-1.5" />
              Active
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 mr-1.5" />
              Inactive
            </>
          )}
        </motion.button>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${healthStatus.color}`}>
          {healthStatus.label}
        </span>
      </div>
    </div>
  );
}