// src/frontend/features/players/components/list/PlayerCard.tsx
import { useTranslations } from "next-intl";

import type { Player } from "@/features/players/types";
import {
  EntityCardBadges,
  EntityCardBody,
  getLevelConfig,
  ListEntityCard,
} from "@/shared/components/domain";
import { Text } from "@/shared/components/typography";
import { NA } from "@/shared/constants";
import { cn } from "@/shared/utils";

interface PlayerCardProps {
  readonly player: Player;
}

/**
 * One player in a list: club and team number as the header, name and jersey
 * number in the body, category/gender/level as badges, linking to the detail
 * page.
 *
 * **Tolerates a player with no team.** Every path through `player.team` is
 * optional-chained and falls back to `NA`, because list responses do not always
 * carry the nested club and championship. `PlayerHeader` reads the same `Player`
 * type without chaining and requires the fully hydrated detail shape — the two
 * disagree deliberately, and feeding this component's data to that one throws.
 *
 * The level drives the accent colour through `getLevelConfig`, so a player whose
 * team has no championship renders in the neutral default rather than failing.
 */
export function PlayerCard({ player }: PlayerCardProps) {
  const tCommon = useTranslations("common");

  const clubName = player.team?.club?.name ?? null;
  const teamNumber = player.team?.number ? String(player.team.number) : null;
  const category = player.team?.category ?? null;
  const gender = player.team?.gender ?? null;
  const level = player.team?.pool?.championship?.level;
  const committee = player.team?.club?.committee ?? null;

  const config = getLevelConfig(level);

  const clubTeamLabel =
    clubName && teamNumber
      ? `${clubName} - ${teamNumber}`
      : (clubName ?? teamNumber ?? NA);

  return (
    <ListEntityCard
      href={`/players/${player.id}`}
      ariaLabel={tCommon("player.seePlayer", { name: player.name })}
      level={level}
      headerLeft={
        <Text
          variant="label"
          className={cn("truncate font-semibold", config.text)}
        >
          {clubTeamLabel}
        </Text>
      }
      badges={
        <EntityCardBadges category={category} gender={gender} level={level} />
      }
    >
      <EntityCardBody
        clubName={clubName}
        title={player.name}
        committee={committee}
        number={player.number}
        level={level}
      />
    </ListEntityCard>
  );
}
