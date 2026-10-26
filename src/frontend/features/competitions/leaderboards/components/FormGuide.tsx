// src/frontend/features/competitions/leaderboards/components/FormGuide.tsx
import { useTranslations } from "next-intl";

import type { Leaderboard } from "@/features/competitions/leaderboards/types";
import { cn } from "@/shared/utils";

interface FormGuideProps {
  /** Oldest first, as the API sends it. */
  readonly games: Leaderboard["form"];
}

/**
 * A team's last results as a row of letter tiles, oldest first: a win filled,
 * a loss outlined, so the two differ in more than colour. A screen reader
 * hears the full word for each instead of the letter.
 */
export function FormGuide({ games }: FormGuideProps) {
  const t = useTranslations("competitions.form");

  if (games.length === 0) {
    return (
      <>
        <span aria-hidden>–</span>
        <span className="sr-only">{t("none")}</span>
      </>
    );
  }

  return (
    <ol className="inline-flex gap-1">
      {games.map(({ matchId, result }) => {
        const isWin = result === "W";
        return (
          <li
            key={matchId}
            className={cn(
              "inline-flex size-5 items-center justify-center rounded-sm text-xs font-bold",
              isWin
                ? "bg-solid-primary text-on-solid-primary"
                : "border border-divide text-text-body",
            )}
          >
            <span aria-hidden>{t(isWin ? "winAbbr" : "lossAbbr")}</span>
            <span className="sr-only">{t(isWin ? "win" : "loss")}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default FormGuide;
