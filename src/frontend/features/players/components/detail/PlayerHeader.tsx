// src/frontend/features/players/components/detail/PlayerHeader.tsx
import { getTranslations } from "next-intl/server";

import { Link } from "@/navigation";
import { ClubLogoLink, EntityHeaderBadges } from "@/shared/components/domain";
import { Badge, Card } from "@/shared/components/primitives";
import { StatCell } from "@/shared/components/stats";
import { Text } from "@/shared/components/typography";
import { CompetitionLevel } from "@/shared/constants";
import { normalizeString, positionVariant } from "@/shared/utils";

import type { Player } from "../../types/Player";
import { PlayerAvatar } from "../PlayerAvatar";

interface PlayerHeaderProps {
  readonly player: Player;
}

export async function PlayerHeader({ player }: PlayerHeaderProps) {
  const tCommon = await getTranslations("common");
  const tPlayers = await getTranslations("players");
  const tCompetitions = await getTranslations("competitions");

  const playerName = player.name;
  const playerNumber = player.number;
  const position = player.position;
  const heightCm = player.heightCm;
  const weightKg = player.weightKg;
  const birthdate = player.birthdate;
  const team = player.team;
  const teamId = player.teamId;
  const club = team.club;
  const clubId = club.id;
  const clubName = club.name;
  const committeeId = club.committee.id;
  const leagueId = club.committee.league.id;
  const teamNumber = team.number;
  const category = team.category;
  const gender = team.gender;
  const championship = team.pool?.championship;

  let competitionUrl: string | null = null;

  if (championship) {
    const level = normalizeString(championship.level);
    let parentId: number | null | undefined = null;
    if (level === CompetitionLevel.DEPARTMENTAL) {
      parentId = committeeId;
    } else if (level === CompetitionLevel.REGIONAL) {
      parentId = leagueId;
    }
    if (parentId) {
      competitionUrl = `/championships/${championship.id}`;
    }
  }

  const isFemale = gender?.toLowerCase() === "female";

  const age = Math.floor(
    (Date.now() - new Date(birthdate).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25),
  );

  const statsBand = [
    ...(age
      ? [
          {
            value: tPlayers("playerDetail.age", { age }),
            label: tPlayers("playerDetail.ageLabel"),
          },
        ]
      : []),
    ...(heightCm
      ? [
          {
            value: tPlayers("playerDetail.height", { heightCm }),
            label: tPlayers("playerDetail.heightLabel"),
          },
        ]
      : []),
    ...(weightKg
      ? [
          {
            value: tPlayers("playerDetail.weight", { weightKg }),
            label: tPlayers("playerDetail.weightLabel"),
          },
        ]
      : []),
  ];

  return (
    <Card
      variant="custom"
      padding="none"
      className={`overflow-hidden border-2 surface-subtle shadow-card ${
        isFemale ? "border-team-female" : "border-team-male"
      }`}
    >
      <div className="flex items-center gap-5 p-6">
        {/* Player avatar — carries the jersey number as its badge */}
        <PlayerAvatar name={playerName} number={playerNumber} size="lg" />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Text variant="h1" className="mb-3">
            {playerName}
          </Text>

          {/* Badges */}
          <EntityHeaderBadges
            category={category}
            gender={gender}
            championship={championship}
          >
            <Badge variant={positionVariant(position)} size="sm">
              {position}
            </Badge>
          </EntityHeaderBadges>

          {/* Team link */}
          <Link
            href={`/teams/${teamId}`}
            aria-label={tCommon("team.seeTeam", { number: teamNumber })}
            className="text-sm font-medium text-text-heading hover:underline"
          >
            {clubName} · {teamNumber}
          </Link>

          {/* Championship link */}
          {competitionUrl && (
            <Link
              href={competitionUrl}
              aria-label={tCommon("competition.seeCompetition")}
              className="block text-sm text-text-secondary hover:text-primary hover:underline mt-1"
            >
              {tCompetitions("championship")}
            </Link>
          )}
        </div>

        {/* Club crest */}
        <div className="flex-shrink-0 pl-5 border-l border-divide self-stretch flex items-center">
          <ClubLogoLink clubId={clubId} clubName={clubName} />
        </div>
      </div>

      {/* Stats band */}
      {statsBand.length > 0 && (
        <div
          className="grid border-t border-divide"
          style={{ gridTemplateColumns: `repeat(${statsBand.length}, 1fr)` }}
        >
          {statsBand.map((s, i) => (
            <div
              key={s.label}
              className={
                i < statsBand.length - 1 ? "border-r border-divide" : ""
              }
            >
              <StatCell value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default PlayerHeader;
