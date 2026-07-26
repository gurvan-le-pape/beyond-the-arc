// src/frontend/features/competitions/championships/components/ChampionshipLevelTabs.tsx
"use client";

import { useTranslations } from "next-intl";

import { QueryTabs } from "@/shared/components/navigation";
import { TabsContent } from "@/shared/components/primitives";
import { CompetitionLevel } from "@/shared/constants";

import { DepartmentalTab } from "./list/tabs/DepartmentalTab";
import { NationalTab } from "./list/tabs/NationalTab";
import { RegionalTab } from "./list/tabs/RegionalTab";

const TABS = {
  NATIONAL: CompetitionLevel.NATIONAL,
  REGIONAL: CompetitionLevel.REGIONAL,
  DEPARTMENTAL: CompetitionLevel.DEPARTMENTAL,
} as const;

/**
 * The championships page's one tab per competition level. Client-side because
 * the tab state lives in the URL and each tab fetches through TanStack Query —
 * the page itself stays a server component so it can export `generateMetadata`.
 */
export function ChampionshipLevelTabs() {
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
  );
}

export default ChampionshipLevelTabs;
