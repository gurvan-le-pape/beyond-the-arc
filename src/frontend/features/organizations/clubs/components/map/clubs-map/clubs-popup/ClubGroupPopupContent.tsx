// src/frontend/features/organizations/clubs/components/map/clubs-map/clubs-popup/ClubGroupPopupContent.tsx
import { useTranslations } from "next-intl";

import { List, ListItem } from "@/shared/components/primitives";

import type { ClubBasic } from "../../../../types/ClubBasic";
import { MapPopupCard } from "./MapPopupCard";

interface ClubGroupPopupContentProps {
  /** Two or more clubs placed on exactly the same coordinates. */
  readonly clubs: readonly ClubBasic[];
  /** The department of the first club; null when the map has no committee for it. */
  readonly departmentName: string | null;
  readonly onClose: () => void;
}

/**
 * The popup for a map point several clubs share, listing each with a link to
 * its page.
 *
 * Many clubs were geocoded to their town's centre, so they sit on one point
 * that no zoom level separates; without this list only the topmost marker
 * could ever be clicked. The list scrolls, and its height cuts a row in half
 * so the scroll is visible.
 */
export function ClubGroupPopupContent({
  clubs,
  departmentName,
  onClose,
}: ClubGroupPopupContentProps) {
  const t = useTranslations("clubs");

  return (
    <MapPopupCard
      title={t("map.clubsHere", { count: clubs.length })}
      details={departmentName}
      onClose={onClose}
    >
      <div className="max-h-[198px] overflow-y-auto">
        <List>
          {clubs.map((club) => (
            <ListItem
              key={club.id}
              size="sm"
              href={`/organizations/clubs/${club.id}`}
              title={club.name}
              trailing={club.zipCode}
            />
          ))}
        </List>
      </div>
    </MapPopupCard>
  );
}
