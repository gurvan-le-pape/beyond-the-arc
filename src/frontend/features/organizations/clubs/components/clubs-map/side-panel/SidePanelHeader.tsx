// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/SidePanelHeader.tsx
"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";

interface SidePanelHeaderProps {
  readonly clubCount: number;
  readonly onClose: () => void;
}

/** Panel header: title, club count, and the close button. */
export function SidePanelHeader({ clubCount, onClose }: SidePanelHeaderProps) {
  const t = useTranslations("clubs");

  return (
    <div className="flex items-center justify-between p-4 border-b border-divide bg-surface-inset flex-shrink-0">
      <div>
        <Text variant="h2" className="text-lg">
          {t("map.title")}
        </Text>
        <Text variant="caption">
          {clubCount} {clubCount === 1 ? t("club") : t("clubs")}
        </Text>
      </div>
      <div className="flex items-center gap-1">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-surface-inset rounded-lg transition-colors"
          aria-label={t("map.closePanel")}
          title={t("map.closePanel")}
        >
          <svg
            className="w-5 h-5 text-text-body"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SidePanelHeader;
