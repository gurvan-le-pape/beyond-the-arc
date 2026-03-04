// src/frontend/features/players/components/detail/PlayerHeader.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useRouter } from "@/navigation";
import { Button } from "@/shared/components/ui";
import { Card } from "@/shared/components/ui";
import { CompetitionLevel, NA } from "@/shared/constants";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";
import { normalizeString } from "@/shared/utils/normalizeString";

import type { Player } from "../../types/Player";

interface PlayerHeaderProps {
  player: Player;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({ player }) => {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [logoSrc, setLogoSrc] = useState(
    `/images/clubs/${formatNameToFileName(player.team?.club?.name || "")}.webp`,
  );

  const team = player.team;
  const clubId = team?.club?.id;
  const committeeId = team?.club?.committee?.id;
  const leagueId = team?.club?.committee?.league?.id;

  // Compute competition URL logic outside of return
  let competitionUrl: string | null = null;
  let competitionName: string | null = null;
  if (player.team?.pool?.championship) {
    const level = normalizeString(player.team.pool.championship.level);
    let parentId: number | null | undefined = null;
    if (level === CompetitionLevel.DEPARTMENTAL) {
      parentId = committeeId;
    } else if (level === CompetitionLevel.REGIONAL) {
      parentId = leagueId;
    }
    if (parentId) {
      competitionUrl = `/competitions/${level}/${parentId}/${player.team.pool.championship.id}`;
      competitionName = player.team.pool.championship.name;
    }
  }

  return (
    <Card variant="highlighted" padding="lg" className="mb-8">
      <div className="flex items-center gap-6">
        {/* Club Logo */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-full p-0 border-0 bg-transparent focus:outline-none"
            aria-label={
              player.team?.club?.name
                ? tCommon("club.seeClub", { name: player.team.club.name })
                : tCommon("club.seeClubDefault")
            }
            onClick={() =>
              player.team?.club &&
              void router.push(
                `/clubs/league/${leagueId}/committee/${committeeId}/club/${clubId}`,
              )
            }
          >
            <Image
              src={logoSrc}
              alt={player.team?.club?.name || tPlayers("playerDetail.club")}
              fill
              className="object-contain"
              onError={() =>
                setLogoSrc("/images/clubs/defaultLogo.30cc7520.svg")
              }
              priority
            />
          </Button>
        </div>

        {/* Player Info */}
        <div className="flex-1">
          <h1 className="text-title font-bold text-gray-900 dark:text-gray-100 mb-2">
            #{player.number} {player.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
            {player.team?.category || NA} • {player.team?.gender || NA}
          </p>
          <div className="mt-2">
            <Button
              variant="ghost"
              className="p-0 m-0 border-0 bg-transparent text-xl font-bold text-gray-900 dark:text-gray-100 align-baseline focus:outline-none hover:underline"
              aria-label={
                player.team?.club?.name
                  ? tCommon("club.seeClub", { name: player.team.club.name })
                  : tCommon("club.seeClubDefault")
              }
              onClick={() => {
                if (leagueId && committeeId && clubId) {
                  void router.push(
                    `/clubs/league/${leagueId}/committee/${committeeId}/club/${clubId}`,
                  );
                }
              }}
              type="button"
              style={{
                fontSize: "inherit",
                fontWeight: "inherit",
                color: "inherit",
                lineHeight: "inherit",
              }}
            >
              {player.team?.club?.name || NA} - {player.team?.number || ""}
            </Button>
            {competitionUrl && competitionName && (
              <div className="mt-1">
                <Button
                  variant="ghost"
                  className="text-md cursor-pointer hover:underline bg-transparent border-0 p-0 m-0 text-inherit font-inherit"
                  aria-label={tCommon("competition.seeCompetition", {
                    name: competitionName,
                  })}
                  onClick={() => void router.push(competitionUrl)}
                >
                  {competitionName}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PlayerHeader;
