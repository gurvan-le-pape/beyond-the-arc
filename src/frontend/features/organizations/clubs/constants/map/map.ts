// src/frontend/features/organizations/clubs/constants/map/map.ts
export const MAP_CONFIG = {
  CENTER: [46.603354, 1.888334] as [number, number],
  ZOOM: 6,
  TILE_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ATTRIBUTION:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  MAX_ZOOM: 18,
};

export const COLORS = {
  REGION: {
    VERY_HIGH: "#166534",
    HIGH: "#22c55e",
    MEDIUM: "#86efac",
    LOW: "#dcfce7",
    BORDER: "#22c55e",
  },
  DEPARTMENT: {
    VERY_HIGH: "#1e40af",
    HIGH: "#3b82f6",
    MEDIUM: "#93c5fd",
    LOW: "#dbeafe",
    BORDER: "#1e40af",
  },
};

export const STYLE_CONFIG = {
  REGION: {
    weight: 3,
    opacity: 1,
    fillOpacity: 0.8,
    dashArray: "6",
    cursor: "pointer",
    zIndex: 100,
  },
  DEPARTMENT: {
    weight: 3,
    opacity: 1,
    fillOpacity: 0.8,
    zIndex: 500,
  },
  REGION_SELECTED: {
    fillColor: "#ffffff00",
    fillOpacity: 0.1,
    zIndex: 100,
  },
};
