// src/frontend/features/competitions/championships/components/detail/navigation/DivisionNavigation.tsx
import { useTranslations } from "next-intl";

import { NavButton } from "@/shared/components/primitives";

interface DivisionNavigationProps {
  readonly availableDivisions: number[];
  readonly currentDivision: number | undefined;
  readonly onNavigate: (division: number) => void;
}

export function DivisionNavigation({
  availableDivisions,
  currentDivision,
  onNavigate,
}: DivisionNavigationProps) {
  const t = useTranslations("competitions");

  if (availableDivisions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" aria-label={t("divisionAriaLabel")}>
      {availableDivisions.map((div) => (
        <NavButton
          key={div}
          variant={div === currentDivision ? "navActive" : "navInactive"}
          aria-pressed={div === currentDivision}
          onClick={() => onNavigate(div)}
        >
          {t("divisionWithValue", {
            value: div,
            defaultValue: `Division ${div}`,
          })}
        </NavButton>
      ))}
    </div>
  );
}

export default DivisionNavigation;
