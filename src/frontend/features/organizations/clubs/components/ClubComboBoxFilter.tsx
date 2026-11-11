// src/frontend/features/organizations/clubs/components/ClubComboBoxFilter.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useClubSearch } from "@/features/organizations/clubs/api";
import { ComboBox } from "@/shared/components/primitives";
import { useDebounce } from "@/shared/hooks";

interface ClubComboBoxFilterProps {
  readonly committeeId: number | undefined;
  readonly leagueId: number | undefined;
  readonly clubId: number | undefined;
  /**
   * The chosen club's name, kept beside its id: the search's results seldom
   * include the chosen club once the search is cleared, so the box cannot
   * read the name from them.
   */
  readonly clubName: string | undefined;
  /** Called with the chosen club's id and name, or with neither when cleared. */
  readonly onChange: (
    clubId: number | undefined,
    clubName: string | undefined,
  ) => void;
}

/**
 * Debounced club search combo box for the filter panels: searches clubs scoped
 * to the selected committee/league and reports the chosen club id + name back.
 * Owns its own search input state.
 *
 * **A failed search is reported in the list, not in place of the field**, so
 * what was typed and the club already chosen both stay. Editing the text runs
 * the search again. There is no separate retry button: reaching one means
 * leaving the field, and leaving it resets the text, which drops the failed
 * search anyway.
 */
export function ClubComboBoxFilter({
  committeeId,
  leagueId,
  clubId,
  clubName,
  onChange,
}: ClubComboBoxFilterProps) {
  const tCommon = useTranslations("common");

  const [clubSearch, setClubSearch] = useState("");
  const debouncedClubSearch = useDebounce(clubSearch, 300);
  const {
    data: clubData,
    isLoading: clubsLoading,
    isError: clubsFailed,
  } = useClubSearch(debouncedClubSearch, { committeeId, leagueId });
  const clubOptions = (clubData?.items ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <ComboBox
      labels={{
        clear: tCommon("clearSelection"),
        loading: tCommon("loading"),
        empty: tCommon("empty"),
      }}
      label={tCommon("filters.clubs")}
      placeholder={tCommon("filters.allClubs")}
      options={clubOptions}
      value={clubId}
      // A link may carry the id without the name; the filter's chip falls
      // back the same way.
      selectedLabel={clubName || String(clubId)}
      onChange={(id) =>
        onChange(id, clubOptions.find((c) => c.value === id)?.label)
      }
      onSearchChange={setClubSearch}
      isLoading={clubsLoading}
      // A failed search also produces an empty option list, so without this
      // the list reports a broken request as "no clubs match".
      error={clubsFailed ? tCommon("errors.fetchClubs") : undefined}
    />
  );
}
