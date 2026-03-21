import { Group } from '../../../types/group';
import { GroupCard } from '../GroupCard';

interface GroupCardViewProps {
  groups: Group[];
  onDelete: (id: string) => void;
  isMinimized?: boolean;
}

export function GroupCardView({ groups, onDelete, isMinimized = false }: GroupCardViewProps) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, 368px)' }}>
      {groups.map(group => (
        <GroupCard 
          key={group.id} 
          group={group} 
          onDelete={onDelete}
          isMinimized={isMinimized}
        />
      ))}
    </div>
  );
}