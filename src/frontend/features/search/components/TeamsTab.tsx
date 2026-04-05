// src/frontend/features/search/components/TeamsTab.tsx
"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCommitteeLeagueClubFilters } from "@/features/competitions/hooks";
import { useTeamFilterValues, useTeams } from "@/features/teams/api/use-teams";
import TeamCard from "@/features/teams/components/list/TeamsCard";
import TeamsFilters from "@/features/teams/components/list/TeamsFilters";
import type { Team } from "@/features/teams/types/Team";
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

export function TeamsTab() {
  const tTeams = useTranslations("teams");
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
  const [number, setNumber] = useState("");
  const [clubId, setClubId] = useState("");
  const [selectedClubName, setSelectedClubName] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [division, setDivision] = useState("");
  const [pool, setPool] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const { data: teamFilterValues } = useTeamFilterValues({
    committeeId,
    leagueId,
  });

  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
  } = useTeams({
    level: level || undefined,
    committeeId: committeeId || undefined,
    leagueId: leagueId || undefined,
    number: number ? Number(number) : undefined,
    clubId: clubId ? Number(clubId) : undefined,
    category: category || undefined,
    gender: gender || undefined,
    division: division ? Number(division) : undefined,
    poolLetter: pool || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const teams: Team[] = teamsData?.items ?? [];
  const pagination: PaginationType | null = teamsData
    ? {
        total: teamsData.total,
        page: teamsData.page,
        limit: teamsData.limit,
        totalPages: teamsData.totalPages,
      }
    : null;

  // Reset to page 1 on any filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    level,
    committeeId,
    leagueId,
    number,
    clubId,
    category,
    gender,
    division,
    pool,
  ]);

  // Reset dependent filters when location changes
  useEffect(() => {
    setNumber("");
    setDivision("");
    setPool("");
    setCurrentPage(1);
  }, [committeeId, leagueId]);

  const handleReset = () => {
    setLevel(undefined);
    setCommitteeId(undefined);
    setLeagueId(undefined);
    setNumber("");
    setClubId("");
    setSelectedClubName("");
    setCategory(undefined);
    setGender(undefined);
    setDivision("");
    setPool("");
    setCurrentPage(1);
    resetCommitteeLeagueClubFilters();
  };

  let errorMessage: string | null = null;
  if (committeeLeagueClubFiltersError) {
    errorMessage = tCommon("errors.fetchLeagueOrCommittee");
  } else if (teamsError) {
    errorMessage = tCommon("errors.fetchTeams");
  }

  return (
    <div className="space-y-6">
      <TeamsFilters
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
        teamNumbers={teamFilterValues?.numbers ?? []}
        division={division}
        setDivision={setDivision}
        divisions={teamFilterValues?.divisions ?? []}
        pool={pool}
        setPool={setPool}
        poolLetters={teamFilterValues?.poolLetters ?? []}
        onReset={handleReset}
      />

      {teamsLoading && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {errorMessage && !teamsLoading && <ErrorMessage message={errorMessage} />}

      {!teamsLoading &&
        !errorMessage &&
        (teams.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon={<UserGroupIcon className="w-16 h-16" />}
              title={tCommon("emptyState.teams")}
              description={tTeams("tryAdjustingFilters")}
            />
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {teams.map((team: Team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onClick={(id) => router.push(`/teams/${id}`)}
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
                label={tTeams("teams")}
              />
            )}
          </>
        ))}
    </div>
  );
}
