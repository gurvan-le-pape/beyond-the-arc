// src/frontend/shared/components/charts/headers/ScatterHeader.tsx
import React from "react";

export const ScatterHeader: React.FC = () => (
  <div className="flex items-center gap-8 mb-2 ml-2">
    <span className="flex items-center gap-1.5">
      <svg width={22} height={22} aria-hidden="true">
        <circle
          cx={11}
          cy={11}
          r={8}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-success"
        />
      </svg>
      <span className="text-sm text-gray-800 dark:text-gray-200">
        Panier marqué
      </span>
    </span>

    <span className="flex items-center gap-1.5">
      <svg width={22} height={22} aria-hidden="true">
        <line
          x1={4}
          y1={4}
          x2={18}
          y2={18}
          stroke="currentColor"
          strokeWidth={3}
          className="text-error"
        />
        <line
          x1={4}
          y1={18}
          x2={18}
          y2={4}
          stroke="currentColor"
          strokeWidth={3}
          className="text-error"
        />
      </svg>
      <span className="text-sm text-gray-800 dark:text-gray-200">
        Tir manqué
      </span>
    </span>
  </div>
);

export default ScatterHeader;
