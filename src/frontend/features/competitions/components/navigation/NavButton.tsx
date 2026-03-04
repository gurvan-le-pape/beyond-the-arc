// src/frontend/features/competitions/components/navigation/NavButton.tsx
import React from "react";

import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";

interface NavButtonProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

/**
 * Navigation button for category, division, round, etc.
 * Wrapper around Button component with active state logic.
 */
export const NavButton: React.FC<NavButtonProps> = ({
  active = false,
  onClick,
  children,
  className = "",
  ariaLabel,
  type = "button",
}) => {
  return (
    <Button
      type={type}
      variant={active ? "navActive" : "navInactive"}
      size="md"
      onClick={onClick}
      className={cn("min-w-[90px]", className)}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      {children}
    </Button>
  );
};

export default NavButton;
