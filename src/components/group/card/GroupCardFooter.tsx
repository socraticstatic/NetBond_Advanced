import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface GroupCardFooterProps {
  onManageClick: (e: React.MouseEvent) => void;
}

export function GroupCardFooter({ onManageClick }: GroupCardFooterProps) {
  return (
    <div className="p-4 border-t border-gray-100 mt-auto">
      <motion.button
        className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg 
          border border-gray-200 shadow-sm flex items-center justify-center transition-colors duration-200
          hover:border-gray-300"
        whileHover={{ 
          backgroundColor: 'rgba(0, 49, 132, 0.05)', 
          borderColor: 'rgba(0, 49, 132, 0.3)', 
          color: 'rgb(0, 49, 132)'
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onManageClick}
      >
        <span>Manage Pool</span>
        <ChevronRight className="ml-2 h-4 w-4" />
      </motion.button>
    </div>
  );
}