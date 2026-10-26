// src/frontend/features/competitions/championships/components/detail/ChampionshipSections.tsx
"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { SegmentedControl } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

type Section = "standings" | "matches";

interface ChampionshipSectionsProps {
  /** The breadcrumb and header, across the full width above both sections. */
  readonly header: ReactNode;
  readonly standings: ReactNode;
  readonly matches: ReactNode;
}

/**
 * The championship page's body: the header across the full width, then its
 * standings and its matches side by side from `xl`. Both sections open on a
 * title of the same height, so their frames start on one line.
 *
 * Below `xl` the two would stack, and the matches start after the whole
 * standings table. There a switch shows one at a time, standings first. The
 * hidden section stays mounted, so the selected round and expanded matches
 * survive a switch.
 */
export function ChampionshipSections({
  header,
  standings,
  matches,
}: ChampionshipSectionsProps) {
  const t = useTranslations("competitions.detailSections");
  const [section, setSection] = useState<Section>("standings");

  return (
    <div className="space-y-6">
      {header}

      <div className="xl:hidden">
        <SegmentedControl
          label={t("label")}
          options={[
            { value: "standings", label: t("standings") },
            { value: "matches", label: t("matches") },
          ]}
          value={section}
          onChange={setSection}
        />
      </div>

      <div className="flex flex-col xl:flex-row xl:items-start gap-6">
        <div
          className={cn(
            "w-full xl:flex-1 min-w-0",
            section !== "standings" && "hidden xl:block",
          )}
        >
          {standings}
        </div>

        <div
          className={cn(
            "w-full xl:w-[480px] xl:flex-shrink-0",
            section !== "matches" && "hidden xl:block",
          )}
        >
          {matches}
        </div>
      </div>
    </div>
  );
}

export default ChampionshipSections;
