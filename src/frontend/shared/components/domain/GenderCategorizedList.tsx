// src/frontend/shared/components/domain/GenderCategorizedList.tsx
import { useTranslations } from "next-intl";

import type { Category } from "@/shared/constants";
import { Gender } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";

import { Text } from "../typography";
import { CategorySection } from "./CategorySection";

interface GenderCategorizedListProps<T> {
  genderLabel: string;
  genderKey: Gender;
  items: T[];
  groupByCategory: (items: T[]) => Partial<Record<Category, T[]>>;
  expandedCategories: Record<string, boolean>;
  toggleCategory: (key: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

const GENDER_COLOURS: Record<
  string,
  { bg: string; text: string; bgDark: string; textDark: string }
> = {
  [Gender.FEMALE]: {
    bg: "bg-team-female-light/20",
    text: "text-team-female-dark",
    bgDark: "dark:bg-team-female-dark/20",
    textDark: "dark:text-team-female-light",
  },
  [Gender.MALE]: {
    bg: "bg-team-male-light/20",
    text: "text-team-male-dark",
    bgDark: "dark:bg-team-male-dark/20",
    textDark: "dark:text-team-male-light",
  },
};

export function GenderCategorizedList<T>({
  genderLabel,
  genderKey,
  items,
  groupByCategory,
  expandedCategories,
  toggleCategory,
  renderItem,
  className,
}: GenderCategorizedListProps<T>) {
  const t = useTranslations("common");
  const grouped = groupByCategory(items);
  const colours = GENDER_COLOURS[genderKey] ?? GENDER_COLOURS[Gender.MALE];

  return (
    <div className={className}>
      {/* Gender badge */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full",
            colours.bg,
            colours.text,
            colours.bgDark,
            colours.textDark,
          )}
        >
          <Text variant="caption" as="span" className="font-semibold">
            {genderLabel}
          </Text>
        </span>
        <span className="flex-1 h-px bg-divide-light dark:bg-divide-dark" />
      </div>

      {/* Category sections */}
      <div className="space-y-3">
        {(Object.keys(grouped) as Category[])
          .filter((category) => (grouped[category]?.length ?? 0) > 0)
          .map((category) => {
            const categoryItems = grouped[category] ?? [];
            const categoryKey = `${genderKey}-${category}`;
            const isExpanded = expandedCategories[categoryKey] === true;

            return (
              <CategorySection
                key={categoryKey}
                category={category}
                items={categoryItems}
                categoryKey={categoryKey}
                isExpanded={isExpanded}
                toggleCategory={toggleCategory}
                renderItem={renderItem}
                emptyMessage={t("noItemsAvailable")}
              />
            );
          })}
      </div>
    </div>
  );
}
