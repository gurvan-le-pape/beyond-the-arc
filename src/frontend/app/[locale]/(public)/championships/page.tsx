// src/frontend/app/[locale]/(public)/championships/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ChampionshipTabs } from "@/features/competitions/championships/components/list/tabs/ChampionshipTabs";
import { DepartmentalTab } from "@/features/competitions/championships/components/list/tabs/DepartmentalTab";
import { NationalTab } from "@/features/competitions/championships/components/list/tabs/NationalTab";
import { RegionalTab } from "@/features/competitions/championships/components/list/tabs/RegionalTab";
import { TabsContent } from "@/features/matches/components/detail/Tabs";
import { PageLayout } from "@/shared/components/layout";
import { CompetitionLevel } from "@/shared/constants";

const TABS = {
  NATIONAL: CompetitionLevel.NATIONAL,
  REGIONAL: CompetitionLevel.REGIONAL,
  DEPARTMENTAL: CompetitionLevel.DEPARTMENTAL,
} as const;

type Tab = (typeof TABS)[keyof typeof TABS];

const VALID_TABS = new Set<string>(Object.values(TABS));

export default function ChampionshipsPage() {
  const tCompetitions = useTranslations("competitions");
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") ?? "";
  const activeTab: Tab = VALID_TABS.has(tabParam)
    ? (tabParam as Tab)
    : TABS.NATIONAL;

  const tabs = [
    { value: TABS.NATIONAL, label: tCompetitions("national.label") },
    { value: TABS.REGIONAL, label: tCompetitions("regional.label") },
    { value: TABS.DEPARTMENTAL, label: tCompetitions("departmental.label") },
  ];

  return (
    <PageLayout>
      <ChampionshipTabs activeTab={activeTab} tabs={tabs}>
        <TabsContent value={TABS.NATIONAL}>
          <NationalTab />
        </TabsContent>
        <TabsContent value={TABS.REGIONAL}>
          <RegionalTab />
        </TabsContent>
        <TabsContent value={TABS.DEPARTMENTAL}>
          <DepartmentalTab />
        </TabsContent>
      </ChampionshipTabs>
    </PageLayout>
  );
}
