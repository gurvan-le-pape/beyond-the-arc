// src/frontend/features/organizations/clubs/components/map/LoadingMap.tsx
"use client";

import { useTranslations } from "next-intl";

import { LoadingSpinner } from "@/shared/components/feedback";
import { Text } from "@/shared/components/typography";

export function LoadingMap() {
  const t = useTranslations("clubs");
  return (
    <div className="absolute inset-0 flex items-center justify-center surface-base">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <Text variant="label">{t("map.loadingMapClient")}</Text>
      </div>
    </div>
  );
}
