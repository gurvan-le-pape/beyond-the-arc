// src/frontend/shared/components/domain/GenderCategorizedSection.tsx
"use client";

import { useTranslations } from "next-intl";

import { Section } from "@/shared/components/blocks";
import type { Category } from "@/shared/constants";
import { Gender } from "@/shared/constants";
import { useToggleCategory } from "@/shared/hooks";
import { groupBy } from "@/shared/utils";

import { GenderCategorizedList } from "./GenderCategorizedList";

interface GenderCategorizedSectionProps<
  T extends { id: number | string; category: Category },
> {
  readonly items: T[];
  readonly getGender: (item: T) => Gender;
  readonly renderItem: (item: T) => React.ReactNode;
  readonly title: string;
  readonly variant?: "highlighted" | "default";
  readonly emptyState: React.ReactNode;
}

export function GenderCategorizedSection<
  T extends { id: number | string; category: Category },
>({
  items,
  getGender,
  renderItem,
  title,
  variant = "highlighted",
  emptyState,
}: GenderCategorizedSectionProps<T>) {
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
          renderItem={renderItem}
        />
        <GenderCategorizedList
          genderLabel={tCommon("gender.male")}
          genderKey={Gender.MALE}
          items={byGender[Gender.MALE] || []}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          renderItem={renderItem}
        />
      </div>
    </Section>
  );
}
