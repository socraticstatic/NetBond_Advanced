import { useMemo } from 'react';
import { ConnectionCard } from './ConnectionCard';
import { Connection } from '../../types';
import { useStore } from '../../store/useStore';
import { getGroupsForConnection } from '../../utils/groups';

interface ConnectionCardContainerProps {
  connection: Connection;
  isMinimized?: boolean;
  onClick?: () => void;
}

/**
 * Container component that handles data fetching and preparation for the ConnectionCard
 */
export function ConnectionCardContainer({
  connection,
  isMinimized = false,
  onClick
}: ConnectionCardContainerProps) {
  // Get groups from store
  const groups = useStore(state => state.groups);

  // Get groups for this connection
  const connectionGroups = useMemo(() => {
    return getGroupsForConnection(groups, connection.id);
  }, [groups, connection.id]);

  return (
    <ConnectionCard
      connection={connection}
      groups={connectionGroups}
      isMinimized={isMinimized}
      onClick={onClick}
    />
  );
}