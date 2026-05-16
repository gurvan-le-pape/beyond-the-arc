// src/frontend/features/organizations/components/OrganizationsStats.tsx
import type { useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";

interface OrganizationsStatsProps {
  readonly t: ReturnType<typeof useTranslations>;
}

const STATS = [
  { labelKey: "leagues.label", value: 112, color: "text-regional-strong" },
  {
    labelKey: "committees.label",
    value: 25,
    color: "text-departmental-strong",
  },
  { labelKey: "clubs.label", value: 3883, color: "text-clubs-strong" },
] as const;

export function OrganizationsStats({ t }: OrganizationsStatsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      {STATS.map((stat, i) => (
        <div key={stat.labelKey} className="flex items-center gap-6">
          <div className="text-center">
            <Text variant="h2" as="p" className={stat.color}>
              {stat.value.toLocaleString()}
            </Text>
            <Text variant="overline">{t(stat.labelKey)}</Text>
          </div>
          {i < STATS.length - 1 && (
            <div className="h-8 w-px bg-divide" aria-hidden />
          )}
        </div>
      ))}
    </div>
  );
}
