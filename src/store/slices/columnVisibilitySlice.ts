import { StateCreator } from 'zustand';
import { safeGetItem, safeSetItem } from '../../utils/localStorageUtils';

/**
 * Column configuration per table
 * Key: tableId, Value: array of visible column IDs
 */
export type ColumnConfig = Record<string, string[]>;

export interface ColumnVisibilitySlice {
  columnConfig: ColumnConfig;
  getVisibleColumns: (tableId: string) => string[];
  setVisibleColumns: (tableId: string, columns: string[]) => void;
  toggleColumn: (tableId: string, columnId: string, allColumnIds?: string[]) => void;
  showAllColumns: (tableId: string, allColumnIds: string[]) => void;
  hideAllColumns: (tableId: string, allColumnIds: string[]) => void;
  resetToDefaults: (tableId: string) => void;
  isColumnVisible: (tableId: string, columnId: string) => boolean;
}

/**
 * Default column sets for each table
 */
const DEFAULT_COLUMNS: ColumnConfig = {
  'connections-list': ['name', 'groups', 'type', 'status', 'performance', 'bandwidth', 'location', 'provider'],
  'groups-list': ['name', 'description', 'type', 'connections', 'members', 'status'],
  users: ['user', 'role', 'permissions', 'scope', 'department', 'status'],
  vnf: ['name', 'type', 'vendor', 'model', 'version', 'throughput', 'status', 'cloudRouter'],
  cloudrouter: ['name', 'status', 'resources'],
  links: ['vlanId', 'name', 'status', 'cloudRouter'],
  vlans: ['vlanId', 'name', 'cloudRouter', 'bandwidth', 'status'],
  'configure-connections': ['select', 'name', 'type', 'status', 'bandwidth', 'location'],
  'connection-logs': ['logId', 'timestamp', 'type', 'category', 'message', 'source'],
  'cms-banners': ['title', 'status', 'position', 'startDate', 'endDate'],
  'group-connections': ['name', 'status', 'bandwidth', 'location'],
  'group-members': ['user', 'role', 'status'],
  tickets: ['ticketNumber', 'description', 'troubleType', 'status', 'connection', 'asset'],
  'monitor-logs': ['time', 'type', 'severity', 'message', 'source', 'user'],
};

const STORAGE_KEY_PREFIX = 'columns_';
const MIN_VISIBLE_COLUMNS = 2;

/**
 * Load column config from localStorage
 */
function loadColumnConfig(tableId: string): string[] | null {
  try {
    const stored = safeGetItem<string[]>(`${STORAGE_KEY_PREFIX}${tableId}`);
    return stored;
  } catch (error) {
    console.error(`[ColumnVisibility] Error loading config for ${tableId}:`, error);
    return null;
  }
}

/**
 * Save column config to localStorage immediately
 */
function saveColumnConfig(tableId: string, columns: string[]): void {
  // Save immediately so storage events fire right away for cross-window sync
  safeSetItem(`${STORAGE_KEY_PREFIX}${tableId}`, columns);
}

/**
 * Get default columns for a table
 */
function getDefaultColumns(tableId: string): string[] {
  return DEFAULT_COLUMNS[tableId] || [];
}

/**
 * Create column visibility slice
 */
