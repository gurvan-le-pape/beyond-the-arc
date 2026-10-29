// src/frontend/shared/components/filters/useCommonFilterChips.ts
import { useTranslations } from "next-intl";

import type { Category, Gender } from "@/shared/constants";
import { CompetitionLevel as Level } from "@/shared/constants";
import type { FilterProps } from "@/shared/hooks";

import type { ActiveFilterChip } from "./ActiveFilterChips";
import type { LevelLocationValues } from "./LevelLocationFilters";

interface CommonFilterValues extends LevelLocationValues {
  category: Category | undefined;
  gender: Gender | undefined;
}

interface CommonFilterChipsArgs extends FilterProps<CommonFilterValues> {
  readonly committees: { id: number; name: string }[];
  readonly leagues: { id: number; name: string }[];
}

/**
 * The active-filter chips shared by the teams, players, and matches filter
 * panels. Returned as two groups (category+gender, level+location) so each
 * panel can slot them among its own feature-specific chips in the right order.
 *
 * @param root0 - the filter values, `set`, and the committee and league lists the labels are resolved from
 * @returns two chip groups — category+gender and level+location — for the panel to interleave with its own
 */
export function useCommonFilterChips({
  filters: { category, gender, level, committee, league },
  set,
  committees,
  leagues,
}: CommonFilterChipsArgs): {
  categoryGenderChips: ActiveFilterChip[];
  levelLocationChips: ActiveFilterChip[];
} {
  const tCommon = useTranslations("common");

  const locationLabel =
    level === Level.DEPARTMENTAL
      ? committees.find((c) => c.id === committee)?.name
      : leagues.find((l) => l.id === league)?.name;

  const categoryGenderChips = [
    category && {
      key: "category",
      label: tCommon(`category.${category}`),
      onRemove: () => set({ category: undefined }),
    },
    gender && {
      key: "gender",
      label: tCommon(`gender.${gender}`),
      onRemove: () => set({ gender: undefined }),
    },
  ].filter(Boolean) as ActiveFilterChip[];

  const levelLocationChips = [
    level && {
      key: "level",
      label: tCommon(`competition.levels.${level}`),
      onRemove: () => set({ level: undefined }),
    },
    locationLabel && {
      key: "location",
      label: locationLabel,
      onRemove: () => set({ committee: undefined, league: undefined }),
    },
  ].filter(Boolean) as ActiveFilterChip[];

  return { categoryGenderChips, levelLocationChips };
}
