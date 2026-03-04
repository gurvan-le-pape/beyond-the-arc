// src/frontend/features/organizations/clubs/types/Map.ts
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
