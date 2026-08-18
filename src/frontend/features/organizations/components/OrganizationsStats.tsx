// src/frontend/features/organizations/components/OrganizationsStats.tsx
import { getLocale, getTranslations } from "next-intl/server";

import type { OrganizationCounts } from "@/features/organizations/types";
import { Text } from "@/shared/components/typography";

const STATS = [
  { key: "leagues", labelKey: "leagues.label", color: "text-regional-strong" },
  {
    key: "committees",
    labelKey: "committees.label",
    color: "text-departmental-strong",
  },
  { key: "clubs", labelKey: "clubs.label", color: "text-clubs-strong" },
] as const;

interface OrganizationsStatsProps {
  readonly counts: OrganizationCounts;
}

/**
 * The counts band on the organisations landing page.
 *
 * An **async server component**. Shares one fetch with the card grid rather
 * than querying again — the two showed the same three numbers from separate
 * sources once, and all six were wrong.
 */
export async function OrganizationsStats({ counts }: OrganizationsStatsProps) {
  const t = await getTranslations("organizations");
  const locale = await getLocale();

  return (
    <div className="flex items-center justify-center gap-6">
      {STATS.map((stat, i) => (
        <div key={stat.labelKey} className="flex items-center gap-6">
          <div className="text-center">
            <Text variant="h2" as="p" className={stat.color}>
              {counts[stat.key].toLocaleString(locale)}
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
