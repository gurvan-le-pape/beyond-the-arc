// src/frontend/shared/components/table/TableSkeleton.tsx
import React from "react";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows = 10,
}) => (
  <tbody aria-busy="true" aria-label="Loading…">
    {Array.from({ length: rows }, (_, i) => (
      <tr key={i} className="animate-pulse">
        {Array.from({ length: columns }, (_, j) => (
          <td key={j} className="px-6 py-4">
            <div className="h-4 rounded bg-surface-subtle dark:bg-surface-subtle-dark w-3/4 mx-auto" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

export default TableSkeleton;
