// src/frontend/features/competitions/championships/components/list/championships-overview/OrganiserMap.tsx
"use client";

import { useTranslations } from "next-intl";

import type { ChoroplethDatum } from "@/features/geography/components";
import { ChoroplethMap } from "@/features/geography/components";
import { FRANCE_FRAME } from "@/features/geography/constants";

import { LEVEL_CONFIG } from "./levelConfig";
import type { Organiser, OrganiserLevel } from "./useOrganisers";

interface OrganiserMapProps {
  readonly level: OrganiserLevel;
  readonly organisers: readonly Organiser[];
  readonly selected: Organiser | undefined;
  readonly hovered: string | null;
  readonly onHover: (code: string | null) => void;
  readonly hrefFor: (id: number) => string;
  /** Called with the organiser clicked, or undefined to clear the choice. */
  readonly onSelect: (id: number | undefined) => void;
}

/**
 * The regions or departments as a picker: a click opens that organiser's
 * championships and a second click closes them. It shades nothing but the
 * choice, since the lists carry no count worth mapping.
 */
export function OrganiserMap({
  level,
  organisers,
  selected,
  hovered,
  onHover,
  hrefFor,
  onSelect,
}: OrganiserMapProps) {
  const t = useTranslations("competitions");
  const config = LEVEL_CONFIG[level];

  const data: Record<string, ChoroplethDatum> = Object.fromEntries(
    organisers.flatMap((o) =>
      o.code
        ? [
            [
              o.code,
              {
                value: o === selected ? 1 : 0,
                href: hrefFor(o.id),
                label: o.name,
              },
            ],
          ]
        : [],
    ),
  );

  return (
    <div className="space-y-2">
      <ChoroplethMap
        shapes={config.shapes}
        frame={FRANCE_FRAME}
        data={data}
        tone={level}
        highlighted={hovered ?? selected?.code ?? null}
        onHighlight={onHover}
        onSelect={(code) => {
          const organiser = organisers.find((o) => o.code === code);
          if (organiser) {
            onSelect(organiser === selected ? undefined : organiser.id);
          }
        }}
      />
      <p className="text-center text-sm text-text-secondary">
        {t(config.mapCaption)}
      </p>
    </div>
  );
}
