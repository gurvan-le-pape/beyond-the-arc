// src/frontend/app/[locale]/(public)/teams/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import CompetitionLevelFilters from "@/features/competitions/components/filters/CompetitionLevelFilters";
import { useCommitteeLeagueClubFilters } from "@/features/competitions/hooks";
import { useTeamFilterValues, useTeams } from "@/features/teams/api/use-teams";
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
  // Global filters
  const [level, setLevel] = useState<CompetitionLevel>(CompetitionLevel.ALL);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Use the generic filter abstraction
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

  // Fetch team filter values (numbers, poolLetters, divisions)
  const { data: teamFilterValues } = useTeamFilterValues({
    committeeId,
    leagueId,
  });

  // SWR for teams data
  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
  } = useTeams({
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
  });

  const teams = teamsData?.items ?? [];
  const pagination = teamsData
    ? {
        total: teamsData.total,
        page: teamsData.page,
        limit: teamsData.limit,
        totalPages: teamsData.totalPages,
      }
    : null;

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

  // Use the shared filter config/hook for teams table
  const { filterableDropdownKeys, filterRenderers } = useTeamsTableFilters({
    numbers: teamFilterValues?.numbers ?? [],
    clubs,
    categories: CATEGORY_LIST,
    genders: GENDER_LIST,
    divisions: teamFilterValues?.divisions ?? [],
    poolLetters: teamFilterValues?.poolLetters ?? [],
    numberProps: getDropdownFilterProps("number"),
    clubProps: getSearchableDropdownFilterProps("club"),
    categoryProps: getDropdownFilterProps("category"),
    genderProps: getDropdownFilterProps("gender"),
    divisionProps: getDropdownFilterProps("division"),
    poolProps: getDropdownFilterProps("pool"),
  });

  const errorMessage = (() => {
    if (committeeLeagueClubFiltersError)
      return tCommon("errors.fetchLeagueOrCommittee");
    if (teamsError) return tCommon("errors.fetchTeams");
    return null;
  })();

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
          error={errorMessage}
          onRowClick={handleTeamClick}
          emptyMessage={tCommon("emptyState.teams")}
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
