// src/frontend/features/competitions/championships/components/ChampionshipLevelTabs.tsx
"use client";

import { useTranslations } from "next-intl";

import { QueryTabs } from "@/shared/components/navigation";
import { TabsContent } from "@/shared/components/primitives";
import { CompetitionLevel } from "@/shared/constants";

import { DepartmentalChampionships } from "./list/levels/DepartmentalChampionships";
import { NationalChampionships } from "./list/levels/NationalChampionships";
import { RegionalChampionships } from "./list/levels/RegionalChampionships";

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
    // Opens on regional: the import holds no national championships, so the
    // national tab is empty and stays only to show where that level sits.
    <QueryTabs tabs={tabs} defaultTab={TABS.REGIONAL}>
      <TabsContent value={TABS.NATIONAL}>
        <NationalChampionships />
      </TabsContent>
      <TabsContent value={TABS.REGIONAL}>
        <RegionalChampionships />
      </TabsContent>
      <TabsContent value={TABS.DEPARTMENTAL}>
        <DepartmentalChampionships />
      </TabsContent>
    </QueryTabs>
  );
}
