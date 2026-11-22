// src/frontend/features/organizations/clubs/components/map/clubs-map/useClubSelection.ts
import type { GeoJSONSource } from "maplibre-gl";
import { useCallback, useMemo, useState } from "react";
import type { MapLayerMouseEvent } from "react-map-gl/maplibre";

import { logger } from "@/shared/utils";

import type { ClubBasic } from "../../../types/ClubBasic";
import { pointKey } from "./mapHelpers";

/** Where the map moves to: a centre and a zoom level. */
interface MapTarget {
  readonly longitude: number;
  readonly latitude: number;
  readonly zoom: number;
}

/** A click on a cluster bubble: its source, its id and size, and its centre. */
interface ClusterClick {
  readonly source: GeoJSONSource;
  readonly clusterId: number;
  readonly pointCount: number;
  readonly longitude: number;
  readonly latitude: number;
}

interface ClubSelectionInput {
  /** Every club, for resolving a clicked point or cluster to its clubs. */
  readonly clubs: ClubBasic[];
  /** The clubs the search leaves on the map, for grouping a clicked point. */
  readonly displayClubs: ClubBasic[];
  /** Moves the map; the selection only ever centres it and sets the zoom. */
  readonly moveTo: (target: MapTarget) => void;
}

/**
 * Which clubs the popup shows, and the clicks that choose them.
 *
 * Many clubs were geocoded to their town's centre and share one point no zoom
 * level separates, so a selection is a list: one club, or every club on the
 * map at that point. A click on a club opens its point's clubs; a click on a
 * cluster whose clubs all share a point opens them, and any other cluster
 * zooms in until it splits. A club chosen from the side panel opens alone,
 * with the map centred on it at street level.
 *
 * @param root0 - every club, the clubs the search leaves on the map, and how
 *   to move the map
 * @returns the selected clubs, a way to clear them, the side panel's handler
 *   and the map's click handler
 */
export function useClubSelection({
  clubs,
  displayClubs,
  moveTo,
}: ClubSelectionInput) {
  const [selectedClubs, setSelectedClubs] = useState<ClubBasic[]>([]);

  const clearSelection = useCallback(() => setSelectedClubs([]), []);

  const selectFromList = useCallback(
    (club: ClubBasic) => {
      if (club.latitude && club.longitude) {
        moveTo({
          longitude: club.longitude,
          latitude: club.latitude,
          zoom: 12,
        });
        setSelectedClubs([club]);
      }
    },
    [moveTo],
  );

  // Clubs on the map grouped by exact coordinates.
  const clubsByPoint = useMemo(() => {
    const groups = new Map<string, ClubBasic[]>();
    for (const club of displayClubs) {
      if (club.latitude === null || club.longitude === null) continue;
      const key = pointKey(club);
      groups.set(key, [...(groups.get(key) ?? []), club]);
    }
    return groups;
  }, [displayClubs]);

  // MapLibre 5 answers both cluster queries with a Promise and takes no
  // callback.
  const openOrExpandCluster = useCallback(
    async ({
      source,
      clusterId,
      pointCount,
      longitude,
      latitude,
    }: ClusterClick) => {
      const leaves = await source.getClusterLeaves(clusterId, pointCount, 0);
      const leafIds = new Set(leaves.map((leaf) => leaf.properties?.id));
      const leafClubs = clubs.filter((c) => leafIds.has(c.id));
      const keys = new Set(leafClubs.map(pointKey));
      if (keys.size === 1) {
        setSelectedClubs(leafClubs);
        return;
      }
      const zoom = await source.getClusterExpansionZoom(clusterId);
      moveTo({ longitude, latitude, zoom: zoom + 0.5 });
    },
    [clubs, moveTo],
  );

  const onMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (f?.source !== "clubs" || f.geometry.type !== "Point") return;
      const [longitude, latitude] = f.geometry.coordinates;

      if (f.properties.cluster) {
        const source = e.target.getSource<GeoJSONSource>("clubs");
        if (!source) return;
        openOrExpandCluster({
          source,
          clusterId: f.properties.cluster_id,
          pointCount: f.properties.point_count,
          longitude,
          latitude,
        }).catch((error: unknown) => logger.error(error, "cluster click"));
      } else {
        // Feature coordinates come back tile-quantised, so the group is
        // looked up from the club's own coordinates rather than the click's.
        const club = clubs.find((c) => c.id === f.properties.id);
        if (club) setSelectedClubs(clubsByPoint.get(pointKey(club)) ?? [club]);
      }
    },
    [clubs, clubsByPoint, openOrExpandCluster],
  );

  return { selectedClubs, clearSelection, selectFromList, onMapClick };
}
