// src/frontend/shared/components/charts/headers/ScatterHeader.tsx
import React from "react";

export const ScatterHeader: React.FC = () => (
  <div
    style={{
      display: "flex",
      gap: 32,
      alignItems: "center",
      marginBottom: 8,
      marginLeft: 8,
    }}
  >
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg width={22} height={22} style={{ verticalAlign: "middle" }}>
        <circle
          cx={11}
          cy={11}
          r={8}
          fill="none"
          stroke="#43a047"
          strokeWidth={3}
        />
      </svg>
      <span style={{ fontSize: 15, color: "#222" }}>Panier marqué</span>
    </span>
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg width={22} height={22} style={{ verticalAlign: "middle" }}>
        <line x1={4} y1={4} x2={18} y2={18} stroke="#d32f2f" strokeWidth={3} />
        <line x1={4} y1={18} x2={18} y2={4} stroke="#d32f2f" strokeWidth={3} />
      </svg>
      <span style={{ fontSize: 15, color: "#222" }}>Tir manqué</span>
    </span>
  </div>
);

export default ScatterHeader;
