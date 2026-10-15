// src/frontend/features/matches/components/detail/MatchBreadcrumb.tsx
import { useTranslations } from "next-intl";

import { Breadcrumb } from "@/shared/components/navigation";

interface MatchBreadcrumbProps {
  readonly championshipId: number;
  readonly poolId: number;
  /** The championship's display name, as `buildChampionshipTitle` assembles it. */
  readonly championshipName: string;
  readonly matchName: string;
}

/**
 * The trail above a match page: the championships list, then the championship
 * opened on the match's pool, then the match itself.
 */
export function MatchBreadcrumb({
  championshipId,
  poolId,
  championshipName,
  matchName,
}: MatchBreadcrumbProps) {
  const tCompetitions = useTranslations("competitions");

  return (
    <Breadcrumb
      items={[
        { label: tCompetitions("breadcrumb"), href: "/championships" },
        {
          label: championshipName,
          href: `/championships/${championshipId}?pool=${poolId}`,
        },
        { label: matchName, current: true },
      ]}
    />
  );
}

export default MatchBreadcrumb;
