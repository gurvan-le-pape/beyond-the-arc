// src/frontend/features/competitions/components/navigation/DivisionNavigation.tsx
import { useTranslations } from "next-intl";

import { NavButton } from "@/features/competitions/components";

interface DivisionNavigationProps {
  availableDivisions: number[];
  currentDivision: number | undefined;
  onNavigate: (division: number) => void;
}

export function DivisionNavigation({
  availableDivisions,
  currentDivision,
  onNavigate,
}: DivisionNavigationProps) {
  const t = useTranslations("competitions");

  if (availableDivisions.length === 0) return null;

  return (
    <div className="flex items-start gap-4 flex-wrap">
      <div className="min-w-[8rem] pt-2">
        <p className="text-body font-semibold text-gray-700 dark:text-gray-300">
          {t("divisionLabel")}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableDivisions.map((div) => (
          <NavButton
            key={div}
            active={div === currentDivision}
            onClick={() => onNavigate(div)}
          >
            {t("divisionWithValue", {
              value: div,
              defaultValue: `Division ${div}`,
            })}
          </NavButton>
        ))}
      </div>
    </div>
  );
}

export default DivisionNavigation;
