// src/frontend/app/[locale]/(public)/search/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { TabsContent } from "@/features/matches/components/detail/Tabs";
import { MatchesTab, PlayersTab, TeamsTab } from "@/features/search/components";
import { SearchTabs } from "@/features/search/components/SearchTabs";
import { PageLayout } from "@/shared/components/layout";

const TABS = {
  PLAYERS: "players",
  TEAMS: "teams",
  MATCHES: "matches",
} as const;

type Tab = (typeof TABS)[keyof typeof TABS];

export default function SearchPage() {
  const t = useTranslations("search");
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab: Tab =
    tabParam === TABS.TEAMS || tabParam === TABS.MATCHES
      ? tabParam
      : TABS.PLAYERS;

  const tabs = [
    { value: TABS.PLAYERS, label: t("tabs.players") },
    { value: TABS.TEAMS, label: t("tabs.teams") },
    { value: TABS.MATCHES, label: t("tabs.matches") },
  ];

  return (
    <PageLayout>
      <SearchTabs activeTab={activeTab} tabs={tabs}>
        <TabsContent value={TABS.PLAYERS}>
          <PlayersTab />
        </TabsContent>
        <TabsContent value={TABS.TEAMS}>
          <TeamsTab />
        </TabsContent>
        <TabsContent value={TABS.MATCHES}>
          <MatchesTab />
        </TabsContent>
      </SearchTabs>
    </PageLayout>
  );
}
