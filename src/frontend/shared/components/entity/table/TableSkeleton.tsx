// src/frontend/shared/components/entity/table/TableSkeleton.tsx
import React from "react";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows = 10,
}) => (
  <tbody>
    {Array.from({ length: rows }).map((_, i) => {
      const rowKey = `skeleton-row-${i}-${rows}`;
      return (
        <tr key={rowKey} className="animate-pulse">
          {Array.from({ length: columns }).map((_, j) => {
            const cellKey = `skeleton-cell-${i}-${j}-${columns}`;
            return (
              <td key={cellKey} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              </td>
            );
          })}
        </tr>
      );
    })}
  </tbody>
);

export default TableSkeleton;
