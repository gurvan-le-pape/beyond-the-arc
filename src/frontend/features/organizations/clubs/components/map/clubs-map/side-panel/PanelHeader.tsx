// src/frontend/features/organizations/clubs/components/map/clubs-map/side-panel/PanelHeader.tsx
"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { IconButton } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface PanelHeaderProps {
  readonly clubCount: number;
  readonly onClose: () => void;
}

/** Panel header: title, club count, and the close button. */
export function PanelHeader({ clubCount, onClose }: PanelHeaderProps) {
  const t = useTranslations("clubs");

  return (
    <div className="flex items-center justify-between p-4 border-b border-divide bg-surface-inset flex-shrink-0">
      <div>
        <Text variant="h3" as="h2">
          {t("map.title")}
        </Text>
        {/* Follows the search as it narrows the list, so it is announced. */}
        <Text variant="caption" aria-live="polite">
          {t("map.clubCount", { count: clubCount })}
        </Text>
      </div>
      <IconButton onPress={onClose} label={t("map.closePanel")}>
        <X />
      </IconButton>
    </div>
  );
}
