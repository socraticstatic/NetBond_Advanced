import { useCallback, useMemo } from 'react';
import { useStore } from '../store/useStore';

/**
 * Hook for managing column visibility for a specific table
 */
export function useColumnVisibility(tableId: string) {
  const {
    getVisibleColumns,
    setVisibleColumns,
    toggleColumn,
    showAllColumns,
    hideAllColumns,
    resetToDefaults,
    isColumnVisible
  } = useStore();

  // Get visible columns for this table
  const visibleColumns = useMemo(
    () => getVisibleColumns(tableId),
    [getVisibleColumns, tableId]
  );

  // Toggle a column
  const toggle = useCallback(
    (columnId: string) => {
      toggleColumn(tableId, columnId);
    },
    [toggleColumn, tableId]
  );

  // Show all columns
  const showAll = useCallback(
    (allColumnIds: string[]) => {
      showAllColumns(tableId, allColumnIds);
    },
    [showAllColumns, tableId]
  );

  // Hide all columns (keep minimum)
  const hideAll = useCallback(
    (allColumnIds: string[]) => {
      hideAllColumns(tableId, allColumnIds);
    },
    [hideAllColumns, tableId]
  );

  // Reset to defaults
  const reset = useCallback(() => {
    resetToDefaults(tableId);
  }, [resetToDefaults, tableId]);

  // Check if column is visible
  const isVisible = useCallback(
    (columnId: string) => {
      return isColumnVisible(tableId, columnId);
    },
    [isColumnVisible, tableId]
  );

  // Set visible columns directly
  const setVisible = useCallback(
    (columns: string[]) => {
      setVisibleColumns(tableId, columns);
    },
    [setVisibleColumns, tableId]
  );

  return {
    visibleColumns,
    toggle,
    showAll,
    hideAll,
    reset,
    isVisible,
    setVisible
  };
}
