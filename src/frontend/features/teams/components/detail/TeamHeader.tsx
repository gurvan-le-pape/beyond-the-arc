// src/frontend/features/teams/components/detail/TeamHeader.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useRouter } from "@/navigation";
import { Button, Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { CompetitionLevel } from "@/shared/constants";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";
import { normalizeString } from "@/shared/utils/normalizeString";

import type { Team } from "../../types/Team";

interface TeamHeaderProps {
  readonly team: Team;
}

export function TeamHeader({ team }: TeamHeaderProps) {
  const tCommon = useTranslations("common");
  const router = useRouter();

  const club = team.club;
  const clubId = club.id;
  const clubName = club.name;
  const committeeId = club.committee.id;
  const leagueId = club.committee.league.id;
  const teamNumber = team.number;
  const category = team.category;
  const gender = team.gender;
  const championship = team.pool?.championship;

  const [logoSrc, setLogoSrc] = useState(
    `/images/clubs/${formatNameToFileName(clubName)}.webp`,
  );

  let competitionUrl: string | null = null;
  let competitionName: string | null = null;

  if (championship) {
    const level = normalizeString(championship.level);
    let parentId: number | null | undefined = null;
    if (level === CompetitionLevel.DEPARTMENTAL) {
      parentId = committeeId;
    } else if (level === CompetitionLevel.REGIONAL) {
      parentId = leagueId;
    }
    if (parentId) {
      competitionUrl = `/competitions/${level}/${parentId}/${championship.id}`;
      competitionName = championship.name;
    }
  }

  const clubUrl = `/clubs/league/${leagueId}/committee/${committeeId}/club/${clubId}`;

  return (
    <Card variant="highlighted" padding="lg">
      <div className="flex items-center gap-6">
        {/* Club Logo */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-full p-0 border-0 bg-transparent focus:outline-none"
            aria-label={tCommon("club.seeClub", { name: clubName })}
            onClick={() => router.push(clubUrl)}
          >
            <Image
              src={logoSrc}
              alt={clubName}
              fill
              className="object-contain"
              onError={() =>
                setLogoSrc("/images/clubs/defaultLogo.30cc7520.svg")
              }
              priority
            />
          </Button>
        </div>

        {/* Team Info */}
        <div className="flex-1">
          {/* Name & Number */}
          <Text variant="h1" className="mb-2">
            {clubName} - {teamNumber}
          </Text>
          {/* Category & Gender */}
          <Text variant="bodyLg">
            {category} • {gender}
          </Text>
          {/* Competition */}
          {competitionUrl && competitionName && (
            <Button
              variant="ghost"
              className="text-md cursor-pointer hover:underline bg-transparent border-0 p-0 m-0 text-inherit font-inherit"
              aria-label={tCommon("competition.seeCompetition", {
                name: competitionName,
              })}
              onClick={() => router.push(competitionUrl)}
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
