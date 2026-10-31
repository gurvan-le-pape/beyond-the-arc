// src/frontend/features/shot-chart/utils/overlays/hotspots/hotspotsMaxTotal.ts
import { binShotsByZones, type Shot, type Zone } from "./binShotsByZones";
import { getAboveWingZones } from "./zones/shotZonesAboveWing";
import { getApexStripeZone } from "./zones/shotZonesApexStripe";
import { getArcZones } from "./zones/shotZonesArc";
import { getArcApexSidelineZones } from "./zones/shotZonesArcApexSideline";
import { getCorner3Zones } from "./zones/shotZonesCorner3";
import { getPaintZones } from "./zones/shotZonesPaint";
import { getTopKeyZone } from "./zones/shotZonesTopKey";
import { getWingZones } from "./zones/shotZonesWing";

// Every zone group the hotspots view draws — adding one there means adding it here.
const ALL_ZONE_GETTERS: (() => Zone[])[] = [
  getPaintZones,
  getArcZones,
  getArcApexSidelineZones,
  getAboveWingZones,
  getCorner3Zones,
  getWingZones,
  getApexStripeZone,
  getTopKeyZone,
];

/**
 * The shot count of the busiest hotspot zone: the top of the colour scale,
 * shared by the zones on the court and the legend above it.
 *
 * @param shots - the shots on the chart
 * @returns the highest per-zone total, never below 1 so an empty chart still has a usable domain
 */
export function hotspotsMaxTotal(shots: Shot[]): number {
  const zones = ALL_ZONE_GETTERS.flatMap((getter) => getter());
  const stats = binShotsByZones(shots, zones);
  return Math.max(1, ...Object.values(stats).map((s) => s.total));
}
