// src/frontend/features/teams/components/list/TeamCard.tsx
import { useTranslations } from "next-intl";

import type { Team } from "@/features/teams/types";
import {
  EntityCardBadges,
  EntityCardBody,
  getLevelConfig,
  ListEntityCard,
} from "@/shared/components/domain";
import { Text } from "@/shared/components/typography";
import { cn, formatTeamName } from "@/shared/utils";

interface TeamCardProps {
  readonly team: Team;
}

/**
 * One team in a list, linking to its detail page.
 *
 * **A team has no name of its own**, so the club name is rendered twice — as the
 * header and as the card title — and what actually distinguishes two teams of
 * the same club is the number plus the badges beside it (category, gender,
 * division, pool). Dropping a badge makes sibling teams indistinguishable
 * rather than merely plainer.
 *
 * Every team plays in a pool, so the level, division and pool letter are always
 * there.
 */
export function TeamCard({ team }: TeamCardProps) {
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");

  const clubName = team.club.name;
  const level = team.pool.championship.level;
  const division = team.pool.championship.division;
  const poolLetter = team.pool.letter;
  const category = team.category;
  const gender = team.gender;

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
          {clubName}
        </Text>
      }
      badges={
        <EntityCardBadges
          category={category}
          gender={gender}
          division={division}
          poolLabel={tTeams("poolLabel", { letter: poolLetter })}
          level={level}
        />
      }
    >
      <EntityCardBody
        title={formatTeamName(clubName, team.number) || tCommon("notAvailable")}
        committee={team.club.committee}
        level={level}
      />
    </ListEntityCard>
  );
}
