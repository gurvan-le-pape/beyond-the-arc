// src/frontend/features/organizations/clubs/components/clubs-view/ClubsFilters.tsx
"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface League {
  id: string | number;
  name: string;
}
interface Committee {
  id: string | number;
  name: string;
}

interface ClubsFiltersProps {
  readonly search: string;
  readonly leagueId: string;
  readonly committeeId: string;
  readonly leagues: League[];
  readonly committees: Committee[];
  readonly hasActiveFilters: boolean;
  readonly onSearchChange: (v: string) => void;
  readonly onLeagueChange: (v: string) => void;
  readonly onCommitteeChange: (v: string) => void;
  readonly onReset: () => void;
}

const inputClass =
  "text-sm rounded-input border border-divide bg-surface-inset text-text-body placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary ring-offset-surface";

export function ClubsFilters({
  search,
  leagueId,
  committeeId,
  leagues,
  committees,
  hasActiveFilters,
  onSearchChange,
  onLeagueChange,
  onCommitteeChange,
  onReset,
}: ClubsFiltersProps) {
  const tCommon = useTranslations("common");
  const tOrganizations = useTranslations("organizations");

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={tOrganizations("clubs.searchPlaceholder")}
          className={`${inputClass} pl-9 pr-4 py-2 w-64`}
        />
      </div>

      <select
        value={leagueId}
        onChange={(e) => onLeagueChange(e.target.value)}
        className={`${inputClass} px-3 py-2`}
      >
        <option value="">{tCommon("filters.allLeagues")}</option>
        {leagues.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      {leagueId && (
        <select
          value={committeeId}
          onChange={(e) => onCommitteeChange(e.target.value)}
          className={`${inputClass} px-3 py-2`}
        >
          <option value="">{tCommon("filters.allCommittees")}</option>
          {committees.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-heading transition-colors"
        >
          <X className="text-xs" />
          {tCommon("clearSearch")}
        </button>
      )}
    </div>
  );
}
