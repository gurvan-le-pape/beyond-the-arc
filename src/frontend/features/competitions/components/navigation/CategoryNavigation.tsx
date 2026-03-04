// src/frontend/features/competitions/components/navigation/CategoryNavigation.tsx
import { useTranslations } from "next-intl";

import { NavButton } from "@/features/competitions/components";
import type { Category } from "@/shared/constants";

interface CategoryNavigationProps {
  availableCategories: Category[];
  currentCategory: Category | undefined;
  onNavigate: (category: Category) => void;
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
        <p className="text-body font-semibold text-gray-900 dark:text-gray-100">
          {t("categoryLabel")}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableCategories.map((cat) => (
          <NavButton
            key={cat}
            active={cat === currentCategory}
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
