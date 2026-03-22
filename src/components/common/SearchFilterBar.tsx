import { ReactNode } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from './Button';

interface SearchFilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilter?: () => void;
  onExport?: () => void;
  filterContent?: ReactNode;
  actions?: ReactNode;
  showFilter?: boolean;
  showExport?: boolean;
}

export function SearchFilterBar({
  searchPlaceholder = 'Search ...',
  searchValue,
  onSearchChange,
  onFilter,
  onExport,
  filterContent,
  actions,
  showFilter = true,
  showExport = true,
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fw-bodyLight h-5 w-5" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="fw-input pl-10"
        />
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-fw-secondary" />

      {/* Filter */}
      {showFilter && (onFilter || filterContent) && (
        filterContent || (
          <Button variant="ghost" icon={Filter} onClick={onFilter} size="md">
            Filter
          </Button>
        )
      )}

      {/* Export */}
      {showExport && onExport && (
        <Button variant="ghost" icon={Download} onClick={onExport} size="md">
          Export
        </Button>
      )}

      {/* Custom actions */}
      {actions}
    </div>
  );
}
