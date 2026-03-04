// src/frontend/shared/utils/charts/overlays/hotspots/binShotsByZones.ts
// Utility to bin shots into zones and compute stats for each zone
// Usage: const stats = binShotsByZones(shots, zones)
export interface Zone {
  key: string;
  contains: (x: number, y: number) => boolean;
}

export interface Shot {
  shotLocation?: { x: number; y: number };
  eventType?: string;
}

export interface ZoneStats {
  made: number;
  missed: number;
  total: number;
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
    if (!shot.shotLocation) continue;
    const { x, y } = shot.shotLocation;
    const zone = zones.find((z) => z.contains(x, y));
    if (!zone) continue;
    stats[zone.key].total++;
    if (shot.eventType && shot.eventType.startsWith("made"))
      stats[zone.key].made++;
    else stats[zone.key].missed++;
  }
  return stats;
}
