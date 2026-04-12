// src/frontend/features/competitions/championships/components/detail/navigation/CategoryNavigation.tsx
import { useTranslations } from "next-intl";

import { NavButton } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import type { Category } from "@/shared/constants";

interface CategoryNavigationProps {
  readonly availableCategories: Category[];
  readonly currentCategory: Category | undefined;
  readonly onNavigate: (category: Category) => void;
}

export function CategoryNavigation({
  availableCategories,
  currentCategory,
  onNavigate,
}: CategoryNavigationProps) {
  const t = useTranslations("competitions");

  if (availableCategories.length === 0) return null;

  return (
    <div className="flex items-start gap-4 flex-wrap">
      <div className="min-w-[8rem] pt-2">
        <Text
          variant="label"
          className="text-text-heading dark:text-text-heading-dark"
        >
          {t("categoryLabel")}
        </Text>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableCategories.map((cat) => (
          <NavButton
            key={cat}
            variant={cat === currentCategory ? "navActive" : "navInactive"}
            aria-pressed={cat === currentCategory}
            onClick={() => onNavigate(cat)}
          >
            {cat}
          </NavButton>
        ))}
      </div>
    </div>
  );
}

export default CategoryNavigation;
