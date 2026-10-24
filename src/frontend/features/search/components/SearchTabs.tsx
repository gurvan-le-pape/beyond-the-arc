// src/frontend/features/search/components/SearchTabs.tsx
"use client";

import { useTranslations } from "next-intl";

import { QueryTabs } from "@/shared/components/navigation";
import { TabsContent } from "@/shared/components/primitives";

import { MatchSearchResults } from "./MatchSearchResults";
import { PlayerSearchResults } from "./PlayerSearchResults";
import { TeamSearchResults } from "./TeamSearchResults";

const TABS = {
  PLAYERS: "players",
  TEAMS: "teams",
  MATCHES: "matches",
} as const;

/**
 * The search page's three result tabs. Client-side because the tab state lives
 * in the URL and each tab fetches through TanStack Query — the page itself
 * stays a server component so it can export `generateMetadata`.
 */
export function SearchTabs() {
  const t = useTranslations("search");

  const tabs = [
    { value: TABS.PLAYERS, label: t("tabs.players") },
    { value: TABS.TEAMS, label: t("tabs.teams") },
    { value: TABS.MATCHES, label: t("tabs.matches") },
  ];

  return (
    <QueryTabs tabs={tabs}>
      <TabsContent value={TABS.PLAYERS}>
        <PlayerSearchResults />
      </TabsContent>
      <TabsContent value={TABS.TEAMS}>
        <TeamSearchResults />
      </TabsContent>
      <TabsContent value={TABS.MATCHES}>
        <MatchSearchResults />
      </TabsContent>
    </QueryTabs>
  );
}

export default SearchTabs;
