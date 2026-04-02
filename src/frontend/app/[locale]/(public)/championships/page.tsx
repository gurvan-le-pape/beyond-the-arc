// src/frontend/app/[locale]/(public)/championships/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

import { useChampionships } from "@/features/competitions/championships/api";
import type { Championship } from "@/features/competitions/championships/types/Championship";
import { useCommittees } from "@/features/organizations/committees/api/use-committees";
import { useLeagues } from "@/features/organizations/leagues/api/use-leagues";
import { Link } from "@/navigation";
import { PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
} from "@/shared/constants";

const SKELETON_KEYS = Array.from({ length: 12 }, () => crypto.randomUUID());

// ---------------------------------------------------------------------------
// Championship Card
// ---------------------------------------------------------------------------
const levelColorMap: Record<string, string> = {
  [CompetitionLevel.REGIONAL]:
    "bg-regional-light/20 text-regional-dark border-regional-DEFAULT dark:bg-regional-dark/20 dark:text-regional-light dark:border-regional-light",
  [CompetitionLevel.DEPARTMENTAL]:
    "bg-departmental-light/20 text-departmental-dark border-departmental-DEFAULT dark:bg-departmental-dark/20 dark:text-departmental-light dark:border-departmental-light",
  [CompetitionLevel.NATIONAL]:
    "bg-national-light/20 text-national-dark border-national-DEFAULT dark:bg-national-dark/20 dark:text-national-light dark:border-national-light",
};

const levelBorderMap: Record<string, string> = {
  [CompetitionLevel.REGIONAL]:
    "border-l-regional-DEFAULT dark:border-l-regional-light",
  [CompetitionLevel.DEPARTMENTAL]:
    "border-l-departmental-DEFAULT dark:border-l-departmental-light",
  [CompetitionLevel.NATIONAL]:
    "border-l-national-DEFAULT dark:border-l-national-light",
};

