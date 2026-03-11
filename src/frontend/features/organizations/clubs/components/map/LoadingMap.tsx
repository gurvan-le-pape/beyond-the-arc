// src/frontend/features/organizations/clubs/components/map/LoadingMap.tsx
"use client";

import { useTranslations } from "next-intl";

import { LoadingSpinner } from "@/shared/components/ui/feedback/LoadingSpinner";

export function LoadingMap() {
  const t = useTranslations("clubs");
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-gray-700">
          {t("map.loadingMapClient")}
        </p>
      </div>
    </div>
  );
}
