// src/frontend/shared/components/table/FilterRow.tsx
import React from "react";

import type { FilterKey } from "@/shared/types";
import type { FilterRenderer } from "@/shared/utils/tableFilters";

interface FilterRowProps<RowType> {
  readonly headerGroup: any;
  readonly filterableDropdownKeys: FilterKey[];
  readonly filterRenderers: Record<FilterKey, FilterRenderer<RowType>>;
}

/**
 * Filter row component for table column filters
 * Renders below the header row with filter inputs for each column
 */
export function FilterRow<RowType>({
  headerGroup,
  filterableDropdownKeys,
  filterRenderers,
}: FilterRowProps<RowType>) {
  return (
    <tr className="bg-surface-subtle dark:bg-surface-subtle-dark border-b border-divide-light dark:border-divide-dark">
      {headerGroup.headers.map((header: any) => {
        const columnId = header.column.id as FilterKey;
        const FilterComponent = filterableDropdownKeys.includes(columnId)
          ? filterRenderers[columnId]
          : null;

        return (
          <th key={header.id} scope="col" className="px-4 py-3">
            {FilterComponent ? (
              <div className="w-full">{FilterComponent(header.column)}</div>
            ) : (
              <div className="h-10" aria-hidden="true" />
            )}
          </th>
        );
      })}
    </tr>
  );
}

export default FilterRow;
