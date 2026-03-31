// src/frontend/app/[locale]/(public)/players/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { CompetitionLevelFilters } from "@/features/competitions/components";
import { useCommitteeLeagueClubFilters } from "@/features/competitions/hooks";
import { usePlayers } from "@/features/players/api/use-players";
import { getPlayersTableColumns } from "@/features/players/components";
import { usePlayersTableFilters } from "@/features/players/hooks";
import type { Player } from "@/features/players/types/Player";
import { useTeamFilterValues } from "@/features/teams/api/use-teams";
import { useRouter } from "@/navigation";
import { EntityTable } from "@/shared/components/domain";
import { EntityListPage, PageLayout } from "@/shared/components/layout";
import { Pagination } from "@/shared/components/table";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
  NA,
  PLAYER_TEST_IDS as TEST_IDS,
} from "@/shared/constants";
import { useEntityFilters, useEntityTable } from "@/shared/hooks";
import type { Pagination as PaginationType } from "@/shared/types";

export default function PlayersPage() {
  const router = useRouter();
  const tPlayers = useTranslations("players");
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

  // Fetch team filter values (numbers, poolLetters, divisions)
  const { data: teamFilterValues } = useTeamFilterValues({
    committeeId,
    leagueId,
  });

  // SWR for players data
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

  const handlePlayerClick = (playerId: number) => {
    router.push(`/players/${playerId}`);
  };

  // Memoized columns with sorting
  const columns = useMemo(() => getPlayersTableColumns(tPlayers), [tPlayers]);

  // Memoized table data
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

  // Use the shared filter config/hook for teams table
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

  const errorMessage = (() => {
    if (committeeLeagueClubFiltersError)
      return tCommon("errors.fetchLeagueOrCommittee");
    if (playersError) return tCommon("errors.fetchPlayers");
    return null;
  })();

  return (
    <PageLayout>
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
            onRowClick={handlePlayerClick}
            emptyMessage={tCommon("emptyState.players")}
            skeletonRowCount={10}
            testID={TEST_IDS.table}
            ariaLabel={tPlayers("playersTable.playersList")}
            rowAriaLabel={(row: any) =>
              tCommon("player.seePlayer", { name: row.name })
            }
            rowTestId={TEST_IDS.playerRow}
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
            setPageSize={(size: number) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            setPageIndex={(index) => table.setPageIndex(index)}
            label={tPlayers("players")}
          />
        }
      />
    </PageLayout>
  );
}
