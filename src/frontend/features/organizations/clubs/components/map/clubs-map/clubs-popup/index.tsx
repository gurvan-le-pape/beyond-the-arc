// src/frontend/features/organizations/clubs/components/map/clubs-map/clubs-popup/index.tsx
import { Popup } from "react-map-gl/maplibre";

import type { Committee } from "@/features/organizations/committees/types";

import type { ClubBasic } from "../../../../types/ClubBasic";
import { CLUB_MARKER } from "../mapConstants";
import { ClubGroupPopupContent } from "./ClubGroupPopupContent";
import { ClubPopupContent } from "./ClubPopupContent";

interface ClubsPopupProps {
  /** The selected clubs: none, one, or several on exactly the same point. */
  readonly clubs: readonly ClubBasic[];
  /** The committees, whose departments name the popup's second line. */
  readonly departments: readonly Committee[];
  readonly onClose: () => void;
}

/**
 * The popup over the selected clubs' point: one club's card, or the list of
 * every club sharing that point. Nothing while no club is selected.
 *
 * The department is the first club's, through its committee; clubs on one
 * point are in one town, so it holds for all of them.
 */
export function ClubsPopup({ clubs, departments, onClose }: ClubsPopupProps) {
  if (clubs.length === 0) return null;
  const [first] = clubs;
  const departmentName =
    departments.find((d) => d.id === first.committeeId)?.department.name ??
    null;

  return (
    <Popup
      longitude={first.longitude!}
      latitude={first.latitude!}
      onClose={onClose}
      // The card brings its own close button and width; MapLibre's default
      // caps every popup at 240px.
      closeButton={false}
      maxWidth="320px"
      // Clear the marker underneath: a shared point is usually drawn as a
      // cluster bubble, a single club as a dot.
      offset={
        clubs.length > 1
          ? CLUB_MARKER.CLUSTER_SIZES[2] + 4
          : CLUB_MARKER.POINT_RADIUS + 4
      }
    >
      {clubs.length === 1 ? (
        <ClubPopupContent
          club={first}
          departmentName={departmentName}
          onClose={onClose}
        />
      ) : (
        <ClubGroupPopupContent
          clubs={clubs}
          departmentName={departmentName}
          onClose={onClose}
        />
      )}
    </Popup>
  );
}
