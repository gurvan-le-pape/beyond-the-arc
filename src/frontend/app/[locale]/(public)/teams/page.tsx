// src/frontend/app/[locale]/(public)/teams/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import CompetitionLevelFilters from "@/features/competitions/components/filters/CompetitionLevelFilters";
import { useCommitteeLeagueClubFilters } from "@/features/competitions/hooks";
import { teamsService } from "@/features/teams/api";
import { getTeamsTableColumns } from "@/features/teams/components";
import { useTeamsTableFilters } from "@/features/teams/hooks";
import type { Team } from "@/features/teams/types/Team";
import { useRouter } from "@/navigation";
import {
  EntityListPage,
  EntityTable,
  Pagination,
} from "@/shared/components/entity";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
  NA,
  TEAM_TEST_IDS as TEST_IDS,
} from "@/shared/constants";
import { EMPTY_STATE_MESSAGES } from "@/shared/constants/errors";
import { useEntityFilters, useEntityTable } from "@/shared/hooks";

export default function TeamsPage() {
  const router = useRouter();
  const tTeams = useTranslations("teams");
  const tCommon = useTranslations("common");

  const {
    committees,
    leagues,
    clubs,
    committeeId,
    setCommitteeId,
    leagueId,
    setLeagueId,
    error: committeeLeagueClubFiltersError,
    resetFilters: resetCommitteeLeagueClubFilters,
  } = useCommitteeLeagueClubFilters();

  // Table column filters state for TanStack Table
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [divisions, setDivisions] = useState<number[]>([]);
  const [poolLetters, setPoolLetters] = useState<string[]>([]);

  // Fetch team filter values (numbers, poolLetters, divisions)
  const { data: teamFilterValues } = useSWR(
    ["teams/filter-values", committeeId, leagueId],
    () => teamsService.getFilterValues({ committeeId, leagueId }),
    { revalidateOnFocus: false, dedupingInterval: 30000 },
  );

  // Global filters
  const [level, setLevel] = useState<CompetitionLevel>(CompetitionLevel.ALL);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Use the new generic filter abstraction
  const {
    filters,
    getDropdownFilterProps,
    getSearchableDropdownFilterProps,
    resetFilters: resetEntityFilters,
  } = useEntityFilters({
    number: { type: "dropdown", initial: "" },
    club: { type: "searchableDropdown", initial: "" },
    category: { type: "dropdown", initial: "" },
    gender: { type: "dropdown", initial: "" },
    division: { type: "dropdown", initial: "" },
    pool: { type: "dropdown", initial: "" },
  });

  // SWR for teams data
  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
  } = useSWR(
    ["teams", level, committeeId, leagueId, filters, currentPage, pageSize],
    () =>
      teamsService.getAll({
        level: level === CompetitionLevel.ALL ? undefined : level,
        committeeId: committeeId || undefined,
        leagueId: leagueId || undefined,
        number: filters.number ? Number(filters.number) : undefined,
        clubId: filters.club ? Number(filters.club) : undefined,
        category: filters.category || undefined,
        gender: filters.gender || undefined,
        division: filters.division || undefined,
        poolLetter: filters.pool || undefined,
        page: currentPage,
        limit: pageSize,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    },
  );
  const teams = teamsData?.items || [];
  const pagination = teamsData
    ? {
        total: teamsData.total,
        page: teamsData.page,
        limit: teamsData.limit,
        totalPages: teamsData.totalPages,
      }
    : null;

  // Use team filter values from the dedicated endpoint
  useEffect(() => {
    if (teamFilterValues) {
      setNumbers(teamFilterValues.numbers ?? []);
      setDivisions(teamFilterValues.divisions ?? []);
      setPoolLetters(teamFilterValues.poolLetters ?? []);
    } else {
      setNumbers([]);
      setDivisions([]);
      setPoolLetters([]);
    }
  }, [teamFilterValues]);

  useEffect(() => {
    resetEntityFilters();
    setCurrentPage(1);
  }, [committeeId, leagueId]);

  const handleTeamClick = (teamId: number) => {
    router.push(`/teams/${teamId}`);
  };

  // Memoized columns with sorting
  const columns = useMemo(() => getTeamsTableColumns(tTeams), [tTeams]);

  // Memoized table data
  const tableData = useMemo(
    () =>
      teams.map((team: Team) => ({
        id: team.id,
        number: team.number ? String(team.number) : "",
        club: team.club?.name || NA,
        category: team.category || NA,
        gender: team.gender || NA,
        division: team.pool?.championship?.division || NA,
        pool: team.pool?.letter || NA,
      })),
    [teams],
  );

  const table = useEntityTable({
    data: tableData,
    columns,
    pagination,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    columnFilters,
    setColumnFilters,
  });

  const categories = CATEGORY_LIST;
  const genders = GENDER_LIST;

  // Use the shared filter config/hook for teams table
  const { filterableDropdownKeys, filterRenderers } = useTeamsTableFilters({
    numbers,
    clubs,
    categories,
    genders,
    divisions,
    poolLetters,
    numberProps: getDropdownFilterProps("number"),
    clubProps: getSearchableDropdownFilterProps("club"),
    categoryProps: getDropdownFilterProps("category"),
    genderProps: getDropdownFilterProps("gender"),
    divisionProps: getDropdownFilterProps("division"),
    poolProps: getDropdownFilterProps("pool"),
  });

  return (
    <EntityListPage
      title={tTeams("label")}
      filters={
        <CompetitionLevelFilters
          level={level}
          setLevel={(value) => {
            setLevel(value);
            setCommitteeId(undefined);
            setLeagueId(undefined);
            setCurrentPage(1);
          }}
          committeeId={committeeId}
          setCommitteeId={setCommitteeId}
          leagueId={leagueId}
          setLeagueId={setLeagueId}
          committees={committees}
          leagues={leagues}
          onReset={() => {
            setLevel(CompetitionLevel.ALL);
            resetEntityFilters();
            resetCommitteeLeagueClubFilters();
            setCurrentPage(1);
          }}
        />
      }
      table={
        <EntityTable
          columns={columns}
          table={table}
          isLoading={teamsLoading}
          error={committeeLeagueClubFiltersError || teamsError?.message || null}
          onRowClick={handleTeamClick}
          emptyMessage={EMPTY_STATE_MESSAGES.TEAMS}
          skeletonRowCount={10}
          testID={TEST_IDS.table}
          ariaLabel={tTeams("teamsTable.teamsList")}
          rowAriaLabel={(row: any) =>
            tCommon("team.seeTeam", { number: row.number })
          }
          rowTestId={TEST_IDS.teamRow}
          cellTestId={TEST_IDS.cell}
          filterableDropdownKeys={filterableDropdownKeys}
          filterRenderers={filterRenderers}
          headerTestId={TEST_IDS.header}
          errorRowTestId={TEST_IDS.errorRow}
          retryButtonTestId={TEST_IDS.retryButton}
          emptyRowTestId={TEST_IDS.emptyRow}
        />
      }
      pagination={
        <Pagination
          pagination={pagination}
          pageSize={pageSize}
          setPageSize={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          setPageIndex={(index) => table.setPageIndex(index)}
          label={tTeams("teams")}
        />
      }
    />
  );
}
