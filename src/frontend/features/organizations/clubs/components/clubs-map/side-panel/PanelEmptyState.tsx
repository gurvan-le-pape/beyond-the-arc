// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/PanelEmptyState.tsx
"use client";

import { MapPinOff, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/shared/components/feedback";

interface PanelEmptyStateProps {
  /** The active search query, if any — switches the copy between the
   * no-results and no-clubs-in-view states. */
  readonly query: string;
}

/** Empty state shown in the club list when there are no clubs to display. */
export function PanelEmptyState({ query }: PanelEmptyStateProps) {
  const t = useTranslations("clubs");

  return query ? (
    <EmptyState
      icon={<SearchX className="h-10 w-10" aria-hidden="true" />}
      title={t("map.noResults")}
      description={t("map.tryAnotherSearch")}
    />
  ) : (
    <EmptyState
      icon={<MapPinOff className="h-10 w-10" aria-hidden="true" />}
      title={t("map.noClubsFound")}
      description={t("map.zoomToSeeClubs")}
    />
  );
}

export default PanelEmptyState;
