// src/frontend/app/[locale]/(public)/search/page.tsx
"use client";

import { useTranslations } from "next-intl";

import { MatchesTab, PlayersTab, TeamsTab } from "@/features/search/components";
import { PageLayout } from "@/shared/components/layout";
import { QueryTabs } from "@/shared/components/navigation";
import { TabsContent } from "@/shared/components/primitives";

const TABS = {
  PLAYERS: "players",
  TEAMS: "teams",
  MATCHES: "matches",
} as const;

export default function SearchPage() {
  const t = useTranslations("search");

  const tabs = [
    { value: TABS.PLAYERS, label: t("tabs.players") },
    { value: TABS.TEAMS, label: t("tabs.teams") },
    { value: TABS.MATCHES, label: t("tabs.matches") },
  ];

  return (
    <PageLayout>
      <QueryTabs tabs={tabs}>
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
