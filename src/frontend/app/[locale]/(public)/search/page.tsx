// src/frontend/app/[locale]/(public)/search/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { MatchesTab, PlayersTab, TeamsTab } from "@/features/search/components";
import { PageLayout } from "@/shared/components/layout";
import { QueryTabs } from "@/shared/components/navigation/QueryTabs";
import { TabsContent } from "@/shared/components/primitives/Tabs";

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
      <QueryTabs activeTab={activeTab} tabs={tabs}>
        <TabsContent value={TABS.PLAYERS}>
          <PlayersTab />
        </TabsContent>
        <TabsContent value={TABS.TEAMS}>
          <TeamsTab />
        </TabsContent>
        <TabsContent value={TABS.MATCHES}>
          <MatchesTab />
        </TabsContent>
      </QueryTabs>
    </PageLayout>
  );
}
