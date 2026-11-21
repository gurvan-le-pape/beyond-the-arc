// src/frontend/features/organizations/committees/components/list/committees-overview/CommitteeGroup.tsx
import { useFormatter, useTranslations } from "next-intl";

import { CountBar } from "@/features/organizations/components";
import {
  namesMatch,
  normalizeDepartmentCode,
} from "@/features/organizations/utils";
import { Link } from "@/navigation";
import { cn, formatCommitteeName } from "@/shared/utils";

import type { Committee } from "../../../types";

interface CommitteeGroupProps {
  readonly leagueId: number;
  readonly regionName: string;
  /** The group's committees, already filtered and in department order. */
  readonly committees: Committee[];
  /** The largest club count across every group, so bars compare between them. */
  readonly maxClubs: number;
  readonly highlighted: string | null;
  readonly onHighlight: (code: string | null) => void;
}

/**
 * One league's committees: the league as a heading that links to it, then a
 * row per committee with its department number, name and club count.
 *
 * The federation's own capitalised name is shown under the department only
 * where it says something the department name does not ("RHONE ET METROPOLE
 * DE LYON").
 */
export function CommitteeGroup({
  leagueId,
  regionName,
  committees,
  maxClubs,
  highlighted,
  onHighlight,
}: CommitteeGroupProps) {
  const t = useTranslations("organizations");
  const format = useFormatter();
  const clubs = committees.reduce((sum, c) => sum + c.clubCount, 0);

  return (
    <section className="break-inside-avoid mb-6 border border-divide rounded-card overflow-hidden">
      <header className="flex items-baseline justify-between gap-3 px-4 py-2.5 border-b border-divide">
        <h2 className="font-semibold text-text-heading">
          <Link
            href={`/organizations/leagues/${leagueId}`}
            className="hover:text-ink-regional hover:underline"
          >
            {regionName}
          </Link>
        </h2>
        <span className="text-xs text-text-secondary whitespace-nowrap tabular-nums">
          {format.number(clubs)} {t("header.clubs", { count: clubs })}
        </span>
      </header>

      <ul className="divide-y divide-divide">
        {committees.map((committee) => {
          const code = normalizeDepartmentCode(committee.department.code);
          const officialName = formatCommitteeName(committee.name);
          return (
            <li key={committee.id}>
              <Link
                href={`/organizations/committees/${committee.id}`}
                onMouseEnter={() => onHighlight(code)}
                onMouseLeave={() => onHighlight(null)}
                onFocus={() => onHighlight(code)}
                onBlur={() => onHighlight(null)}
                className={cn(
                  "grid grid-cols-[2rem_minmax(0,1fr)_7rem] items-center gap-3 px-4 py-2 text-sm transition-colors focus-ring-inset",
                  highlighted === code && "bg-tint-departmental",
                )}
              >
                <span className="tabular-nums text-text-secondary">{code}</span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-text-heading">
                    {committee.department.name}
                  </span>
                  {namesMatch(
                    officialName,
                    committee.department.name,
                  ) ? null : (
                    <span className="block truncate text-xs text-text-secondary">
                      {officialName}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-2">
                  <CountBar
                    value={committee.clubCount}
                    max={maxClubs}
                    tone="departmental"
                    className="flex-1"
                  />
                  <span className="w-8 text-right tabular-nums text-text-body">
                    {format.number(committee.clubCount)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
