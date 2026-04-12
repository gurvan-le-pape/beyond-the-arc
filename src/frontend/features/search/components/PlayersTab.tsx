// src/frontend/features/search/components/PlayersTab.tsx
"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCommitteeLeagueClubFilters } from "@/features/competitions/championships/hooks";
import { usePlayers } from "@/features/players/api/use-players";
import PlayerCard from "@/features/players/components/list/PlayersCard";
import { PlayersFilters } from "@/features/players/components/list/PlayersFilters";
import type { Player } from "@/features/players/types/Player";
import { useTeamFilterValues } from "@/features/teams/api/use-teams";
import { useRouter } from "@/navigation";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
} from "@/shared/components/feedback";
import { Card } from "@/shared/components/primitives";
import { Pagination } from "@/shared/components/table";
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";
import type { Pagination as PaginationType } from "@/shared/types";

export function PlayersTab() {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const {
    committees,
    leagues,
    committeeId,
    setCommitteeId,
    leagueId,
    setLeagueId,
    error: committeeLeagueClubFiltersError,
    resetFilters: resetCommitteeLeagueClubFilters,
  } = useCommitteeLeagueClubFilters();

  const [level, setLevel] = useState<CompetitionLevel | undefined>(undefined);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [clubId, setClubId] = useState("");
  const [selectedClubName, setSelectedClubName] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const { data: teamFilterValues } = useTeamFilterValues({
    committeeId,
    leagueId,
  });

  const {
    data: playersData,
    error: playersError,
    isLoading: playersLoading,
  } = usePlayers({
    level: level || undefined,
    committeeId: committeeId || undefined,
    leagueId: leagueId || undefined,
    number: number ? Number(number) : undefined,
    name: name || undefined,
    teamNumber: teamNumber ? Number(teamNumber) : undefined,
    clubId: clubId ? Number(clubId) : undefined,
    category: category || undefined,
    gender: gender || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const players: Player[] = playersData?.items ?? [];
  const pagination: PaginationType | null = playersData
    ? {
        total: playersData.total,
        page: playersData.page,
        limit: playersData.limit,
        totalPages: playersData.totalPages,
      }
    : null;

  // Reset to page 1 on any filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    level,
    committeeId,
    leagueId,
    name,
    number,
    teamNumber,
    clubId,
    category,
    gender,
  ]);

  // Reset dependent filters when location changes
  useEffect(() => {
    setNumber("");
    setTeamNumber("");
    setCurrentPage(1);
  }, [committeeId, leagueId]);

  const handleReset = () => {
    setLevel(undefined);
    setCommitteeId(undefined);
    setLeagueId(undefined);
    setName("");
    setNumber("");
    setTeamNumber("");
    setClubId("");
    setSelectedClubName("");
    setCategory(undefined);
    setGender(undefined);
    setCurrentPage(1);
    resetCommitteeLeagueClubFilters();
  };

  let errorMessage: string | null = null;
  if (committeeLeagueClubFiltersError) {
    errorMessage = tCommon("errors.fetchLeagueOrCommittee");
  } else if (playersError) {
    errorMessage = tCommon("errors.fetchPlayers");
  }

  return (
    <div className="space-y-6">
      <PlayersFilters
        name={name}
        setName={setName}
        category={category}
        setCategory={setCategory}
        gender={gender}
        setGender={setGender}
        level={level}
        setLevel={(value) => {
          setLevel(value);
          setCommitteeId(undefined);
          setLeagueId(undefined);
        }}
        committeeId={committeeId}
        setCommitteeId={setCommitteeId}
        leagueId={leagueId}
        setLeagueId={setLeagueId}
        committees={committees}
        leagues={leagues}
        clubId={clubId}
        setClubId={setClubId}
        selectedClubName={selectedClubName}
        setSelectedClubName={setSelectedClubName}
        number={number}
        setNumber={setNumber}
        playerNumbers={teamFilterValues?.numbers ?? []}
        teamNumber={teamNumber}
        setTeamNumber={setTeamNumber}
        teamNumbers={teamFilterValues?.numbers ?? []}
        onReset={handleReset}
      />

      {playersLoading && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {errorMessage && !playersLoading && (
        <ErrorMessage message={errorMessage} />
      )}

      {!playersLoading &&
        !errorMessage &&
        (players.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon={<UserIcon className="w-16 h-16" />}
              title={tCommon("emptyState.players")}
              description={tPlayers("tryAdjustingFilters")}
            />
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {players.map((player: Player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onClick={(id) => router.push(`/players/${id}`)}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                pageSize={pageSize}
                setPageSize={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                setPageIndex={(index) => setCurrentPage(index + 1)}
                label={tPlayers("players")}
              />
            )}
          </>
        ))}
    </div>
  );
}
