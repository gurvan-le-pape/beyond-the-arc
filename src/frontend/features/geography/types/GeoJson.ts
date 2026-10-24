// src/frontend/features/geography/types/GeoJson.ts
export interface GeoJsonFeature {
  type: "Feature";
  properties: {
    code: string;
    nom: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface GeoJsonData {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}
