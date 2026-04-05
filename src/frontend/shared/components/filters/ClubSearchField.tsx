// src/frontend/shared/components/filters/ClubSearchField.tsx
"use client";

import React, { useState } from "react";

import { useClubSearch } from "@/features/organizations/clubs/api";
import { SearchableDropdown } from "@/shared/components/primitives";
import { useDebounce } from "@/shared/hooks";

interface ClubSearchFieldProps {
  committeeId: number | undefined;
  leagueId: number | undefined;
  clubId: string;
  setClubId: (value: string) => void;
  setSelectedClubName: (value: string) => void;
  label: string;
  placeholder: string;
}

export const ClubSearchField: React.FC<ClubSearchFieldProps> = ({
  committeeId,
  leagueId,
  clubId,
  setClubId,
  setSelectedClubName,
  label,
  placeholder,
}) => {
  const [clubSearch, setClubSearch] = useState("");
  const debouncedClubSearch = useDebounce(clubSearch, 300);

  const { data, isLoading } = useClubSearch(debouncedClubSearch, {
    committeeId,
    leagueId,
  });

  const options = (data?.items ?? []).map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  return (
    <SearchableDropdown
      label={label}
      options={options}
      value={clubId || undefined}
      onChange={(val) => {
        setClubId(String(val ?? ""));
        setSelectedClubName(
          options.find((c) => c.value === String(val ?? ""))?.label ?? "",
        );
      }}
      onSearchChange={setClubSearch}
      isLoading={isLoading}
      placeholder={placeholder}
    />
  );
};
