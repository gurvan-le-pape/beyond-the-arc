// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/SidePanelToggleButton.tsx
"use client";

import { List } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/primitives";

interface SidePanelToggleButtonProps {
  readonly onOpen: () => void;
}

/** The floating hamburger button shown when the side panel is closed. */
export function SidePanelToggleButton({ onOpen }: SidePanelToggleButtonProps) {
  const t = useTranslations("clubs");

  // A labelled list icon, not a bare hamburger: on a phone the site menu's own
  // hamburger sits right above this button, and two identical icons read as
  // one control.
  return (
    <Button
      variant="control"
      onClick={onOpen}
      className="fixed top-20 right-4 z-drawer gap-2 shadow-lg"
    >
      <List className="w-5 h-5" aria-hidden="true" />
      {t("map.openPanel")}
    </Button>
  );
}

export default SidePanelToggleButton;
