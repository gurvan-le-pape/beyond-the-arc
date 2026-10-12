// src/frontend/features/players/components/detail/PlayerHeader.tsx
import { differenceInYears, parseISO } from "date-fns";
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

/**
 * Identity block at the top of a player detail page: avatar, name, physical
 * badges, and links out to the team, club and championship.
 *
 * **Requires a fully hydrated player.** It reads
 * `player.team.club.committee.league.id` without optional chaining, so a player
 * whose team, club or committee is absent throws rather than degrading. Only
 * the detail response (`getById`) carries that depth — a player from a list
 * response will not. `PlayerCard` optional-chains the same path precisely
 * because it renders the shallower shape.
 *
 * An **async server component**: it awaits its own translations, so it cannot be
 * rendered inside a client boundary.
 */
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

  // Age is a calendar question, not a duration: a 365.25-day year drifts
  // against real leap placement and flips the age a day early. `birthdate` is
  // a plain YYYY-MM-DD, so parseISO reads it as a local calendar date and
  // differenceInYears compares calendar fields — no zone is involved either
  // way.
  const age = differenceInYears(new Date(), parseISO(birthdate));

  const statsBand = [
    // age >= 0 rather than a truthiness check: a player in their first year
    // has age 0, which would otherwise drop the stat entirely.
    ...(age >= 0
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
      <div className="flex items-center gap-3 p-4 sm:gap-5 sm:p-6">
        <PlayerAvatar name={playerName} number={playerNumber} size="lg" />

        <div className="flex-1 min-w-0">
          <Text variant="h1" className="mb-3">
            {playerName}
          </Text>

          <EntityHeaderBadges
            category={category}
            gender={gender}
            championship={championship}
          >
            <Badge variant={positionVariant(position)} size="sm">
              {position}
            </Badge>
          </EntityHeaderBadges>

          <Link
            href={`/teams/${teamId}`}
            aria-label={tCommon("team.seeTeam", { number: teamNumber })}
            className="text-sm font-medium text-text-heading hover:underline"
          >
            {clubName} · {teamNumber}
          </Link>

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

        {/* Hidden on phones, where it would take a third of the row from the
            name and badges; the club name above already links to the team. */}
        <div className="hidden sm:flex flex-shrink-0 pl-5 border-l border-divide self-stretch items-center">
          <ClubLogoLink clubId={clubId} clubName={clubName} />
        </div>
      </div>

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
