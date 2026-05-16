// src/frontend/features/competitions/championships/components/detail/ChampionshipList.tsx
"use client";

import { useTranslations } from "next-intl";

import { Section } from "@/shared/components/blocks";
import { GenderCategorizedList } from "@/shared/components/domain";
import { Gender } from "@/shared/constants";
import { useToggleCategory } from "@/shared/hooks";
import { groupBy } from "@/shared/utils";

import type { Championship } from "../../types";
import { ChampionshipListItem } from "./ChampionshipListItem";

interface ChampionshipListProps {
  readonly championships: Championship[];
}

export function ChampionshipList({ championships }: ChampionshipListProps) {
  const { expandedCategories, toggleCategory } = useToggleCategory();
  const tCompetitions = useTranslations("competitions");
  const tTeams = useTranslations("teams");

  const championshipsByGender = groupBy(championships, (c) => c.gender);

  return (
    <Section
      title={tCompetitions("championshipsSectionTitle")}
      variant="highlighted"
    >
      <div className="flex flex-col gap-2">
        <GenderCategorizedList
          genderLabel={tTeams("teamsTable.genderHeading.feminine")}
          genderKey={Gender.FEMALE}
          items={championshipsByGender[Gender.FEMALE] || []}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          renderItem={(championship) => (
            <ChampionshipListItem championship={championship} />
          )}
        />
        <GenderCategorizedList
          genderLabel={tTeams("teamsTable.genderHeading.masculine")}
          genderKey={Gender.MALE}
          items={championshipsByGender[Gender.MALE] || []}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          renderItem={(championship) => (
            <ChampionshipListItem championship={championship} />
          )}
        />
      </div>
    </Section>
  );
}

export default ChampionshipList;
