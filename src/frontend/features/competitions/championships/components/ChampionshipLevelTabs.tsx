// src/frontend/features/competitions/championships/components/ChampionshipLevelTabs.tsx
"use client";

import { useTranslations } from "next-intl";

import { QueryTabs } from "@/shared/components/navigation";
import { TabPanel } from "@/shared/components/primitives";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipsOverview } from "./list/championships-overview";
import { NationalChampionships } from "./list/NationalChampionships";

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
      <TabPanel id={TABS.NATIONAL}>
        <NationalChampionships />
      </TabPanel>
      <TabPanel id={TABS.REGIONAL}>
        <ChampionshipsOverview level={TABS.REGIONAL} />
      </TabPanel>
      <TabPanel id={TABS.DEPARTMENTAL}>
        <ChampionshipsOverview level={TABS.DEPARTMENTAL} />
      </TabPanel>
    </QueryTabs>
  );
}
