// src/frontend/features/competitions/championships/components/list/championships-overview/OrganiserPicker.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { SearchField } from "@/shared/components/forms";
import { normalizeString } from "@/shared/utils";

import { LEVEL_CONFIG } from "./levelConfig";
import { OrganiserList } from "./OrganiserList";
import type { Organiser, OrganiserLevel } from "./useOrganisers";

// A department's number exactly, or part of its name, accents and case aside.
function matches(organiser: Organiser, folded: string): boolean {
  return (
    organiser.code?.toLowerCase() === folded.replace(/^0+/, "") ||
    normalizeString(organiser.name).includes(folded)
  );
}

interface OrganiserPickerProps {
  readonly level: OrganiserLevel;
  readonly organisers: readonly Organiser[];
  readonly highlighted: string | null;
  readonly onHighlight: (code: string | null) => void;
  readonly hrefFor: (id: number) => string;
  readonly onSelect: (id: number) => void;
}

/**
 * The list half of the picker: a prompt, then the leagues or committees. The
 * 96 committees get a search by department name or number, the way the
 * committees page narrows them; thirteen leagues need none.
 */
export function OrganiserPicker({
  level,
  organisers,
  highlighted,
  onHighlight,
  hrefFor,
  onSelect,
}: OrganiserPickerProps) {
  const t = useTranslations("competitions");
  const tCommon = useTranslations("common");
  const [query, setQuery] = useState("");
  const searchable = level === "departmental";
  const folded = normalizeString(query.trim());
  const visible = folded
    ? organisers.filter((o) => matches(o, folded))
    : organisers;

  return (
    <div className="space-y-4">
      <p className="text-text-secondary">{t(LEVEL_CONFIG[level].pick)}</p>
      {searchable && (
        <SearchField
          label={t("searchLabel")}
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(value) => {
            // A row the search removes never fires its mouse-leave.
            onHighlight(null);
            setQuery(value);
          }}
          onClear={() => setQuery("")}
          labels={{ clear: tCommon("clearSearch") }}
        />
      )}
      {visible.length > 0 || organisers.length === 0 ? (
        <OrganiserList
          organisers={visible}
          tone={level}
          highlighted={highlighted}
          onHighlight={onHighlight}
          hrefFor={hrefFor}
          onSelect={onSelect}
        />
      ) : (
        <p className="py-12 text-center text-text-secondary">
          {t("noMatch", { query: query.trim() })}
        </p>
      )}
    </div>
  );
}
