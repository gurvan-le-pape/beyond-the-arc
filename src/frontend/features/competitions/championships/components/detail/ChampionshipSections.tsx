// src/frontend/features/competitions/championships/components/detail/ChampionshipSections.tsx
"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { SegmentedControl } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

type Section = "standings" | "matches";

interface ChampionshipSectionsProps {
  /** The breadcrumb and header, above the standings at every width. */
  readonly header: ReactNode;
  readonly standings: ReactNode;
  readonly matches: ReactNode;
  /** The pool picker, beside the switch below `xl`. */
  readonly poolSelect: ReactNode;
}

/**
 * The championship page's body: its standings and its matches, side by side
 * from `xl`.
 *
 * Below `xl` the two would stack, and the matches start after the whole
 * standings table. There a switch shows one at a time, standings first, with
 * the pool picker beside it, since the pool scopes both. The hidden section
 * stays mounted, so the selected round and expanded matches survive a switch.
 */
export function ChampionshipSections({
  header,
  standings,
  matches,
  poolSelect,
}: ChampionshipSectionsProps) {
  const t = useTranslations("competitions.detailSections");
  const [section, setSection] = useState<Section>("standings");

  return (
    <div className="flex flex-col xl:flex-row xl:items-start gap-6">
      <div className="w-full xl:flex-1 min-w-0 space-y-6">
        {header}

        <div className="flex flex-wrap items-center justify-between gap-3 xl:hidden">
          <SegmentedControl
            label={t("label")}
            options={[
              { value: "standings", label: t("standings") },
              { value: "matches", label: t("matches") },
            ]}
            value={section}
            onChange={setSection}
          />
          <div className="min-w-36 flex-1 sm:w-[200px] sm:flex-none">
            {poolSelect}
          </div>
        </div>

        <div className={cn(section !== "standings" && "hidden xl:block")}>
          {standings}
        </div>
      </div>

      <div
        className={cn(
          "w-full xl:w-[480px] xl:flex-shrink-0",
          section !== "matches" && "hidden xl:block",
        )}
      >
        {/* The panel's own headings are h3s, under this one as the standings'
            table is under its visible h2. */}
        <h2 className="sr-only">{t("matches")}</h2>
        {matches}
      </div>
    </div>
  );
}

export default ChampionshipSections;
