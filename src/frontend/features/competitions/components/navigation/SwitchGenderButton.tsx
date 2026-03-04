// src/frontend/features/competitions/components/navigation/SwitchGenderButton.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/shared/components/ui";
import { Gender } from "@/shared/constants";

interface SwitchGenderButtonProps {
  gender: Gender | null;
  onClick: () => void;
  className?: string;
}

/**
 * Button to switch between male and female championships.
 * Wrapper around Button component with gender-specific logic.
 */
export const SwitchGenderButton: React.FC<SwitchGenderButtonProps> = ({
  gender,
  onClick,
  className = "",
}) => {
  const t = useTranslations("competitions");
  const isMasculin = gender === Gender.MALE;

  return (
    <Button
      variant={isMasculin ? "male" : "female"}
      size="md"
      onClick={onClick}
      className={className}
      aria-label={
        isMasculin
          ? t("switchGender.ariaToFeminine")
          : t("switchGender.ariaToMasculine")
      }
    >
      {isMasculin
        ? t("switchGender.toFeminine")
        : t("switchGender.toMasculine")}
    </Button>
  );
};

export default SwitchGenderButton;
