// src/frontend/shared/components/domain/GenderCategorizedSection.tsx
"use client";

import { useTranslations } from "next-intl";

import { ChampionshipListItem } from "@/features/competitions/championships/components";
import type { Championship } from "@/features/competitions/championships/types";
import type { ClubTeamInfo } from "@/features/organizations/clubs/types";
import { TeamListItem } from "@/features/teams/components";
import { Section } from "@/shared/components/blocks";
import type { Category } from "@/shared/constants";
import { Gender } from "@/shared/constants";
import { useToggleCategory } from "@/shared/hooks";
import { groupBy } from "@/shared/utils";

import { GenderCategorizedList } from "./GenderCategorizedList";

type SectionItem =
  | { type: "championship"; data: Championship }
  | { type: "team"; data: ClubTeamInfo; clubName: string };

function getGender(item: SectionItem): Gender {
  return item.data.gender;
}

function getCategory(item: SectionItem): Category {
  return item.data.category;
}

function getId(item: SectionItem): number | string {
  return item.data.id;
}

function renderItem(item: SectionItem) {
  switch (item.type) {
    case "championship":
      return <ChampionshipListItem championship={item.data} />;
    case "team":
      return <TeamListItem team={item.data} clubName={item.clubName} />;
  }
}

interface GenderCategorizedSectionProps {
  readonly items: SectionItem[];
  readonly title: string;
  readonly variant?: "highlighted" | "default";
  readonly emptyState: React.ReactNode;
}

export function GenderCategorizedSection({
  items,
  title,
  variant = "highlighted",
  emptyState,
}: GenderCategorizedSectionProps) {
  const { expandedCategories, toggleCategory } = useToggleCategory();
  const tCommon = useTranslations("common");

  if (!items?.length) return <>{emptyState}</>;

  const byGender = groupBy(items, getGender);

  return (
    <Section title={title} variant={variant}>
      <div className="flex flex-col gap-2">
        <GenderCategorizedList
          genderLabel={tCommon("gender.female")}
          genderKey={Gender.FEMALE}
          items={byGender[Gender.FEMALE] || []}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          getCategory={getCategory}
          getId={getId}
          renderItem={renderItem}
        />
        <GenderCategorizedList
          genderLabel={tCommon("gender.male")}
          genderKey={Gender.MALE}
          items={byGender[Gender.MALE] || []}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          getCategory={getCategory}
          getId={getId}
          renderItem={renderItem}
        />
      </div>
    </Section>
  );
}
