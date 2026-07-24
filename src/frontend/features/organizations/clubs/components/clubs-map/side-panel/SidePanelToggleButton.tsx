// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/SidePanelToggleButton.tsx
"use client";

import { useTranslations } from "next-intl";

interface SidePanelToggleButtonProps {
  readonly onOpen: () => void;
}

/** The floating hamburger button shown when the side panel is closed. */
export function SidePanelToggleButton({ onOpen }: SidePanelToggleButtonProps) {
  const t = useTranslations("clubs");

  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed top-20 right-4 z-20 p-3 surface-raised rounded-lg shadow-lg hover:bg-surface-inset transition-colors border border-divide"
      aria-label={t("map.openPanel")}
      title={t("map.openPanel")}
    >
      <svg
        className="w-6 h-6 text-text-body"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

export default SidePanelToggleButton;
