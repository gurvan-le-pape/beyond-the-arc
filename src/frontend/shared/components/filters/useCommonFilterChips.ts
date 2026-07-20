// src/frontend/shared/components/filters/useCommonFilterChips.ts
import { useTranslations } from "next-intl";

import type { Category, CompetitionLevel, Gender } from "@/shared/constants";
import { CompetitionLevel as Level } from "@/shared/constants";

import type { ActiveFilterChip } from "./ActiveFilterChips";

interface CommonFilterChipsArgs {
  readonly category: Category | undefined;
  readonly gender: Gender | undefined;
  readonly level: CompetitionLevel | undefined;
  readonly committeeId: number | undefined;
  readonly leagueId: number | undefined;
  readonly committees: { id: number; name: string }[];
  readonly leagues: { id: number; name: string }[];
  readonly setCategory: (value: Category | undefined) => void;
  readonly setGender: (value: Gender | undefined) => void;
  readonly setLevel: (value: CompetitionLevel | undefined) => void;
  readonly setCommitteeId: (value: number | undefined) => void;
  readonly setLeagueId: (value: number | undefined) => void;
}

/**
 * The active-filter chips shared by the teams, players, and matches filter
 * panels. Returned as two groups (category+gender, level+location) so each
 * panel can slot them among its own feature-specific chips in the right order.
 */
export function useCommonFilterChips({
  category,
  gender,
  level,
  committeeId,
  leagueId,
  committees,
  leagues,
  setCategory,
  setGender,
  setLevel,
  setCommitteeId,
  setLeagueId,
}: CommonFilterChipsArgs): {
  categoryGenderChips: ActiveFilterChip[];
  levelLocationChips: ActiveFilterChip[];
} {
  const tCommon = useTranslations("common");

  const locationLabel =
    level === Level.DEPARTMENTAL
      ? committees.find((c) => c.id === committeeId)?.name
      : leagues.find((l) => l.id === leagueId)?.name;

  const categoryGenderChips = [
    category && {
      key: "category",
      label: tCommon(`category.${category}`),
      onRemove: () => setCategory(undefined),
    },
    gender && {
      key: "gender",
      label: tCommon(`gender.${gender}`),
      onRemove: () => setGender(undefined),
    },
  ].filter(Boolean) as ActiveFilterChip[];

  const levelLocationChips = [
    level && {
      key: "level",
      label: tCommon(`competition.levels.${level.toLowerCase()}`),
      onRemove: () => setLevel(undefined),
    },
    locationLabel && {
      key: "location",
      label: locationLabel,
      onRemove: () => {
        setCommitteeId(undefined);
        setLeagueId(undefined);
      },
    },
  ].filter(Boolean) as ActiveFilterChip[];

  return { categoryGenderChips, levelLocationChips };
}
