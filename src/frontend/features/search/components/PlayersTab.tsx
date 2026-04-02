// src/frontend/features/search/components/PlayersTab.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { CompetitionLevelFilters } from "@/features/competitions/components";
import { useCommitteeLeagueClubFilters } from "@/features/competitions/hooks";
import { usePlayers } from "@/features/players/api/use-players";
import { getPlayersTableColumns } from "@/features/players/components";
import { usePlayersTableFilters } from "@/features/players/hooks";
import type { Player } from "@/features/players/types/Player";
import { useTeamFilterValues } from "@/features/teams/api/use-teams";
import { EntityTable } from "@/shared/components/domain";
import { EntityListPage } from "@/shared/components/layout";
import { Pagination } from "@/shared/components/table";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
  NA,
  PLAYER_TEST_IDS,
} from "@/shared/constants";
import { useEntityFilters, useEntityTable } from "@/shared/hooks";
import type { Pagination as PaginationType } from "@/shared/types";

export function PlayersTab() {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");
  const router = useRouter();

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

  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [level, setLevel] = useState<CompetitionLevel>(CompetitionLevel.ALL);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const {
    filters,
    getInputFilterProps,
    getDropdownFilterProps,
    getSearchableDropdownFilterProps,
    resetFilters: resetEntityFilters,
  } = useEntityFilters({
    number: { type: "dropdown", initial: "" },
    name: { type: "input", debounceMs: 400, initial: "" },
    team: { type: "dropdown", initial: "" },
    club: { type: "searchableDropdown", initial: "" },
    category: { type: "dropdown", initial: "" },
    gender: { type: "dropdown", initial: "" },
  });

  const { data: teamFilterValues } = useTeamFilterValues({
    committeeId,
    leagueId,
  });

  const {
    data: playersData,
    error: playersError,
    isLoading: playersLoading,
  } = usePlayers({
    level: level === CompetitionLevel.ALL ? undefined : level,
    committeeId: committeeId || undefined,
    leagueId: leagueId || undefined,
    number: filters.number ? Number(filters.number) : undefined,
    name: filters.name || undefined,
    teamNumber: filters.team ? Number(filters.team) : undefined,
    clubId: filters.club ? Number(filters.club) : undefined,
    category: filters.category || undefined,
    gender: filters.gender || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const players = playersData?.items ?? [];
  const pagination: PaginationType | null = playersData
    ? {
        total: playersData.total,
        page: playersData.page,
        limit: playersData.limit,
        totalPages: playersData.totalPages,
      }
    : null;

  useEffect(() => {
    resetEntityFilters();
    setCurrentPage(1);
  }, [committeeId, leagueId]);

  const columns = useMemo(() => getPlayersTableColumns(tPlayers), [tPlayers]);
  const tableData = useMemo(
    () =>
      players.map((player: Player) => ({
        id: player.id,
        number: player.number ? String(player.number) : "",
        name: player.name,
        team: player.team?.number ? String(player.team.number) : "",
        club: player.team?.club?.name || NA,
        category: player.team?.category || NA,
        gender: player.team?.gender || NA,
      })),
    [players],
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

  const { filterableDropdownKeys, filterRenderers } = usePlayersTableFilters({
    numbers: teamFilterValues?.numbers ?? [],
    teamNumbers: teamFilterValues?.numbers ?? [],
    clubs,
    categories: CATEGORY_LIST,
    genders: GENDER_LIST,
    clubProps: getSearchableDropdownFilterProps("club"),
    nameProps: getInputFilterProps("name"),
    numberProps: getDropdownFilterProps("number"),
    teamProps: getDropdownFilterProps("team"),
    categoryProps: getDropdownFilterProps("category"),
    genderProps: getDropdownFilterProps("gender"),
  });

  let errorMessage: string | null = null;
  if (committeeLeagueClubFiltersError) {
    errorMessage = tCommon("errors.fetchLeagueOrCommittee");
  } else if (playersError) {
    errorMessage = tCommon("errors.fetchPlayers");
  }

  return (
    <EntityListPage
      title={tPlayers("label")}
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
          isLoading={playersLoading}
          error={errorMessage}
          onRowClick={(id) => router.push(`/players/${id}`)}
          emptyMessage={tCommon("emptyState.players")}
          skeletonRowCount={10}
          testID={PLAYER_TEST_IDS.table}
          ariaLabel={tPlayers("playersTable.playersList")}
          rowAriaLabel={(row: any) =>
            tCommon("player.seePlayer", { name: row.name })
          }
          rowTestId={PLAYER_TEST_IDS.playerRow}
          cellTestId={PLAYER_TEST_IDS.cell}
          filterableDropdownKeys={filterableDropdownKeys}
          filterRenderers={filterRenderers}
          headerTestId={PLAYER_TEST_IDS.header}
          errorRowTestId={PLAYER_TEST_IDS.errorRow}
          retryButtonTestId={PLAYER_TEST_IDS.retryButton}
          emptyRowTestId={PLAYER_TEST_IDS.emptyRow}
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
          label={tPlayers("players")}
        />
      }
    />
  );
}
