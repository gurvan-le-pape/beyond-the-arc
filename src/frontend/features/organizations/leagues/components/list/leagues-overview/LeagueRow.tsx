// src/frontend/features/organizations/leagues/components/list/leagues-overview/LeagueRow.tsx
import { useFormatter, useTranslations } from "next-intl";

import { CountBar } from "@/features/organizations/components";
import { namesMatch } from "@/features/organizations/utils";
import { Link } from "@/navigation";
import { ImageWithFallback } from "@/shared/components/primitives";
import { cn, formatLeagueName, formatNameToFileName } from "@/shared/utils";

import type { League } from "../../../types";

interface LeagueRowProps {
  readonly league: League;
  /** The largest club count in the list, which fills the bar. */
  readonly maxClubs: number;
  readonly active: boolean;
  readonly onActivate: (active: boolean) => void;
}

/**
 * One league in the ranked list: its logo, region, committee count and club
 * count with its bar. `active` mirrors the map, so hovering either one lights
 * up the same league in both.
 */
export function LeagueRow({
  league,
  maxClubs,
  active,
  onActivate,
}: LeagueRowProps) {
  const t = useTranslations("organizations");
  const format = useFormatter();
  const officialName = formatLeagueName(league.name);

  return (
    <li>
      <Link
        href={`/organizations/leagues/${league.id}`}
        onMouseEnter={() => onActivate(true)}
        onMouseLeave={() => onActivate(false)}
        onFocus={() => onActivate(true)}
        onBlur={() => onActivate(false)}
        className={cn(
          "flex items-center gap-4 px-4 py-3 transition-colors focus-ring-inset",
          active && "bg-tint-regional",
        )}
      >
        <ImageWithFallback
          src={`/images/leagues/${formatNameToFileName(league.name)}.webp`}
          alt=""
          fallback="/images/leagues/defaultLogo.30cc7520.svg"
          className="w-9 h-9 flex-shrink-0 object-contain"
        />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-heading truncate">
            {league.region.name}
          </p>
          <p className="text-sm text-text-secondary truncate">
            {namesMatch(officialName, league.region.name)
              ? league.region.code
              : `${league.region.code} · ${officialName}`}
            {" · "}
            {format.number(league.committeeCount)}{" "}
            {t("header.committees", { count: league.committeeCount })}
          </p>
        </div>

        <div className="w-24 sm:w-36 flex-shrink-0">
          <p className="text-right tabular-nums">
            <span className="font-bold text-ink-regional">
              {format.number(league.clubCount)}
            </span>{" "}
            <span className="text-sm text-text-secondary">
              {t("header.clubs", { count: league.clubCount })}
            </span>
          </p>
          <CountBar
            value={league.clubCount}
            max={maxClubs}
            tone="regional"
            className="mt-1.5"
          />
        </div>
      </Link>
    </li>
  );
}
