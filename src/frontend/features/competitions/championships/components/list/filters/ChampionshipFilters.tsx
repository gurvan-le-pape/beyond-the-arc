// src/frontend/features/competitions/championships/components/list/filters/ChampionshipFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { ErrorMessage } from "@/shared/components/feedback";
import { FiltersShell } from "@/shared/components/filters";
import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import { CATEGORY_LIST, GENDER_LIST } from "@/shared/constants";

/**
 * Optional scope dropdown (league for regional, committee for departmental).
 * Rendered first, ahead of the shared category/gender selects.
 */
export interface ChampionshipScope {
  /** Field label, e.g. "Leagues". */
  label: string;
  /** "All" option label, e.g. "All leagues". */
  allLabel: string;
  /** Currently selected id as a string; "" means none. */
  value: string;
  onChange: (value: string) => void;
  options: { id: number; name: string }[];
}

interface ChampionshipFiltersProps {
  /** Competition level, used for the panel title (common.competition.levels.*). */
  level: "national" | "regional" | "departmental";
  category: Category | undefined;
  gender: Gender | undefined;
  onCategoryChange: (value: Category | undefined) => void;
  onGenderChange: (value: Gender | undefined) => void;
  onReset: () => void;
  /** Present for regional (league) and departmental (committee); omitted for national. */
  scope?: ChampionshipScope;
  /**
   * Copy to show when the scope options failed to load, so an empty dropdown
   * is not mistaken for "this level has no leagues". Already translated by the
   * caller — this component holds no message keys of its own for it.
   */
  scopeError?: string;
  /** Re-runs the scope lookup `scopeError` describes. */
  onScopeRetry?: () => unknown;
}

/**
 * The filter panel shared by all three level tabs.
 *
 * **`scope` is what varies by level**: regional filters by league, departmental
 * by committee, and national omits it because there is nothing above a national
 * championship to scope by. The scoped variants lead with that select and push
 * gender onto its own row.
 *
 * Error copy for a failed scope lookup is passed in already translated, so an
 * empty dropdown is never mistaken for "this level has no leagues".
 */
export const ChampionshipFilters: React.FC<ChampionshipFiltersProps> = ({
  level,
  category,
  gender,
  onCategoryChange,
  onGenderChange,
  onReset,
  scope,
  scopeError,
  onScopeRetry,
}) => {
  const tCommon = useTranslations("common");

  const scopeName = scope?.options.find(
    (o) => String(o.id) === scope.value,
  )?.name;

  const chips = [
    scopeName && {
      key: "scope",
      label: scopeName,
      onRemove: () => scope?.onChange(""),
    },
    category && {
      key: "category",
      label: tCommon(`category.${category}`),
      onRemove: () => onCategoryChange(undefined),
    },
    gender && {
      key: "gender",
      label: tCommon(`gender.${gender}`),
      onRemove: () => onGenderChange(undefined),
    },
  ].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

  const scopeSelect = scope && (
    <Select
      label={scope.label}
      value={scope.value}
      onChange={(val) => scope.onChange(String(val ?? ""))}
      options={[
        { value: "", label: scope.allLabel },
        ...scope.options.map((o) => ({ value: String(o.id), label: o.name })),
      ]}
    />
  );

  const categorySelect = (
    <Select
      label={tCommon("filters.categories")}
      value={category ?? ""}
      onChange={(val) => onCategoryChange((val as Category) || undefined)}
      options={[
        { value: "", label: tCommon("filters.allCategories") },
        ...CATEGORY_LIST.map((cat) => ({
          value: cat,
          label: tCommon(`category.${cat}`),
        })),
      ]}
    />
  );

  const genderSelect = (
    <Select
      label={tCommon("filters.genders")}
      value={gender ?? ""}
      onChange={(val) => onGenderChange((val as Gender) || undefined)}
      options={[
        { value: "", label: tCommon("filters.allGenders") },
        ...GENDER_LIST.map((g) => ({
          value: g,
          label: tCommon(`gender.${g}`),
        })),
      ]}
    />
  );

  return (
    <FiltersShell
      activeFilterCount={chips.length}
      chips={chips}
      onReset={onReset}
      title={tCommon(`competition.levels.${level}`)}
    >
      {scopeError && (
        <ErrorMessage message={scopeError} onRetry={onScopeRetry} />
      )}

      {/* Scoped variants lead with the scope select and push gender to its own row. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scopeSelect ?? categorySelect}
        {scopeSelect ? categorySelect : genderSelect}
      </div>

      {scopeSelect && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {genderSelect}
        </div>
      )}
    </FiltersShell>
  );
};
