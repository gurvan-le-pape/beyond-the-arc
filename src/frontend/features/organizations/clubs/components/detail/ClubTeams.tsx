// src/frontend/features/organizations/clubs/components/detail/ClubTeams.tsx
"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { Section } from "@/shared/components/blocks";
import {
  GenderCategorizedList,
  TeamListItem,
} from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";
import { Gender } from "@/shared/constants";
import { useToggleCategory } from "@/shared/hooks";

import type { ClubDetailed, ClubTeamInfo } from "../../types/ClubDetailed";

interface ClubTeamsProps {
  readonly club: ClubDetailed;
  readonly teamsByGender: Record<Gender, ClubTeamInfo[]>;
}

export function ClubTeams({ club, teamsByGender }: ClubTeamsProps) {
  const tCommon = useTranslations("common");
  const tClubs = useTranslations("clubs");
  const { expandedCategories, toggleCategory } = useToggleCategory();

  if (!club.teams?.length) {
    return (
      <EmptyState
        icon={<Users className="w-16 h-16" />}
        title={tClubs("noTeams")}
      />
    );
  }

  return (
    <Section title={tClubs("detail.teamsTitle")} variant="highlighted">
      <GenderCategorizedList
        genderLabel={tCommon("gender.female")}
        genderKey={Gender.FEMALE}
        items={teamsByGender[Gender.FEMALE] || []}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        renderItem={(team) => <TeamListItem team={team} clubName={club.name} />}
      />

      <GenderCategorizedList
        genderLabel={tCommon("gender.male")}
        genderKey={Gender.MALE}
        items={teamsByGender[Gender.MALE] || []}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        renderItem={(team) => <TeamListItem team={team} clubName={club.name} />}
      />
    </Section>
  );
}
