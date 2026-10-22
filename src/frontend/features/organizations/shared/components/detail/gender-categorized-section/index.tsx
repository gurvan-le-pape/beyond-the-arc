// src/frontend/features/organizations/shared/components/detail/gender-categorized-section/index.tsx
"use client";

import { useTranslations } from "next-intl";

import { ChampionshipListItem } from "@/features/competitions/championships/components";
import type { Championship } from "@/features/competitions/championships/types";
import { Section } from "@/shared/components/blocks";
import type { Category } from "@/shared/constants";
import { Gender } from "@/shared/constants";
import { groupBy } from "@/shared/utils";

import { GenderCategorizedList } from "./GenderCategorizedList";
import { useToggleCategory } from "./useToggleCategory";

interface SectionItem {
  type: "championship";
  data: Championship;
}

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
  return <ChampionshipListItem championship={item.data} />;
}

interface GenderCategorizedSectionProps {
  readonly items: SectionItem[];
  readonly title: string;
  readonly emptyState: React.ReactNode;
  /**
   * Opens every category on arrival. Right for a club's handful of teams,
   * which are the point of the page; wrong for an organisation's dozens of
   * championships, which stay folded.
   */
  readonly defaultExpanded?: boolean;
}

/**
 * A titled section grouping its items by gender and then by category.
 *
 * The grouping is derived from the items themselves, so a gender or category
 * with nothing in it never appears. `emptyState` covers only the case where
 * there are no items at all.
 */
export function GenderCategorizedSection({
  items,
  title,
  emptyState,
  defaultExpanded = false,
}: GenderCategorizedSectionProps) {
  const { isExpanded, toggleCategory } = useToggleCategory(defaultExpanded);
  const tCommon = useTranslations("common");

  if (!items?.length) return <>{emptyState}</>;

  const byGender = groupBy(items, getGender);

  return (
    <Section title={title}>
      <div className="flex flex-col gap-2">
        <GenderCategorizedList
          genderLabel={tCommon("gender.female")}
          genderKey={Gender.FEMALE}
          items={byGender[Gender.FEMALE] || []}
          isExpanded={isExpanded}
          toggleCategory={toggleCategory}
          getCategory={getCategory}
          getId={getId}
          renderItem={renderItem}
        />
        <GenderCategorizedList
          genderLabel={tCommon("gender.male")}
          genderKey={Gender.MALE}
          items={byGender[Gender.MALE] || []}
          isExpanded={isExpanded}
          toggleCategory={toggleCategory}
          getCategory={getCategory}
          getId={getId}
          renderItem={renderItem}
        />
      </div>
    </Section>
  );
}
