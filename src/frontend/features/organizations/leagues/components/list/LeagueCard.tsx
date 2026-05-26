// src/frontend/features/organizations/leagues/components/list/LeagueCard.tsx
import { useRouter } from "@/navigation";
import { Badge, ImageWithFallback } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { cn, formatLeagueName, formatNameToFileName } from "@/shared/utils";

import type { League } from "../../types";

interface LeagueCardProps {
  readonly league: League;
  readonly clubLabel: string;
}

export function LeagueCard({ league, clubLabel }: LeagueCardProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/organizations/leagues/${league.id}`)}
      className={cn(
        "group relative overflow-hidden rounded-card border text-left w-full",
        "surface-raised shadow-card",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:scale-[1.01]",
        "hover:shadow-card-hover",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        "focus:ring-offset-2 focus:ring-offset-surface",
        "border-regional/40 hover:border-regional",
        "flex",
      )}
    >
      {/* Logo panel */}
      <div
        className={cn(
          "flex-shrink-0 w-20 flex items-center justify-center",
          "bg-gradient-to-br from-surface-inset to-surface-own",
          "border-r border-white/5",
        )}
      >
        <ImageWithFallback
          src={`/images/leagues/${formatNameToFileName(league.name)}.webp`}
          alt={league.name}
          fallback="/images/leagues/defaultLogo.30cc7520.svg"
          className="w-12 h-12 object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            "px-4 py-3 border-b border-white/5",
            "bg-regional/10",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-regional" />
            <Text
              variant="label"
              className="font-semibold text-regional truncate"
            >
              {league.region.name}
            </Text>
          </div>
          <Badge variant="info" size="sm">
            {league.region.code}
          </Badge>
        </div>

        {/* Body */}
        <div className="px-4 py-3 flex items-center justify-between gap-3 flex-1">
          <Text
            variant="h3"
            className="leading-snug line-clamp-2 text-base md:text-lg"
          >
            {formatLeagueName(league.name)}
          </Text>
          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-bold text-regional-strong leading-none">
              {league.clubCount}
            </p>
            <Text variant="caption" className="mt-0.5">
              {clubLabel}
            </Text>
          </div>
        </div>
      </div>
    </button>
  );
}
