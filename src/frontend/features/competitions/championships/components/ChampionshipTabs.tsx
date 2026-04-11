// src/frontend/features/competitions/championships/components/ChampionshipTabs.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/features/matches/components/detail/Tabs";
import { usePathname, useRouter } from "@/navigation";

interface ChampionshipTabsProps {
  readonly activeTab: string;
  readonly tabs: { value: string; label: string }[];
  readonly children: React.ReactNode;
}

export function ChampionshipTabs({
  activeTab,
  tabs,
  children,
}: ChampionshipTabsProps) {
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
