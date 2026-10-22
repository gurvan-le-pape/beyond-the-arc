// src/frontend/features/organizations/clubs/components/clubs-map/ClubGroupPopupContent.tsx
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";

import type { ClubBasic } from "../../types/ClubBasic";
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
      <ul className="max-h-[198px] overflow-y-auto divide-y divide-divide">
        {clubs.map((club) => (
          <li key={club.id}>
            <Link
              href={`/organizations/clubs/${club.id}`}
              className="flex min-h-11 items-center justify-between gap-3 px-4 py-2 text-sm text-text-emphasis hover:bg-surface-inset hover:text-text-heading focus-ring"
            >
              <span className="min-w-0">{club.name}</span>
              {club.zipCode && (
                <span className="shrink-0 text-xs text-text-secondary">
                  {club.zipCode}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </MapPopupCard>
  );
}
