// src/frontend/app/[locale]/(chrome)/(public)/championships/page.tsx
"use client";

import { useTranslations } from "next-intl";

import {
  DepartmentalTab,
  NationalTab,
  RegionalTab,
} from "@/features/competitions/championships/components";
import { PageLayout } from "@/shared/components/layout";
import { QueryTabs } from "@/shared/components/navigation";
import { TabsContent } from "@/shared/components/primitives";
import { CompetitionLevel } from "@/shared/constants";

const TABS = {
  NATIONAL: CompetitionLevel.NATIONAL,
  REGIONAL: CompetitionLevel.REGIONAL,
  DEPARTMENTAL: CompetitionLevel.DEPARTMENTAL,
} as const;

export default function ChampionshipsPage() {
  const tCommon = useTranslations("common");

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
      <QueryTabs tabs={tabs}>
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
