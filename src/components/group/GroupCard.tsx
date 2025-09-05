import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react';
import { Group } from '../../types/group';
import { motion } from 'framer-motion';
import { 
  GroupCardHeader, 
  GroupCardMetrics, 
  GroupCardFooter,
  GroupCardInfo 
} from './card';

interface GroupCardProps {
  group: Group;
  onDelete: (id: string) => void;
  isMinimized?: boolean;
}

export function GroupCard({ group, onDelete, isMinimized = false }: GroupCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isMinimized);
  
  // Update expanded state when isMinimized prop changes
  useEffect(() => {
    setIsExpanded(!isMinimized);
  }, [isMinimized]);

  const handleManageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/groups/${group.id}`);
  };

  return (
    <motion.div 
      className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden flex flex-col h-full relative"
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/groups/${group.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GroupCardHeader group={group}>
        <div className="flex">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(group.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/groups/${group.id}`);
            }}
            className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-brand-lightBlue rounded-full transition-colors ml-1"
          >
            <Edit2 className="h-4 w-4" />
          </motion.button>
        </div>
      </GroupCardHeader>

      {/* Expanded Content Section */}
      {isExpanded && (
        <>
          {/* Body Section */}
          <div className="p-5 space-y-5 flex-1">
            <GroupCardMetrics group={group} />
            <GroupCardInfo group={group} />
          </div>

          {/* Action Footer */}
          <GroupCardFooter onManageClick={handleManageClick} />
        </>
      )}
    </motion.div>
  );
}