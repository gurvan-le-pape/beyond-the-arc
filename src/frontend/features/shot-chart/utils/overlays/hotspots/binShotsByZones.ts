// src/frontend/features/shot-chart/utils/overlays/hotspots/binShotsByZones.ts
// Utility to bin shots into zones and compute stats for each zone

import type { ZoneStats } from "@/features/shot-chart/types";

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

/**
 * Bins shots into zones, returning one stat line per zone.
 *
 * A shot lands in the **first** zone whose `contains` accepts it, so
 * overlapping zones are resolved by list order; shots matching no zone are
 * dropped. Every zone keeps an entry (zeroed) so the result's keys are stable.
 *
 * @param shots - every shot to attribute; each is tested against the zones in order
 * @param zones - the zone definitions, each carrying its own `contains` predicate
 * @returns made/missed/total per zone key — a zone with no shots is present with zeros, not absent
 */
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
