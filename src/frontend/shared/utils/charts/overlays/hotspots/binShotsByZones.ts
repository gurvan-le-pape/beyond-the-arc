// src/frontend/shared/utils/charts/overlays/hotspots/binShotsByZones.ts
// Utility to bin shots into zones and compute stats for each zone

import type { ZoneStats } from "@/shared/types/charts/ZoneStats";

// Usage: const stats = binShotsByZones(shots, zones)
export interface Zone {
  key: string;
  contains: (x: number, y: number) => boolean;
}

export interface Shot {
  x: number;
  y: number;
  made: boolean;
}

export function binShotsByZones(
  shots: Shot[],
  zones: Zone[],
): Record<string, ZoneStats> {
  const stats: Record<string, ZoneStats> = {};
  for (const zone of zones) {
    stats[zone.key] = { made: 0, missed: 0, total: 0 };
  }
  for (const shot of shots) {
    const zone = zones.find((z) => z.contains(shot.x, shot.y));
    if (!zone) continue;
    stats[zone.key].total++;
    if (shot.made) stats[zone.key].made++;
    else stats[zone.key].missed++;
  }
  return stats;
}
