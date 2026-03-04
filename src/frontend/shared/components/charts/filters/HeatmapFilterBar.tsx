// src/frontend/shared/components/charts/filters/HeatmapFilterBar.tsx
import React from "react";

interface HeatmapFilterBarProps {
  shotFilter: "all" | "made" | "missed";
  setShotFilter: (f: "all" | "made" | "missed") => void;
}

export const HeatmapFilterBar: React.FC<HeatmapFilterBarProps> = ({
  shotFilter,
  setShotFilter,
}) => (
  <div className="w-full flex flex-row items-center gap-2 justify-center mb-2">
    <span className="font-bold text-[15px] mr-2">Shots:</span>
    <button
      onClick={() => setShotFilter("all")}
      className={`px-3 py-1 rounded-md border text-[14px] transition ${
        shotFilter === "all"
          ? "font-bold border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
          : "border-gray-300 bg-white hover:border-blue-400"
      }`}
    >
      All
    </button>
    <button
      onClick={() => setShotFilter("made")}
      className={`px-3 py-1 rounded-md border text-[14px] transition ${
        shotFilter === "made"
          ? "font-bold border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
          : "border-gray-300 bg-white hover:border-blue-400"
      }`}
    >
      Made
    </button>
    <button
      onClick={() => setShotFilter("missed")}
      className={`px-3 py-1 rounded-md border text-[14px] transition ${
        shotFilter === "missed"
          ? "font-bold border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
          : "border-gray-300 bg-white hover:border-blue-400"
      }`}
    >
      Missed
    </button>
  </div>
);

export default HeatmapFilterBar;
