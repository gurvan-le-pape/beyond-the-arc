// src/frontend/shared/components/navigation/QueryTabs.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { usePathname, useRouter } from "@/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/primitives";

interface QueryTabsProps {
  readonly tabs: { value: string; label: string }[];
  readonly children: React.ReactNode;
}

/**
 * Generic tab container that syncs the active tab with the URL ?tab= param.
 *
 * The active tab is derived from `?tab=` against `tabs`; an absent or
 * unrecognised value falls back to the first tab.
 */
export function QueryTabs({ tabs, children }: QueryTabsProps) {
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
