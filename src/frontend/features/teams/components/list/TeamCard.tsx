// src/frontend/features/teams/components/list/TeamCard.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { Team } from "@/features/teams/types";
import {
  EntityCardBadges,
  EntityCardBody,
  getLevelConfig,
  ListEntityCard,
} from "@/shared/components/domain";
import { Text } from "@/shared/components/typography";
import { NA } from "@/shared/constants";
import { cn } from "@/shared/utils";

export const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");

  const clubName = team.club?.name ?? null;
  const level = team.pool?.championship?.level;
  const division = team.pool?.championship?.division ?? null;
  const poolLetter = team.pool?.letter ?? null;
  const category = team.category ?? null;
  const gender = team.gender ?? null;

  const config = getLevelConfig(level);

  return (
    <ListEntityCard
      href={`/teams/${team.id}`}
      ariaLabel={tCommon("team.seeTeam", { number: team.number })}
      level={level}
      headerLeft={
        <Text
          variant="label"
          className={cn("truncate font-semibold", config.text)}
        >
          {clubName ?? NA}
        </Text>
      }
      badges={
        <EntityCardBadges
          category={category}
          gender={gender}
          division={division}
          poolLabel={poolLetter ? `${tTeams("pool")} ${poolLetter}` : null}
          level={level}
        />
      }
    >
      <EntityCardBody
        clubName={clubName}
        title={clubName ?? NA}
        committee={team.club?.committee}
        number={team.number}
        level={level}
      />
    </ListEntityCard>
  );
};
