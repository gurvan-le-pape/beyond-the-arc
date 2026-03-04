// src/frontend/features/organizations/clubs/components/detail/ClubTeams.tsx
"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { useToggleCategory } from "@/features/competitions/hooks";
import { TeamListItem } from "@/features/teams/components";
import { useRouter } from "@/navigation";
import { GenderCategorizedList } from "@/shared/components/entity";
import { Section } from "@/shared/components/ui/composite";
import { EmptyState } from "@/shared/components/ui/feedback";
import { Gender } from "@/shared/constants";
import { groupTeamsByCategory } from "@/shared/utils/grouping";

import type { ClubDetailed, ClubTeamInfo } from "../../types/ClubDetailed";

// ClubTeams component
interface ClubTeamsProps {
  club: ClubDetailed;
  teamsByGender: Record<Gender, ClubTeamInfo[]>;
}

export function ClubTeams({ club, teamsByGender }: ClubTeamsProps) {
  const tCommon = useTranslations("common");
  const tClubs = useTranslations("clubs");
  const router = useRouter();
  const { expandedCategories, toggleCategory } = useToggleCategory();
  const hasTeams = club.teams && club.teams.length > 0;

  if (!hasTeams) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="w-16 h-16" />}
        title={tClubs("noTeams")}
      />
    );
  }

  return (
    <Section title={tClubs("detail.teamsTitle")}>
      <GenderCategorizedList
        genderLabel={tCommon("gender.female")}
        genderKey={Gender.FEMALE}
        items={teamsByGender[Gender.FEMALE] || []}
        groupByCategory={(teams) => groupTeamsByCategory(teams)}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        renderItem={(team) => (
          <TeamListItem
            team={team}
            clubName={club.name}
            onClick={() => void router.push(`/teams/${team.id}`)}
          />
        )}
      />

      <GenderCategorizedList
        genderLabel={tCommon("gender.male")}
        genderKey={Gender.MALE}
        items={teamsByGender[Gender.MALE] || []}
        groupByCategory={(teams) => groupTeamsByCategory(teams)}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        renderItem={(team) => (
          <TeamListItem
            team={team}
            clubName={club.name}
            onClick={() => void router.push(`/teams/${team.id}`)}
          />
        )}
      />
    </Section>
  );
}
