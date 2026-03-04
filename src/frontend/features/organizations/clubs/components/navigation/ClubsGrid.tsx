// src/frontend/features/organizations/clubs/components/navigation/ClubsGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/ui";

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
      <div className="bg-white dark:bg-gray-800 rounded-card shadow-card dark:shadow-card-dark border border-gray-200 dark:border-gray-700 p-8">
        <p className="text-center text-body text-gray-600 dark:text-gray-400">
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
          className="border-l-4 border-l-clubs-dark dark:border-l-clubs-light hover:border-l-gray-300 dark:hover:!border-l-gray-600"
        >
          <h3 className="text-body-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {club.name}
          </h3>
          {(club.city || club.zipCode) && (
            <p className="text-body-sm text-gray-600 dark:text-gray-400">
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
