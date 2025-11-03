import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Group } from '../../types/group';
import { motion } from 'framer-motion';
import {
  GroupCardHeader,
  GroupCardMetrics,
  GroupCardFooter,
  GroupCardInfo
} from './card';
import { GroupOverflowMenu } from './GroupOverflowMenu';

interface GroupCardProps {
  group: Group;
  onDelete: (id: string) => void;
  isMinimized?: boolean;
}

export function GroupCard({ group, onDelete, isMinimized = false }: GroupCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isMinimized);

  useEffect(() => {
    setIsExpanded(!isMinimized);
  }, [isMinimized]);

  const handleManageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/groups/${group.id}`);
  };

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md flex flex-col h-full cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/groups/${group.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GroupCardHeader group={group}>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <GroupOverflowMenu group={group} onDelete={onDelete} />
        </div>
      </GroupCardHeader>

      {isExpanded && (
        <>
          <div className="p-5 space-y-5 flex-1">
            <GroupCardMetrics group={group} />
            <GroupCardInfo group={group} />
          </div>

          <GroupCardFooter onManageClick={handleManageClick} />
        </>
      )}
    </motion.div>
  );
}
