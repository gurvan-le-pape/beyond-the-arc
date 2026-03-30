// src/frontend/features/organizations/clubs/components/navigation/ClubsGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/primitives";

import type { ClubBasic } from "../../types/ClubBasic";

interface ClubsGridProps {
  clubs: ClubBasic[];
  leagueId: number;
  committeeId: number;
}

/**
 * ClubsGrid
 *
 * Displays a grid of club cards.
 * Each card is clickable and navigates to the club detail page.
 */
export function ClubsGrid({ clubs, leagueId, committeeId }: ClubsGridProps) {
  const t = useTranslations("clubs");
  const router = useRouter();

  if (clubs.length === 0) {
    return (
      <div className="bg-surface-subtle dark:bg-surface-subtle-dark rounded-card shadow-card dark:shadow-card-dark border border-divide-light dark:border-divide-dark p-8">
        <p className="text-center text-body text-text-body dark:text-text-body-dark">
          {t("noTeams")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clubs.map((club) => (
        <Card
          key={club.id}
          variant="default"
          padding="md"
          clickable
          onClick={() =>
            router.push(
              `/clubs/league/${leagueId}/committee/${committeeId}/club/${club.id}`,
            )
          }
          className="border-l-4 border-l-clubs-dark dark:border-l-clubs-light hover:border-l-divide-light dark:hover:!border-l-divide-dark"
        >
          <h3 className="text-lg font-semibold text-text-heading dark:text-text-heading-dark mb-1">
            {club.name}
          </h3>
          {(club.city || club.zipCode) && (
            <p className="text-sm text-text-body dark:text-text-body-dark">
              {club.city && club.zipCode && `${club.city} • ${club.zipCode}`}
              {club.city && !club.zipCode && club.city}
              {!club.city && club.zipCode && club.zipCode}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}

export default ClubsGrid;
