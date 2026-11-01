// src/frontend/shared/components/navigation/QueryTabs.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Tab, TabList, Tabs } from "@/shared/components/primitives";

interface QueryTab {
  value: string;
  label: string;
}

/**
 * Writes `?tab=`, dropping every other parameter: those are the previous tab's
 * filters, and tabs reuse names with other meanings (`number` is a jersey on
 * the players tab and a team number on the teams tab).
 *
 * Through the History API rather than the router: Next keeps
 * `useSearchParams` in sync with it, and a router navigation would fetch the
 * page from the server for a change only the client reads.
 */
function selectTab(value: string) {
  globalThis.history.replaceState(
    null,
    "",
    `?${new URLSearchParams({ tab: value })}`,
  );
}

interface QueryTabsViewProps {
  readonly tabs: QueryTab[];
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly children?: React.ReactNode;
}

function QueryTabsView({
  tabs,
  value,
  onValueChange,
  children,
}: QueryTabsViewProps) {
  return (
    <Tabs selectedKey={value} onSelectionChange={onValueChange}>
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.value} id={tab.value}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {children}
    </Tabs>
  );
}

interface QueryTabsContentProps {
  readonly tabs: QueryTab[];
  readonly defaultTab: string;
  readonly children: React.ReactNode;
}

function QueryTabsContent({
  tabs,
  defaultTab,
  children,
}: QueryTabsContentProps) {
  const tabParam = useSearchParams().get("tab");
  const activeTab =
    tabs.find((tab) => tab.value === tabParam)?.value ?? defaultTab;

  return (
    <QueryTabsView tabs={tabs} value={activeTab} onValueChange={selectTab}>
      {children}
    </QueryTabsView>
  );
}

interface QueryTabsProps {
  readonly tabs: QueryTab[];
  /** The tab shown when `?tab=` is absent or unrecognised. Defaults to the first tab. */
  readonly defaultTab?: string;
  readonly children: React.ReactNode;
}

/**
 * Generic tab container that syncs the active tab with the URL ?tab= param.
 *
 * The active tab is derived from `?tab=` against `tabs`; an absent or
 * unrecognised value falls back to `defaultTab`, or to the first tab.
 *
 * The Suspense boundary is here rather than at each call site because
 * `useSearchParams` is what needs it: without a boundary above it, the whole
 * route is excluded from prerendering, and once the locale layout calls
 * `setRequestLocale` that becomes a build failure rather than a silent opt-out.
 * Keeping it inside the component means a future page cannot use these tabs and
 * forget. Its fallback is the prerendered tab bar on the default tab, so a
 * visitor landing on `?tab=` sees the bar in place rather than a gap.
 */
export function QueryTabs({ tabs, defaultTab, children }: QueryTabsProps) {
  const fallbackTab = defaultTab ?? tabs[0].value;

  return (
    <Suspense
      fallback={
        <QueryTabsView
          tabs={tabs}
          value={fallbackTab}
          onValueChange={selectTab}
        />
      }
    >
      <QueryTabsContent tabs={tabs} defaultTab={fallbackTab}>
        {children}
      </QueryTabsContent>
    </Suspense>
  );
}
