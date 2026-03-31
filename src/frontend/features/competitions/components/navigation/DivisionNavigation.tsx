// src/frontend/features/competitions/components/navigation/DivisionNavigation.tsx
import { useTranslations } from "next-intl";

import { NavButton } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

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
        <Text variant="label">{t("divisionLabel")}</Text>
      </div>
      <div className="flex flex-wrap gap-2">
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
    </div>
  );
}

export default DivisionNavigation;
