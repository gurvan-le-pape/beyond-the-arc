// src/frontend/shared/components/navigation/QueryTabs.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";

import { usePathname, useRouter } from "@/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/primitives";

interface Tab {
  value: string;
  label: string;
}

interface QueryTabsFallbackProps {
  readonly tabs: Tab[];
  readonly defaultTab: string;
}

/**
 * Prerendered shell: the tab bar with the default tab selected. The real
 * component swaps in once search params are available, so a visitor landing on
 * `?tab=` sees the bar in place rather than a gap.
 */
function QueryTabsFallback({ tabs, defaultTab }: QueryTabsFallbackProps) {
  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

interface QueryTabsContentProps {
  readonly tabs: Tab[];
  readonly defaultTab: string;
  readonly children: React.ReactNode;
}

function QueryTabsContent({
  tabs,
  defaultTab,
  children,
}: QueryTabsContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const activeTab = tabs.some((tab) => tab.value === tabParam)
    ? (tabParam as string)
    : defaultTab;

  // A tab change keeps only `tab`: the other parameters are the previous
  // tab's filters, and tabs reuse names with other meanings (`number` is a
  // jersey on the players tab and a team number on the teams tab).
  const handleTabChange = useCallback(
    (value: string) => {
      router.replace(`${pathname}?${new URLSearchParams({ tab: value })}`);
    },
    [pathname, router],
  );

  return (
    <Tabs
      key={activeTab}
      defaultValue={activeTab}
      onValueChange={handleTabChange}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

interface QueryTabsProps {
  readonly tabs: Tab[];
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
 * forget.
 */
export function QueryTabs({ tabs, defaultTab, children }: QueryTabsProps) {
  const fallbackTab = defaultTab ?? tabs[0].value;

  return (
    <Suspense
      fallback={<QueryTabsFallback tabs={tabs} defaultTab={fallbackTab} />}
    >
      <QueryTabsContent tabs={tabs} defaultTab={fallbackTab}>
        {children}
      </QueryTabsContent>
    </Suspense>
  );
}
