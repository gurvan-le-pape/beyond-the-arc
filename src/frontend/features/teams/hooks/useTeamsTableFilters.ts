// src/frontend/features/teams/hooks/useTeamsTableFilters.ts
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { useDropdown } from "@/shared/hooks";
import { FilterKey } from "@/shared/types/filters/FilterKey";
import type { TeamsTableFiltersConfig } from "@/shared/types/filters/TeamsTableFiltersConfig";
import {
  createFilterRenderers,
  type FilterRendererConfig,
} from "@/shared/utils";
import { buildClubOptions } from "@/shared/utils/buildClubOptions";
import { buildOptions } from "@/shared/utils/buildOptions";
import { createDropdownRefs } from "@/shared/utils/createDropdownRefs";

export function useTeamsTableFilters(config: TeamsTableFiltersConfig) {
  const {
    numbers,
    clubs,
    categories,
    genders,
    divisions,
    poolLetters,
    numberProps,
    clubProps,
    categoryProps,
    genderProps,
    divisionProps,
    poolProps,
  } = config;
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");
  const filterableDropdownKeys: FilterKey[] = [
    FilterKey.Number,
    FilterKey.Club,
    FilterKey.Category,
    FilterKey.Gender,
    FilterKey.Division,
    FilterKey.Pool,
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
    () => buildOptions(tTeams("teamsTable.allNumbers"), numbers || []),
    [numbers, tTeams],
  );
  const categoryDropdownOptions = useMemo(
    () => buildOptions(tTeams("teamsTable.allCategories"), categories || []),
    [categories, tTeams],
  );
  const genderDropdownOptions = useMemo(
    () => buildOptions(tTeams("teamsTable.allGenders"), genders || []),
    [genders, tTeams],
  );
  const divisionDropdownOptions = useMemo(
    () => buildOptions(tTeams("teamsTable.allDivisions"), divisions),
    [divisions, tTeams],
  );
  const poolDropdownOptions = useMemo(
    () => buildOptions(tTeams("teamsTable.allPools"), poolLetters),
    [poolLetters, tTeams],
  );
  const clubOptions = useMemo(() => buildClubOptions(clubs || []), [clubs]);

  const filterRendererConfigs: FilterRendererConfig[] = [
    {
      type: "dropdown",
      key: FilterKey.Number,
      config: {
        label: tTeams("teamsTable.allNumbers"),
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
      type: "searchableDropdown",
      key: FilterKey.Club,
      config: {
        options: clubOptions,
        placeholder: tCommon("table.filterClub"),
        testId: "filter-club-input",
        ...clubProps,
        onChange: (val: string | number | undefined) =>
          clubProps.onChange?.(String(val ?? "")),
      },
    },
    {
      type: "dropdown",
      key: FilterKey.Category,
      config: {
        label: tTeams("teamsTable.allCategories"),
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
        label: tTeams("teamsTable.allGenders"),
        options: genderDropdownOptions,
        filterKey: FilterKey.Gender,
        testId: "filter-gender-dropdown",
        openDropdown,
        setOpenDropdown,
        dropdownRefs,
        ...genderProps,
      },
    },
    {
      type: "dropdown",
      key: FilterKey.Division,
      config: {
        label: tTeams("teamsTable.allDivisions"),
        options: divisionDropdownOptions,
        filterKey: FilterKey.Division,
        testId: "filter-division-dropdown",
        openDropdown,
        setOpenDropdown,
        dropdownRefs,
        ...divisionProps,
      },
    },
    {
      type: "dropdown",
      key: FilterKey.Pool,
      config: {
        label: tTeams("teamsTable.allPools"),
        options: poolDropdownOptions,
        filterKey: FilterKey.Pool,
        testId: "filter-pool-dropdown",
        openDropdown,
        setOpenDropdown,
        dropdownRefs,
        ...poolProps,
      },
    },
  ];
  const filterRenderers = useMemo(
    () => createFilterRenderers(filterRendererConfigs),
    [
      numberDropdownOptions,
      clubOptions,
      categoryDropdownOptions,
      genderDropdownOptions,
      divisionDropdownOptions,
      poolDropdownOptions,
      tTeams,
      tCommon,
      numberProps,
      clubProps,
      categoryProps,
      genderProps,
      divisionProps,
      poolProps,
    ],
  );
  return { filterableDropdownKeys, filterRenderers };
}
