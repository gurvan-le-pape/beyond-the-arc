// src/frontend/features/competitions/championships/components/detail/championship-navigation/_ChampionshipNavigation.tsx

import { Card } from "@/shared/components/primitives";

import { useCategoryNavigation, useDivisionNavigation } from "../../../hooks";
import type { CategoryNav, DivisionNav } from "../../../types";
import CategoryNavigation from "./CategoryNavigation";
import DivisionNavigation from "./DivisionNavigation";

interface ChampionshipNavigationProps {
  readonly categoryNav: CategoryNav;
  readonly divisionNav: DivisionNav;
}

export function ChampionshipNavigation({
  categoryNav,
  divisionNav,
}: ChampionshipNavigationProps) {
  const buildRoute = (id: number) => `/championships/${id}`;

  const { navigateToCategory } = useCategoryNavigation(
    categoryNav.categoryMap,
    buildRoute,
  );

  const { navigateToDivision } = useDivisionNavigation(
    divisionNav.divisionMap,
    buildRoute,
  );

  return (
    <Card variant="highlighted" padding="md">
      <div className="space-y-4">
        <CategoryNavigation
          availableCategories={categoryNav.availableCategories}
          currentCategory={categoryNav.currentCategory}
          onNavigate={navigateToCategory}
        />
        <DivisionNavigation
          availableDivisions={divisionNav.availableDivisions}
          currentDivision={divisionNav.currentDivision}
          onNavigate={navigateToDivision}
        />
      </div>
    </Card>
  );
}
