// src/frontend/features/players/hooks/usePlayersTableFilters.ts
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { useDropdown } from "@/shared/hooks";
import type { PlayersTableFiltersConfig } from "@/shared/types";
import { FilterKey } from "@/shared/types";
import { buildClubOptions } from "@/shared/utils/buildClubOptions";
import { buildOptions } from "@/shared/utils/buildOptions";
import { createDropdownRefs } from "@/shared/utils/createDropdownRefs";
import type { FilterRendererConfig } from "@/shared/utils/entity/table/createFilterRenderers";
import { createFilterRenderers } from "@/shared/utils/entity/table/createFilterRenderers";

export function usePlayersTableFilters(config: PlayersTableFiltersConfig) {
  const {
    numbers,
    teamNumbers,
    clubs,
    categories,
    genders,
    clubProps,
    nameProps,
    numberProps,
    teamProps,
    categoryProps,
    genderProps,
  } = config;
  const tCommon = useTranslations("common");
  const tPlayers = useTranslations("players");

  // FIX: Include ALL filterable columns, including Name and Club
  const filterableDropdownKeys: FilterKey[] = [
    FilterKey.Number,
    FilterKey.Name,
    FilterKey.Team,
    FilterKey.Club,
    FilterKey.Category,
    FilterKey.Gender,
  ];

  const dropdownRefs = useMemo(
    () => createDropdownRefs(filterableDropdownKeys),
    [],
  );
  const { openDropdown, setOpenDropdown } = useDropdown(
    filterableDropdownKeys,
    dropdownRefs,
  );
  const numberDropdownOptions = useMemo(
    () => buildOptions(tPlayers("playersTable.allNumbers"), numbers || []),
    [numbers, tPlayers],
  );
  const teamDropdownOptions = useMemo(
    () => buildOptions(tPlayers("playersTable.allTeams"), teamNumbers || []),
    [teamNumbers, tPlayers],
  );
  const categoryDropdownOptions = useMemo(
    () =>
      buildOptions(tPlayers("playersTable.allCategories"), categories || []),
    [categories, tPlayers],
  );
  const genderDropdownOptions = useMemo(
    () => buildOptions(tPlayers("playersTable.allGenders"), genders || []),
    [genders, tPlayers],
  );
  const clubOptions = useMemo(() => buildClubOptions(clubs || []), [clubs]);

  const filterRendererConfigs: FilterRendererConfig[] = [
    {
      type: "dropdown",
      key: FilterKey.Number,
      config: {
        label: tPlayers("playersTable.allNumbers"),
        options: numberDropdownOptions,
        filterKey: FilterKey.Number,
        testId: "filter-number-dropdown",
        openDropdown,
        setOpenDropdown,
        dropdownRefs,
        ...numberProps,
      },
    },
    {
      type: "input",
      key: FilterKey.Name,
      config: {
        placeholder: tCommon("table.filterName"),
        testId: "filter-name-input",
        ...nameProps,
      },
    },
    {
      type: "dropdown",
      key: FilterKey.Team,
      config: {
        label: tPlayers("playersTable.allTeams"),
        options: teamDropdownOptions,
        filterKey: FilterKey.Team,
        testId: "filter-team-dropdown",
        openDropdown,
        setOpenDropdown,
        dropdownRefs,
        ...teamProps,
      },
    },
    {
      type: "searchableDropdown",
      key: FilterKey.Club,
      config: {
        options: clubOptions,
        placeholder: tCommon("table.filterClub"),
        testId: "filter-club-input",
        ...clubProps,
      },
    },
    {
      type: "dropdown",
      key: FilterKey.Category,
      config: {
        label: tPlayers("playersTable.allCategories"),
        options: categoryDropdownOptions,
        filterKey: FilterKey.Category,
        testId: "filter-category-dropdown",
        openDropdown,
        setOpenDropdown,
        dropdownRefs,
        ...categoryProps,
      },
    },
    {
      type: "dropdown",
      key: FilterKey.Gender,
      config: {
        label: tPlayers("playersTable.allGenders"),
        options: genderDropdownOptions,
        filterKey: FilterKey.Gender,
        testId: "filter-gender-dropdown",
        openDropdown,
        setOpenDropdown,
        dropdownRefs,
        ...genderProps,
      },
    },
  ];
  const filterRenderers = useMemo(
    () => createFilterRenderers(filterRendererConfigs),
    [
      numberDropdownOptions,
      teamDropdownOptions,
      clubOptions,
      categoryDropdownOptions,
      genderDropdownOptions,
      tPlayers,
      tCommon,
      numberProps,
      nameProps,
      teamProps,
      clubProps,
      categoryProps,
      genderProps,
    ],
  );
  return { filterableDropdownKeys, filterRenderers };
}
