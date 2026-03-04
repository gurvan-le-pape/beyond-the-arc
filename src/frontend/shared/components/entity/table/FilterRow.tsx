// src/frontend/shared/components/entity/table/FilterRow.tsx
import React from "react";
import type { FilterKey } from "types";

import type { FilterRenderer } from "@/shared/utils/tableFilters";

interface FilterRowProps<RowType> {
  headerGroup: any;
  filterableDropdownKeys: FilterKey[];
  filterRenderers: Record<FilterKey, FilterRenderer<RowType>>;
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
    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {headerGroup.headers.map((header: any) => {
        const columnId = header.column.id as FilterKey;
        const isFilterable = filterableDropdownKeys.includes(columnId);
        const FilterComponent = isFilterable ? filterRenderers[columnId] : null;

        return (
          <th key={header.id} className="px-4 py-3" scope="col">
            {FilterComponent ? (
              <div className="w-full">{FilterComponent(header.column)}</div>
            ) : (
              <div className="h-10" />
            )}
          </th>
        );
      })}
    </tr>
  );
}

export default FilterRow;
