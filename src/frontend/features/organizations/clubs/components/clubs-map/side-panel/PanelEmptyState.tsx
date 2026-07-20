// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/PanelEmptyState.tsx
"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";

interface PanelEmptyStateProps {
  /** The active search query, if any — switches the copy between the
   * no-results and no-clubs-in-view states. */
  readonly query: string;
}

/** Empty state shown in the club list when there are no clubs to display. */
export function PanelEmptyState({ query }: PanelEmptyStateProps) {
  const t = useTranslations("clubs");

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <svg
        className="w-12 h-12 text-text-muted mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <Text variant="body" className="font-medium">
        {query ? t("map.noResults") : t("map.noClubsFound")}
      </Text>
      <Text variant="caption" className="mt-1">
        {query ? t("map.tryAnotherSearch") : t("map.zoomToSeeClubs")}
      </Text>
    </div>
  );
}

export default PanelEmptyState;
