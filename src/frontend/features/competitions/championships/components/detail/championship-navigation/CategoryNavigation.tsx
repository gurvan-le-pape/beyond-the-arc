// src/frontend/features/competitions/championships/components/detail/championship-navigation/CategoryNavigation.tsx
import { useTranslations } from "next-intl";

import { NavButton } from "@/shared/components/primitives";
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
    <div className="flex flex-wrap gap-2" aria-label={t("categoryAriaLabel")}>
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
  );
}

export default CategoryNavigation;
