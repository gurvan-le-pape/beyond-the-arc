// src/frontend/features/players/components/list/PlayerCard.tsx
import { useTranslations } from "next-intl";
import React from "react";

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

export const PlayerCard: React.FC<{ player: Player }> = ({ player }) => {
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
};
