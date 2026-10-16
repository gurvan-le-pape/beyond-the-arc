// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/SidePanelToggleButton.tsx
"use client";

import { List } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <button
      type="button"
      onClick={onOpen}
      className="fixed top-20 right-4 z-drawer inline-flex items-center gap-2 px-3 py-2.5 surface-subtle rounded-lg shadow-lg hover:bg-surface-inset transition-colors border border-divide text-sm font-semibold text-text-heading"
    >
      <List className="w-5 h-5 text-text-body" aria-hidden="true" />
      {t("map.openPanel")}
    </button>
  );
}

export default SidePanelToggleButton;
