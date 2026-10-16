// src/frontend/features/players/components/detail/PlayerHeader.tsx
import { differenceInYears, parseISO } from "date-fns";
import { getTranslations } from "next-intl/server";

import {
  ClubMarkLink,
  EntityHeader,
  type EntityHeaderStat,
} from "@/shared/components/domain";
import { Badge, TextLink } from "@/shared/components/primitives";
import { formatTeamName, positionVariant } from "@/shared/utils";

import type { Player } from "../../types/Player";
import { PlayerAvatar } from "../PlayerAvatar";

interface PlayerHeaderProps {
  readonly player: Player;
}

/**
 * Identity block at the top of a player detail page: avatar, name, the team's
 * badges and the player's position, links to the team and its championship,
 * the club mark, and a band with age, height and weight.
 *
 * **Requires a fully hydrated player.** It reads `player.team.club` without
 * optional chaining, so a player whose team or club is absent throws rather
 * than degrading. Only the detail response (`getById`) carries that depth — a
 * player from a list response will not. `PlayerCard` optional-chains the same
 * path precisely because it renders the shallower shape.
 *
 * An **async server component**: it awaits its own translations, so it cannot be
 * rendered inside a client boundary.
 */
export async function PlayerHeader({ player }: PlayerHeaderProps) {
  const tCommon = await getTranslations("common");
  const tPlayers = await getTranslations("players");

  const { name, number, position, heightCm, weightKg, birthdate, team } =
    player;
  const club = team.club;

  // Age is a calendar question, not a duration: a 365.25-day year drifts
  // against real leap placement and flips the age a day early. `birthdate` is
  // a plain YYYY-MM-DD, so parseISO reads it as a local calendar date and
  // differenceInYears compares calendar fields — no zone is involved either
  // way.
  const age = differenceInYears(new Date(), parseISO(birthdate));

  const stats: EntityHeaderStat[] = [
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
    <EntityHeader
      visual={<PlayerAvatar name={name} number={number} size="lg" />}
      title={name}
      category={team.category}
      gender={team.gender}
      championship={team.pool?.championship}
      extraBadges={
        <Badge variant={positionVariant(position)} size="sm">
          {tCommon(`positions.${position}`)}
        </Badge>
      }
      subtitle={
        <TextLink
          href={`/teams/${player.teamId}`}
          variant="plain"
          ariaLabel={tCommon("team.seeTeam", { number: team.number })}
        >
          {formatTeamName(club.name, team.number)}
        </TextLink>
      }
      aside={<ClubMarkLink clubId={club.id} clubName={club.name} />}
      stats={stats}
    />
  );
}

export default PlayerHeader;
