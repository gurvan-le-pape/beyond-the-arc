// src/frontend/features/search/components/SearchTabs.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/features/matches/components/detail/Tabs";
import { usePathname, useRouter } from "@/navigation";

interface SearchTabsProps {
  readonly activeTab: string;
  readonly tabs: { value: string; label: string }[];
  readonly children: React.ReactNode;
}

/**
 * Wraps the existing Tabs component to sync active tab with the URL ?tab= param.
 * Uses Tabs' defaultValue + onValueChange pattern to stay compatible with context.
 */
export function SearchTabs({ activeTab, tabs, children }: SearchTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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
