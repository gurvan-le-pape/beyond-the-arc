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
  readonly setClubId: (value: number | undefined) => void;
  readonly setSelectedClubName: (value: string) => void;
}

/**
 * Debounced club search combo box for the filter panels: searches clubs scoped
 * to the selected committee/league and reports the chosen club id + name back.
 * Owns its own search input state.
 */
export function ClubComboBoxFilter({
  committeeId,
  leagueId,
  clubId,
  setClubId,
  setSelectedClubName,
}: ClubComboBoxFilterProps) {
  const tCommon = useTranslations("common");

  const [clubSearch, setClubSearch] = useState("");
  const debouncedClubSearch = useDebounce(clubSearch, 300);
  const { data: clubData, isLoading: clubsLoading } = useClubSearch(
    debouncedClubSearch,
    { committeeId, leagueId },
  );
  const clubOptions = (clubData?.items ?? []).map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  return (
    <ComboBox
      label={tCommon("filters.clubs")}
      placeholder={tCommon("filters.allClubs")}
      options={clubOptions}
      value={clubId ? String(clubId) : undefined}
      onChange={(val) => {
        const parsed = Number(val) || undefined;
        setClubId(parsed);
        setSelectedClubName(
          clubOptions.find((c) => c.value === String(val ?? ""))?.label ?? "",
        );
      }}
      onSearchChange={setClubSearch}
      isLoading={clubsLoading}
    />
  );
}

export default ClubComboBoxFilter;
