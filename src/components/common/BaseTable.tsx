import { ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column<T> {
  id: string;
  label: string;
  sortable?: boolean;
  sortKey?: keyof T;
  render: (item: T) => ReactNode;
  width?: string;
  exportValue?: (item: T) => string;
}

interface BaseTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  sortField?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: keyof T) => void;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
  actions?: (item: T) => ReactNode;
  emptyState?: ReactNode;
  title?: string;
}

export function BaseTable<T>({ 
  columns,
  data,
  keyField,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
  rowClassName,
  actions,
  emptyState,
  title
}: BaseTableProps<T>) {
  return (
    <>
      {/* Table Header */}
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-fw-heading">{title}</h3>
        </div>
      )}

      {/* Table */}
      <div className="bg-fw-base rounded-lg border border-fw-secondary overflow-hidden">
        <div className="min-w-full divide-y divide-fw-secondary">
        <div className="bg-fw-wash">
          <div className="min-w-full table">
            <div className="table-header-group">
              <div className="table-row">
                {columns.map((column) => (
                  <div
                    key={column.id}
                    scope="col"
                    className="table-cell px-6 py-3 text-left text-xs font-medium text-fw-bodyLight uppercase tracking-wider whitespace-nowrap"
                    style={column.width ? { width: column.width } : undefined}
                    role="columnheader"
                    aria-sort={
                      column.sortKey === sortField
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    {column.sortable && column.sortKey ? (
                      <button
                        onClick={() => onSort?.(column.sortKey as keyof T)}
                        className="group inline-flex items-center space-x-1"
                      >
                        <span>{column.label}</span>
                        <span className="flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${
                              column.sortKey === sortField && sortDirection === 'asc'
                                ? 'text-fw-body'
                                : 'text-fw-bodyLight group-hover:text-fw-body'
                            }`} 
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${
                              column.sortKey === sortField && sortDirection === 'desc'
                                ? 'text-fw-body'
                                : 'text-fw-bodyLight group-hover:text-fw-body'
                            }`} 
                          />
                        </span>
                      </button>
                    ) : (
                      column.label
                    )}
                  </div>
                ))}
                {actions && (
                  <div scope="col" className="table-cell relative px-6 py-3 w-px">
                    <span className="sr-only">Actions</span>
                  </div>
                )}
              </div>
            </div>
            <div className="table-row-group bg-fw-base divide-y divide-fw-secondary">
              {data.length === 0 ? (
                <div className="table-row">
                  <div 
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="table-cell px-6 py-4 text-center text-sm text-fw-bodyLight"
                  >
                    {emptyState || 'No data available'}
                  </div>
                </div>
              ) : (
                data.map((item, rowIndex) => (
                  <div
                    key={String(item[keyField])}
                    onClick={() => onRowClick?.(item)}
                    className={`
                      table-row transition-colors duration-150
                      ${onRowClick ? 'cursor-pointer' : ''}
                      ${rowClassName?.(item) || 'hover:bg-fw-wash'}
                    `}
                    role="row"
                    aria-rowindex={rowIndex + 1}
                  >
                    {columns.map((column) => (
                      <div 
                        key={column.id} 
                        className="table-cell px-6 py-4 whitespace-nowrap"
                        role="gridcell"
                      >
                        {column.render(item)}
                      </div>
                    ))}
                    {actions && (
                      <div 
                        className="table-cell px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={e => e.stopPropagation()}
                        role="gridcell"
                      >
                        {actions(item)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}