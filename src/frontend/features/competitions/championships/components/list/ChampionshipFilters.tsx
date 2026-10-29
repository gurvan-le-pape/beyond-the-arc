// src/frontend/features/competitions/championships/components/list/ChampionshipFilters.tsx
import { useTranslations } from "next-intl";

import { ErrorMessage } from "@/shared/components/feedback";
import {
  FiltersShell,
  useCategoryGenderOptions,
} from "@/shared/components/filters";
import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import { cn } from "@/shared/utils";

/**
 * Optional scope dropdown (league for regional, committee for departmental).
 * Rendered first, ahead of the shared category/gender selects.
 */
export interface ChampionshipScope {
  /** Field label, e.g. "Leagues". */
  label: string;
  /** "All" option label, e.g. "All leagues". */
  allLabel: string;
  /** The selected id; `undefined` means all. */
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  options: { id: number; name: string }[];
}

interface ChampionshipFiltersProps {
  /** Competition level, used for the panel title (common.competition.levels.*). */
  readonly level: "national" | "regional" | "departmental";
  readonly category: Category | undefined;
  readonly gender: Gender | undefined;
  readonly onCategoryChange: (value: Category | undefined) => void;
  readonly onGenderChange: (value: Gender | undefined) => void;
  readonly onReset: () => void;
  /** Present for regional (league) and departmental (committee); omitted for national. */
  readonly scope?: ChampionshipScope;
  /**
   * Copy to show when the scope options failed to load, so an empty dropdown
   * is not mistaken for "this level has no leagues". Already translated by the
   * caller — this component holds no message keys of its own for it.
   */
  readonly scopeError?: string;
  /** Re-runs the scope lookup `scopeError` describes. */
  readonly onScopeRetry?: () => unknown;
}

/**
 * The filter panel shared by all three level tabs.
 *
 * **`scope` is what varies by level**: regional filters by league, departmental
 * by committee, and national omits it because there is nothing above a national
 * championship to scope by. The selects share one row, the scope first.
 *
 * Error copy for a failed scope lookup is passed in already translated, so an
 * empty dropdown is never mistaken for "this level has no leagues".
 */
export function ChampionshipFilters({
  level,
  category,
  gender,
  onCategoryChange,
  onGenderChange,
  onReset,
  scope,
  scopeError,
  onScopeRetry,
}: ChampionshipFiltersProps) {
  const tCommon = useTranslations("common");
  const { categoryOptions, genderOptions } = useCategoryGenderOptions();

  const scopeName = scope?.options.find((o) => o.id === scope.value)?.name;

  const chips = [
    scopeName && {
      key: "scope",
      label: scopeName,
      onRemove: () => scope?.onChange(undefined),
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
      onChange={scope.onChange}
      options={[
        { value: undefined, label: scope.allLabel },
        ...scope.options.map((o) => ({ value: o.id, label: o.name })),
      ]}
    />
  );

  const categorySelect = (
    <Select
      label={tCommon("filters.categories")}
      value={category}
      onChange={onCategoryChange}
      options={categoryOptions}
    />
  );

  const genderSelect = (
    <Select
      label={tCommon("filters.genders")}
      value={gender}
      onChange={onGenderChange}
      options={genderOptions}
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

      {/* One row: the scope select, where there is one, then category and gender. */}
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          scopeSelect ? "md:grid-cols-3" : "md:grid-cols-2",
        )}
      >
        {scopeSelect}
        {categorySelect}
        {genderSelect}
      </div>
    </FiltersShell>
  );
}
