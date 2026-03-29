// src/frontend/shared/components/entity/categorized-list/GenderCategorizedList.tsx
import { useTranslations } from "next-intl";

import type { Category } from "@/shared/constants";
import { Gender } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";

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
  {
    bg: string;
    text: string;
    bgDark: string;
    textDark: string;
  }
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

/**
 * GenderCategorizedList
 *
 * A generic component that displays items grouped by gender and category with
 * expandable/collapsible sections. Used across features to maintain consistent
 * UX for gender-based categorized lists (teams, championships, etc.).
 *
 * @template T - The type of items being displayed (Team, Championship, etc.)
 *
 * @example
 * // Display teams grouped by gender and category
 * <GenderCategorizedList
 *   genderLabel={t("gender.female")}
 *   genderKey={Gender.FEMALE}
 *   items={teamsByGender[Gender.FEMALE] || []}
 *   groupByCategory={groupByCategory}
 *   expandedCategories={expandedCategories}
 *   toggleCategory={toggleCategory}
 *   renderItem={(team, index) => (
 *     <TeamListItem
 *       team={team}
 *       clubName={club.name}
 *       onClick={() => router.push(`/teams/${team.id}`)}
 *     />
 *   )}
 * />
 *
 * Features:
 * - Gender-specific color coding (pink for female, blue for male)
 * - Category-based grouping with expand/collapse
 * - Fully customizable item rendering via renderItem prop
 * - Dark mode support
 * - Accessible keyboard navigation
 */
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
  const colours = GENDER_COLOURS[genderKey] || GENDER_COLOURS[Gender.MALE];

  return (
    <div className={className}>
      {/* Gender badge */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
            colours.bg,
            colours.text,
            colours.bgDark,
            colours.textDark,
          )}
        >
          {genderLabel}
        </span>
        <span className="flex-1 h-px bg-surface-raised dark:bg-divide-dark" />
      </div>

      {/* Category sections */}
      <div className="space-y-3">
        {(Object.keys(grouped) as Category[])
          .filter(
            (category) => grouped[category] && grouped[category]!.length > 0,
          )
          .map((category) => {
            const categoryItems = grouped[category] || [];
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