function ChampionshipCard({
  championship,
}: {
  readonly championship: Championship;
}) {
  const tCompetitions = useTranslations("competitions");
  const levelColor =
    levelColorMap[championship.level] ??
    levelColorMap[CompetitionLevel.DEPARTMENTAL];
  const borderColor =
    levelBorderMap[championship.level] ??
    levelBorderMap[CompetitionLevel.DEPARTMENTAL];

  return (
    <Link
      href={`/championships/${championship.id}`}
      className={`group flex flex-col gap-3 p-4 rounded-card border border-divide-light dark:border-divide-dark border-l-4 ${borderColor} bg-surface-base dark:bg-surface-subtle-dark hover:shadow-card-hover dark:hover:shadow-card-dark hover:scale-[1.01] transition-all duration-200 shadow-card`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${levelColor}`}
        >
          {tCompetitions(`${championship.level}.label`)}
        </span>
        <span className="text-xs text-text-muted dark:text-text-muted-dark">
          {championship.seasonYear}
        </span>
      </div>
      <div className="font-semibold text-text-heading dark:text-text-heading-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 leading-snug">
        {championship.name}
      </div>
      <div className="flex flex-wrap gap-2">
        {championship.category && (
          <span className="text-xs px-2 py-0.5 rounded-button bg-surface-raised dark:bg-surface-raised-dark text-text-secondary dark:text-text-secondary-dark">
            {championship.category}
          </span>
        )}
        <span className="text-xs px-2 py-0.5 rounded-button bg-surface-raised dark:bg-surface-raised-dark text-text-secondary dark:text-text-secondary-dark capitalize">
          {championship.gender}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-button bg-surface-raised dark:bg-surface-raised-dark text-text-secondary dark:text-text-secondary-dark">
          {tCompetitions("divisionWithValue", { value: championship.division })}
        </span>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Filter select
// ---------------------------------------------------------------------------
function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly options: { value: string; label: string }[];
  readonly placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm rounded-input border border-divide-light dark:border-divide-dark bg-surface-base dark:bg-surface-subtle-dark text-text-body dark:text-text-body-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ChampionshipsPage() {
  const tCompetitions = useTranslations("competitions");
  const tCommon = useTranslations("common");

  const [level, setLevel] = useState("");
  const [orgId, setOrgId] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [seasonYear, setSeasonYear] = useState("");

  const isRegional = level === CompetitionLevel.REGIONAL;
  const isDepartmental = level === CompetitionLevel.DEPARTMENTAL;
  const hasOrgFilter = !!level && !!orgId;

  const { data: leagues = [] } = useLeagues();
  const { data: committees = [] } = useCommittees();

  // When org is selected, fetch scoped championships from backend.
  // Otherwise fetch all (no filters).
  const { data: championships = [], isLoading } = useChampionships(
    hasOrgFilter
      ? { level: level as CompetitionLevel, id: Number(orgId) }
      : undefined,
  );

  const seasonYears = useMemo(() => {
    const years = [...new Set(championships.map((c) => c.seasonYear))].sort(
      (a, b) => b.localeCompare(a),
    );
    return years.map((y) => ({ value: y, label: y }));
  }, [championships]);

  // Client-side filtering for category/gender/seasonYear.
  // Level filtering only applies when no org is selected (org fetch is already scoped).
  const filtered = useMemo(() => {
    return championships.filter((c: Championship) => {
      if (!hasOrgFilter && level && c.level !== level) return false;
      if (category && c.category !== category) return false;
      if (gender && c.gender !== gender) return false;
      if (seasonYear && c.seasonYear !== seasonYear) return false;
      return true;
    });
  }, [championships, level, hasOrgFilter, category, gender, seasonYear]);

  const hasActiveFilters = !!(level || category || gender || seasonYear);

  const handleLevelChange = (v: string) => {
    setLevel(v);
    setOrgId(""); // reset org when level changes
  };

  const resetFilters = () => {
    setLevel("");
    setOrgId("");
    setCategory("");
    setGender("");
    setSeasonYear("");
  };

  const levelOptions = [
    {
      value: CompetitionLevel.REGIONAL,
      label: tCompetitions("regional.label"),
    },
    {
      value: CompetitionLevel.DEPARTMENTAL,
      label: tCompetitions("departmental.label"),
    },
    {
      value: CompetitionLevel.NATIONAL,
      label: tCompetitions("national.label"),
    },
  ];

  let orgOptions: { value: string; label: string }[] = [];
  if (isRegional) {
    orgOptions = leagues.map((l) => ({ value: String(l.id), label: l.name }));
  } else if (isDepartmental) {
    orgOptions = committees.map((c) => ({
      value: String(c.id),
      label: c.name,
    }));
  }

  const orgPlaceholder = isRegional
    ? tCompetitions("carousel.titles.regionalLeagues")
    : tCompetitions("carousel.titles.departmentalCommittees");

  const categoryOptions = CATEGORY_LIST.map((c) => ({ value: c, label: c }));
  const genderOptions = GENDER_LIST.map((g) => ({ value: g, label: g }));

  let gridContent: React.ReactNode;
  if (isLoading) {
    gridContent = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SKELETON_KEYS.map((key) => (
          <div
            key={key}
            className="h-32 rounded-card bg-surface-subtle dark:bg-surface-raised-dark animate-pulse"
          />
        ))}
      </div>
    );
  } else if (filtered.length === 0) {
    gridContent = (
      <div className="text-center py-16 text-text-secondary dark:text-text-secondary-dark">
        {tCompetitions("noResults")}
      </div>
    );
  } else {
    gridContent = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((championship) => (
          <ChampionshipCard key={championship.id} championship={championship} />
        ))}
      </div>
    );
  }

  return (
    <PageLayout>
      <Text variant="h1" className="mb-6">
        {tCompetitions("breadcrumb")}
      </Text>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FaFilter className="text-text-muted dark:text-text-muted-dark text-sm flex-shrink-0" />

        <FilterSelect
          value={level}
          onChange={handleLevelChange}
          options={levelOptions}
          placeholder={tCompetitions("selectLevel")}
        />

        {(isRegional || isDepartmental) && (
          <FilterSelect
            value={orgId}
            onChange={setOrgId}
            options={orgOptions}
            placeholder={orgPlaceholder}
          />
        )}

        <FilterSelect
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          placeholder={tCommon("filters.category")}
        />
        <FilterSelect
          value={gender}
          onChange={setGender}
          options={genderOptions}
          placeholder={tCommon("filters.gender")}
        />
        <FilterSelect
          value={seasonYear}
          onChange={setSeasonYear}
          options={seasonYears}
          placeholder={tCommon("filters.seasonYear")}
        />

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-sm text-text-secondary dark:text-text-secondary-dark hover:text-text-heading dark:hover:text-text-heading-dark transition-colors"
          >
            <FaTimes className="text-xs" />
            {tCommon("filters.reset")}
          </button>
        )}
      </div>

      {/* Results count */}
      {!isLoading && (
        <div className="text-sm text-text-secondary dark:text-text-secondary-dark mb-4">
          {filtered.length} {tCompetitions("championshipsCount")}
        </div>
      )}

      {/* Cards grid */}
      {gridContent}
    </PageLayout>
  );
}
