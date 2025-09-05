import { Connection, Group } from '../../../types';
import { ConnectionCardContainer } from '../ConnectionCardContainer';

interface GridViewProps {
  connections: Connection[];
  groups: Group[];
  onSelect: (id: string) => void;
  isMinimized?: boolean;
}

export function GridView({ connections, groups, onSelect, isMinimized = false }: GridViewProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {connections.map((connection) => (
          <ConnectionCardContainer
            key={connection.id} 
            connection={connection}
            onClick={() => onSelect(connection.id.toString())}
            isMinimized={isMinimized}
          />
        ))}
      </div>
    </div>
  );
}