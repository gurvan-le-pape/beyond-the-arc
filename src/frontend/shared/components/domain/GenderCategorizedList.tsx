// src/frontend/shared/components/domain/GenderCategorizedList.tsx
import { useTranslations } from "next-intl";

import type { Category } from "@/shared/constants";
import { Gender } from "@/shared/constants";
import { groupBy } from "@/shared/utils";
import { cn } from "@/shared/utils/cn";

import { Text } from "../typography";
import { CategorySection } from "./CategorySection";

interface GenderCategorizedListProps<
  T extends { id: number | string; category: Category },
> {
  readonly genderLabel: string;
  readonly genderKey: Gender;
  readonly items: T[];
  readonly expandedCategories: Record<string, boolean>;
  readonly toggleCategory: (key: string) => void;
  readonly renderItem: (item: T, index: number) => React.ReactNode;
  readonly className?: string;
}

const GENDER_COLOURS: Record<string, { bg: string; text: string }> = {
  [Gender.FEMALE]: {
    bg: "bg-team-female-subtle",
    text: "text-team-female-strong",
  },
  [Gender.MALE]: {
    bg: "bg-team-male-subtle",
    text: "text-team-male-strong",
  },
};

export function GenderCategorizedList<
  T extends { id: number | string; category: Category },
>({
  genderLabel,
  genderKey,
  items,
  expandedCategories,
  toggleCategory,
  renderItem,
  className,
}: GenderCategorizedListProps<T>) {
  const t = useTranslations("common");
  const grouped = groupBy(items, (item) => item.category);
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
          )}
        >
          <Text variant="caption" as="span" className="font-semibold">
            {genderLabel}
          </Text>
        </span>
        <span className="flex-1 h-px bg-divide" />
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
