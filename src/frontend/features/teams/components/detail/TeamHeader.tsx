// src/frontend/features/teams/components/detail/TeamHeader.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useRouter } from "@/navigation";
import { Button, Card } from "@/shared/components/ui";
import { CompetitionLevel, NA } from "@/shared/constants";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";
import { normalizeString } from "@/shared/utils/normalizeString";

import type { Team } from "../../types/Team";

interface TeamHeaderProps {
  team: Team;
}

export function TeamHeader({ team }: TeamHeaderProps) {
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [logoSrc, setLogoSrc] = useState(
    `/images/clubs/${formatNameToFileName(team.club?.name || "")}.webp`,
  );

  // Compute competition URL logic outside of return
  let competitionUrl: string | null = null;
  let competitionName: string | null = null;

  const clubId = team?.club?.id;
  const committeeId = team?.club?.committee?.id;
  const leagueId = team?.club?.committee?.league?.id;

  if (team.pool?.championship) {
    const level = normalizeString(team.pool.championship.level);
    let parentId: number | null | undefined = null;
    if (level === CompetitionLevel.DEPARTMENTAL) {
      parentId = committeeId;
    } else if (level === CompetitionLevel.REGIONAL) {
      parentId = leagueId;
    }
    if (parentId) {
      competitionUrl = `/competitions/${level}/${parentId}/${team.pool.championship.id}`;
      competitionName = team.pool.championship.name;
    }
  }

  return (
    <Card variant="highlighted" padding="lg">
      <div className="flex items-center gap-6">
        {/* Club Logo */}
        <button
          type="button"
          className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-button overflow-hidden bg-gray-100 dark:bg-gray-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
          aria-label={
            team.club?.name
              ? tCommon("club.seeClub", { name: team.club.name })
              : tCommon("club.seeClubDefault")
          }
          onClick={() => {
            if (leagueId && committeeId && clubId) {
              void router.push(
                `/clubs/league/${leagueId}/committee/${committeeId}/club/${clubId}`,
              );
            }
          }}
        >
          <Image
            src={logoSrc}
            alt={team.club?.name || tCommon("club.seeClubDefault")}
            fill
            className="object-contain p-2"
            onError={() => setLogoSrc("/images/clubs/defaultLogo.30cc7520.svg")}
            priority
          />
        </button>

        {/* Team Info */}
        <div className="flex-1 space-y-2">
          <h1 className="text-title md:text-display font-bold text-gray-900 dark:text-gray-100">
            <button
              type="button"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:underline"
              aria-label={
                team.club?.name
                  ? tCommon("club.seeClub", { name: team.club.name })
                  : tCommon("club.seeClubDefault")
              }
              onClick={() => {
                if (leagueId && committeeId && clubId) {
                  void router.push(
                    `/clubs/league/${leagueId}/committee/${committeeId}/club/${clubId}`,
                  );
                }
              }}
            >
              {team.club?.name}
            </button>
            <span className="ml-1">{`- ${team.number}`}</span>
          </h1>

          <p className="text-body-lg text-gray-600 dark:text-gray-400">
            {team.category || NA} • {team.gender || NA}
          </p>

          {competitionUrl && competitionName && (
            <Button
              variant="ghost"
              size="sm"
              className="px-0"
              aria-label={tCommon("competition.seeCompetition", {
                name: competitionName,
              })}
              onClick={() => void router.push(competitionUrl)}
            >
              {competitionName}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default TeamHeader;