export const createColumnVisibilitySlice: StateCreator<ColumnVisibilitySlice> = (set, get) => {
  // Listen for storage changes from other windows
  if (typeof window !== 'undefined') {
    const handleStorageChange = (event: StorageEvent) => {

      if (event.key && event.key.startsWith(STORAGE_KEY_PREFIX)) {
        const tableId = event.key.substring(STORAGE_KEY_PREFIX.length);

        if (event.newValue) {
          try {
            const columns = JSON.parse(event.newValue);
            // Update the store with new column config
            set((state) => {
              const newState = {
                columnConfig: {
                  ...state.columnConfig,
                  [tableId]: columns
                }
              };
              return newState;
            });
          } catch (error) {
            console.error('[ColumnVisibility] Failed to parse storage event:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
  }

  return {
    columnConfig: {},

    getVisibleColumns: (tableId: string) => {
      const { columnConfig } = get();

      // Check if we have config for this table
      if (columnConfig[tableId]) {
        return columnConfig[tableId];
      }

      // Try loading from localStorage
      const stored = loadColumnConfig(tableId);
      if (stored && stored.length > 0) {
        // Update state with loaded config
        set((state) => ({
          columnConfig: {
            ...state.columnConfig,
            [tableId]: stored
          }
        }));
        return stored;
      }

      // Return defaults
      const defaults = getDefaultColumns(tableId);
      if (defaults.length > 0) {
        set((state) => ({
          columnConfig: {
            ...state.columnConfig,
            [tableId]: defaults
          }
        }));
        return defaults;
      }

      // No config at all, return empty array
      return [];
    },

    setVisibleColumns: (tableId: string, columns: string[]) => {
      // Validate minimum columns
      if (columns.length < MIN_VISIBLE_COLUMNS) {
        console.warn(`[ColumnVisibility] Must have at least ${MIN_VISIBLE_COLUMNS} columns visible`);

        if (window.addToast) {
          window.addToast({
            type: 'warning',
            title: 'Minimum Columns',
            message: `You must keep at least ${MIN_VISIBLE_COLUMNS} columns visible`,
            duration: 3000
          });
        }
        return;
      }

      // Update state
      set((state) => ({
        columnConfig: {
          ...state.columnConfig,
          [tableId]: columns
        }
      }));

      // Save to localStorage (will trigger storage event in other windows)
      saveColumnConfig(tableId, columns);


    },

    toggleColumn: (tableId: string, columnId: string, allColumnIds?: string[]) => {
      const { getVisibleColumns, setVisibleColumns } = get();
      let current = getVisibleColumns(tableId);

      // If no config yet (empty = all visible), initialize with all columns
      if (current.length === 0 && allColumnIds) {
        current = [...allColumnIds];
      }

      if (current.includes(columnId)) {
        // Removing column
        const newColumns = current.filter(id => id !== columnId);

        // Check minimum
        if (newColumns.length < MIN_VISIBLE_COLUMNS) {
          if (window.addToast) {
            window.addToast({
              type: 'warning',
              title: 'Minimum Columns',
              message: `You must keep at least ${MIN_VISIBLE_COLUMNS} columns visible`,
              duration: 3000
            });
          }
          return;
        }

        setVisibleColumns(tableId, newColumns);
      } else {
        // Adding column
        const newColumns = [...current, columnId];
        setVisibleColumns(tableId, newColumns);
      }
    },

    showAllColumns: (tableId: string, allColumnIds: string[]) => {
      const { setVisibleColumns } = get();
      setVisibleColumns(tableId, allColumnIds);

      if (window.addToast) {
        window.addToast({
          type: 'success',
          title: 'All Columns Shown',
          message: `Showing all ${allColumnIds.length} columns`,
          duration: 2000
        });
      }
    },

    hideAllColumns: (tableId: string, allColumnIds: string[]) => {
      const { setVisibleColumns } = get();

      // Keep only first MIN_VISIBLE_COLUMNS
      const minimumColumns = allColumnIds.slice(0, MIN_VISIBLE_COLUMNS);
      setVisibleColumns(tableId, minimumColumns);

      if (window.addToast) {
        window.addToast({
          type: 'info',
          title: 'Columns Hidden',
          message: `Showing minimum ${MIN_VISIBLE_COLUMNS} columns`,
          duration: 2000
        });
      }
    },

    resetToDefaults: (tableId: string) => {
      const defaults = getDefaultColumns(tableId);

      if (defaults.length === 0) {
        console.warn(`[ColumnVisibility] No defaults defined for ${tableId}`);
        return;
      }

      const { setVisibleColumns } = get();
      setVisibleColumns(tableId, defaults);

      if (window.addToast) {
        window.addToast({
          type: 'success',
          title: 'Reset to Defaults',
          message: 'Column configuration has been reset',
          duration: 2000
        });
      }


    },

    isColumnVisible: (tableId: string, columnId: string) => {
      const { getVisibleColumns } = get();
      const visible = getVisibleColumns(tableId);
      // Empty array means no config - all columns visible
      if (visible.length === 0) return true;
      return visible.includes(columnId);
    }
  };
};

/**
 * Export default column configurations for reference
 */
export { DEFAULT_COLUMNS };
