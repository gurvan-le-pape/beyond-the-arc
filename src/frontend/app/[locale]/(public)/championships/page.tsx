// src/frontend/app/[locale]/(public)/championships/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { DepartmentalTab } from "@/features/competitions/championships/components/list/tabs/DepartmentalTab";
import { NationalTab } from "@/features/competitions/championships/components/list/tabs/NationalTab";
import { RegionalTab } from "@/features/competitions/championships/components/list/tabs/RegionalTab";
import { PageLayout } from "@/shared/components/layout";
import { QueryTabs } from "@/shared/components/navigation/QueryTabs";
import { TabsContent } from "@/shared/components/primitives/Tabs";
import { CompetitionLevel } from "@/shared/constants";

const TABS = {
  NATIONAL: CompetitionLevel.NATIONAL,
  REGIONAL: CompetitionLevel.REGIONAL,
  DEPARTMENTAL: CompetitionLevel.DEPARTMENTAL,
} as const;

type Tab = (typeof TABS)[keyof typeof TABS];

const VALID_TABS = new Set<string>(Object.values(TABS));

export default function ChampionshipsPage() {
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") ?? "";
  const activeTab: Tab = VALID_TABS.has(tabParam)
    ? (tabParam as Tab)
    : TABS.NATIONAL;

  const tabs = [
    { value: TABS.NATIONAL, label: tCommon("competition.levels.national") },
    { value: TABS.REGIONAL, label: tCommon("competition.levels.regional") },
    {
      value: TABS.DEPARTMENTAL,
      label: tCommon("competition.levels.departmental"),
    },
  ];

  return (
    <PageLayout>
      <QueryTabs activeTab={activeTab} tabs={tabs}>
        <TabsContent value={TABS.NATIONAL}>
          <NationalTab />
        </TabsContent>
        <TabsContent value={TABS.REGIONAL}>
          <RegionalTab />
        </TabsContent>
        <TabsContent value={TABS.DEPARTMENTAL}>
          <DepartmentalTab />
        </TabsContent>
      </QueryTabs>
    </PageLayout>
  );
}
