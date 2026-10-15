// src/frontend/features/organizations/shared/components/detail/gender-categorized-section/GenderCategorizedList.tsx
import { useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";
import type { Category } from "@/shared/constants";
import { Gender } from "@/shared/constants";
import { cn, groupBy, sortCategories } from "@/shared/utils";

import { CategorySection } from "./CategorySection";

interface GenderCategorizedListProps<T> {
  readonly genderLabel: string;
  readonly genderKey: Gender;
  readonly items: T[];
  readonly expandedCategories: Record<string, boolean>;
  readonly toggleCategory: (key: string) => void;
  readonly getCategory: (item: T) => Category;
  readonly getId: (item: T) => number | string;
  readonly renderItem: (item: T) => React.ReactNode;
  readonly className?: string;
}

const GENDER_COLOURS: Record<string, { bg: string; text: string }> = {
  [Gender.FEMALE]: {
    bg: "bg-tint-female",
    text: "text-ink-female",
  },
  [Gender.MALE]: {
    bg: "bg-tint-male",
    text: "text-ink-male",
  },
};

/**
 * The category groups within one gender, each collapsible.
 *
 * Categories are ordered by age rather than alphabetically — U11 before U13
 * before U15 — which is what `sortCategories` exists for. Note that it sorts in
 * place, so the array handed here must be one this component owns.
 *
 * @typeParam T - the item shape; `getCategory` tells this component how to read
 * a category off it, so the items need no particular fields
 */
export function GenderCategorizedList<T>({
  genderLabel,
  genderKey,
  items,
  expandedCategories,
  toggleCategory,
  getCategory,
  getId,
  renderItem,
  className,
}: GenderCategorizedListProps<T>) {
  const t = useTranslations("common");
  const grouped = groupBy(items, (item) => getCategory(item));
  const colours = GENDER_COLOURS[genderKey] ?? GENDER_COLOURS[Gender.MALE];

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full",
            colours.bg,
            colours.text,
          )}
        >
          <Text variant="caption" as="span" className="font-semibold">
            {genderLabel}
          </Text>
        </span>
        <span className="flex-1 h-px bg-divide" />
      </div>

      <div className="space-y-3">
        {sortCategories(Object.keys(grouped) as Category[])
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
                getId={getId}
                renderItem={renderItem}
                emptyMessage={t("noItemsAvailable")}
              />
            );
          })}
      </div>
    </div>
  );
}
