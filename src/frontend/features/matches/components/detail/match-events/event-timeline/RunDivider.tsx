// src/frontend/features/matches/components/detail/match-events/event-timeline/RunDivider.tsx
import { useTranslations } from "next-intl";

import { cn } from "@/shared/utils";

interface RunDividerProps {
  /** Points scored in a row. */
  readonly points: number;
  readonly side: "home" | "away";
  readonly teamName: string;
}

/**
 * A band across the timeline where a run ends, in the tone of the side that
 * scored it: "8–0 run · TEAM". A list item, so a screen reader meets it in
 * order with the plays around it.
 */
export function RunDivider({ points, side, teamName }: RunDividerProps) {
  const t = useTranslations("matches.matchEvents");

  return (
    <li
      className={cn(
        "px-3 sm:px-4 py-1.5 text-xs font-semibold border-b border-divide/60",
        side === "home"
          ? "bg-tint-home text-ink-home"
          : "bg-tint-away text-ink-away",
      )}
    >
      {t("run", { points, team: teamName })}
    </li>
  );
}
