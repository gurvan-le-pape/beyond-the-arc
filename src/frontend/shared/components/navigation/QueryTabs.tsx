// src/frontend/shared/components/navigation/QueryTabs.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";

import { usePathname, useRouter } from "@/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/primitives";

type Tab = { value: string; label: string };

interface QueryTabsProps {
  readonly tabs: Tab[];
  readonly children: React.ReactNode;
}

/**
 * Generic tab container that syncs the active tab with the URL ?tab= param.
 *
 * The active tab is derived from `?tab=` against `tabs`; an absent or
 * unrecognised value falls back to the first tab.
 *
 * The Suspense boundary is here rather than at each call site because
 * `useSearchParams` is what needs it: without a boundary above it, the whole
 * route is excluded from prerendering, and once the locale layout calls
 * `setRequestLocale` that becomes a build failure rather than a silent opt-out.
 * Keeping it inside the component means a future page cannot use these tabs and
 * forget.
 */
export function QueryTabs({ tabs, children }: QueryTabsProps) {
  return (
    <Suspense fallback={<QueryTabsFallback tabs={tabs} />}>
      <QueryTabsContent tabs={tabs}>{children}</QueryTabsContent>
    </Suspense>
  );
}

/**
 * Prerendered shell: the tab bar with the default tab selected. The real
 * component swaps in once search params are available, so a visitor landing on
 * `?tab=` sees the bar in place rather than a gap.
 */
function QueryTabsFallback({ tabs }: { readonly tabs: Tab[] }) {
  return (
    <Tabs defaultValue={tabs[0].value}>
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

function QueryTabsContent({ tabs, children }: QueryTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const activeTab = tabs.some((tab) => tab.value === tabParam)
    ? (tabParam as string)
    : tabs[0].value;

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
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
