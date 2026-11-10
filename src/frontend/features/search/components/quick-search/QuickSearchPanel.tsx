// src/frontend/features/search/components/quick-search/QuickSearchPanel.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Autocomplete } from "react-aria-components";

import { SearchField } from "@/shared/components/forms";

import { QuickSearchResults } from "./QuickSearchResults";
import { useQuickSearch } from "./useQuickSearch";

interface QuickSearchPanelProps {
  /** Called with the path of the row the reader picked. */
  readonly onNavigate: (href: string) => void;
}

/**
 * The quick search's field and results: clubs, teams and players matching
 * the typed name, then a last row opening Explore with the same term.
 *
 * React Aria's Autocomplete ties the field to the list: focus stays in the
 * field while the arrow keys move through the rows and Enter picks one, and a
 * screen reader hears the active row. The rows come filtered from the server,
 * so the Autocomplete is given no `filter` of its own.
 */
export function QuickSearchPanel({ onNavigate }: QuickSearchPanelProps) {
  const t = useTranslations("search.quick");
  const tCommon = useTranslations("common");
  const [term, setTerm] = useState("");
  const { query, enabled, clubs, teams, players, isLoading, isError } =
    useQuickSearch(term);

  const hasRows = clubs.length + teams.length + players.length > 0;
  const status = (() => {
    if (!enabled) return t("prompt");
    if (isError) return t("error");
    if (isLoading && !hasRows) return t("searching");
    return t("empty", { query });
  })();

  return (
    <Autocomplete inputValue={term} onInputChange={setTerm}>
      <div className="border-b border-divide p-3">
        <SearchField
          aria-label={t("title")}
          // The dialog opens to type into this field: focus belongs in it.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder={t("placeholder")}
          labels={{ clear: tCommon("clearSearch") }}
        />
      </div>
      <QuickSearchResults
        query={query}
        clubs={clubs}
        teams={teams}
        players={players}
        emptyMessage={status}
        onNavigate={onNavigate}
      />
    </Autocomplete>
  );
}
