// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/SidePanelHeader.tsx
"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { IconButton } from "@/shared/components/primitives";
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
        <Text variant="h3" as="h2">
          {t("map.title")}
        </Text>
        <Text variant="caption">
          {clubCount} {clubCount === 1 ? t("club") : t("clubs")}
        </Text>
      </div>
      <div className="flex items-center gap-1">
        <IconButton
          onClick={onClose}
          label={t("map.closePanel")}
          title={t("map.closePanel")}
        >
          <X />
        </IconButton>
      </div>
    </div>
  );
}

export default SidePanelHeader;
