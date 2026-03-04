// src/frontend/features/competitions/components/championships/ChampionshipList.tsx
import { useTranslations } from "next-intl";

import { GenderCategorizedList } from "@/shared/components/entity";
import { Section } from "@/shared/components/ui";
import { Gender } from "@/shared/constants";

import { useToggleCategory } from "../../hooks";
import { ChampionshipListItem } from "./ChampionshipListItem";

interface ChampionshipListProps {
  championshipsByGender: Record<Gender, any[]>;
  groupChampionshipsByCategory: (championships: any[]) => Record<string, any[]>;
  onItemClick: (championship: any) => void;
}

function ChampionshipList({
  championshipsByGender,
  groupChampionshipsByCategory,
  onItemClick,
}: ChampionshipListProps) {
  const { expandedCategories, toggleCategory } = useToggleCategory();
  const tCompetitions = useTranslations("competitions");
  const tTeams = useTranslations("teams");

  return (
    <Section title={tCompetitions("championshipsSectionTitle")}>
      <div className="flex flex-col gap-2">
        <GenderCategorizedList
          genderLabel={tTeams("teamsTable.genderHeading.feminine")}
          genderKey={Gender.FEMALE}
          items={championshipsByGender[Gender.FEMALE] || []}
          groupByCategory={groupChampionshipsByCategory}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          renderItem={(championship) => (
            <ChampionshipListItem
              championship={championship}
              onClick={() => onItemClick(championship)}
            />
          )}
        />
        <GenderCategorizedList
          genderLabel={tTeams("teamsTable.genderHeading.masculine")}
          genderKey={Gender.MALE}
          items={championshipsByGender[Gender.MALE] || []}
          groupByCategory={groupChampionshipsByCategory}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          renderItem={(championship) => (
            <ChampionshipListItem
              championship={championship}
              onClick={() => onItemClick(championship)}
            />
          )}
        />
      </div>
    </Section>
  );
}

export default ChampionshipList;
