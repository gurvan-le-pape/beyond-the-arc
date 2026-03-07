// src/frontend/app/[locale]/(public)/matches/page.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { championshipService } from "@/features/competitions/championships/api";
import type { Championship } from "@/features/competitions/championships/types/Championship";
import { poolsService } from "@/features/competitions/pools/api/pools.service";
import { matchesService } from "@/features/matches/api";
import { MatchesCard, MatchesFilters } from "@/features/matches/components";
import type { Match } from "@/features/matches/types/Match";
import { committeesService } from "@/features/organizations/committees/api/committees.service";
import { leaguesService } from "@/features/organizations/leagues/api/leagues.service";
import { useRouter } from "@/navigation";
import { Pagination } from "@/shared/components/entity";
import { Footer, Header } from "@/shared/components/layouts";
import { EmptyState, LoadingSpinner } from "@/shared/components/ui";
import { Card } from "@/shared/components/ui/primitives/Card";
import type { Gender } from "@/shared/constants";
import { Category, CompetitionLevel } from "@/shared/constants";
import type { Pagination as PaginationType } from "@/shared/types";

export default function MatchesPage() {
  const router = useRouter();
  const tMatches = useTranslations("matches");

  // State
  // SWR will manage matches and pagination
  const [committees, setCommittees] = useState<any[]>([]);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [pools, setPools] = useState<any[]>([]);

  // Filters
  const [level, setLevel] = useState<CompetitionLevel | undefined>(undefined);
  const [division, setDivision] = useState<number | undefined>(undefined);
  const [committeeId, setCommitteeId] = useState<number | undefined>(undefined);
  const [leagueId, setLeagueId] = useState<number | undefined>(undefined);
  const [poolId, setPoolId] = useState<number | undefined>(undefined);
  const [matchday, setMatchday] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [matchesPerPage, setMatchesPerPage] = useState(50);

  // Error for auxiliary fetches
  const [error, setError] = useState<string | null>(null);

  // Fetch committees and leagues
  useEffect(() => {
    Promise.all([
      committeesService.getAll().then(setCommittees),
      leaguesService.getAll().then(setLeagues),
    ]).catch(() => setError("Error fetching filter options"));
  }, []);

  // SWR for matches data
  const {
    data: matchesData,
    error: matchesError,
    isLoading: matchesLoading,
  } = useSWR(
    [
      "matches",
      level,
      division,
      committeeId,
      leagueId,
      category,
      gender,
      search,
      poolId,
      matchday,
      dateFilter,
      currentPage,
      matchesPerPage,
    ],
    () =>
      matchesService.getAll({
        page: currentPage,
        limit: matchesPerPage,
        level: level || undefined,
        division: division || undefined,
        committeeId: committeeId !== undefined ? committeeId : undefined,
        leagueId: leagueId !== undefined ? leagueId : undefined,
        poolId: poolId !== undefined ? poolId : undefined,
        matchday: matchday || undefined,
        category: category || undefined,
        gender: gender || undefined,
        date: dateFilter || undefined,
        search: search || undefined,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    },
  );
  const matches = matchesData?.items || [];
  const pagination: PaginationType | null = matchesData
    ? {
        total: matchesData.total,
        page: matchesData.page,
        limit: matchesData.limit,
        totalPages: matchesData.totalPages,
      }
    : null;

  // Fetch championships when level and location are selected
  useEffect(() => {
    const loadChampionships = async () => {
      if (
        (level === CompetitionLevel.DEPARTMENTAL &&
          committeeId !== undefined) ||
        (level === CompetitionLevel.REGIONAL && leagueId !== undefined)
      ) {
        const id =
          level === CompetitionLevel.DEPARTMENTAL ? committeeId : leagueId;
        try {
          if (id !== undefined) {
            const data = await championshipService.getAll({
              level: level,
              id: id,
            });
            setChampionships(data);
          }
        } catch (err: any) {
          setError(
            err?.message || "Erreur lors du chargement des championships",
          );
          setChampionships([]);
        }
        return;
      }
      setChampionships([]);
      setDivision(undefined);
    };
    void loadChampionships();
  }, [level, committeeId, leagueId]);

  // Fetch pools when division is selected
  useEffect(() => {
    const loadPools = async () => {
      if (division && championships.length > 0) {
        try {
          const divisionChampionships = championships.filter(
            (championship: Championship) =>
              String(championship.division) === String(division),
          );

          const poolsPromises = divisionChampionships.map(
            (championship: Championship) =>
              poolsService.getByChampionshipId(championship.id),
          );
          const poolsArrays = await Promise.all(poolsPromises);
          const allPools = poolsArrays.flat();
          setPools(allPools);
        } catch (err: any) {
          setError(err.message);
          setPools([]);
        }
      } else {
        setPools([]);
        setPoolId(undefined);
      }
    };
    void loadPools();
  }, [division, championships]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    level,
    division,
    committeeId,
    leagueId,
    category,
    gender,
    search,
    poolId,
    matchday,
    dateFilter,
  ]);

  // Reset dependent filters when parent changes
  useEffect(() => {
    setCommitteeId(undefined);
    setLeagueId(undefined);
    setDivision(undefined);
    setPoolId(undefined);
  }, [level]);

  useEffect(() => {
    setDivision(undefined);
    setPoolId(undefined);
  }, [committeeId, leagueId]);

  useEffect(() => {
    setPoolId(undefined);
    setMatchday(undefined);
  }, [division]);

  // Handle reset filters
  const handleReset = () => {
    setLevel(CompetitionLevel.ALL);
    setDivision(undefined);
    setCommitteeId(undefined);
    setLeagueId(undefined);
    setPoolId(undefined);
    setMatchday(undefined);
    setCategory(Category.ALL);
    setGender(undefined);
    setSearch("");
    setDateFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
            {tMatches("searchTitle")}
          </h1>

          {/* Filters Section */}
          <MatchesFilters
            search={search}
            setSearch={setSearch}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            category={category}
            setCategory={setCategory}
            gender={gender}
            setGender={setGender}
            level={level}
            setLevel={setLevel}
            committeeId={committeeId}
            setCommitteeId={setCommitteeId}
            leagueId={leagueId}
            setLeagueId={setLeagueId}
            committees={committees}
            leagues={leagues}
            division={division}
            setDivision={setDivision}
            poolId={poolId}
            setPoolId={setPoolId}
            matchday={matchday}
            setMatchday={setMatchday}
            championships={championships}
            pools={pools}
            onReset={handleReset}
          />

          {/* Loading State */}
          {matchesLoading && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {(matchesError || error) && !matchesLoading && (
            <Card variant="default" padding="lg">
              <p className="text-center text-error-DEFAULT dark:text-error-light">
                {matchesError?.message || error}
              </p>
            </Card>
          )}

          {/* Results */}
          {!matchesLoading && !matchesError && !error && (
            <>
              {/* Empty State */}
              {matches.length === 0 ? (
                <Card variant="default" padding="lg">
                  <EmptyState
                    icon={<MagnifyingGlassIcon className="w-16 h-16" />}
                    title={tMatches("noResults")}
                    description={tMatches("tryAdjustingFilters")}
                  />
                </Card>
              ) : (
                <>
                  {/* Matches List */}
                  <div className="space-y-4 mb-6">
                    {matches.map((match: Match) => (
                      <MatchesCard
                        key={match.id}
                        match={match}
                        onClick={(matchId) =>
                          router.push(`/matches/${matchId}`)
                        }
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <Pagination
                      pagination={pagination}
                      pageSize={matchesPerPage}
                      setPageSize={(size: number) => {
                        setMatchesPerPage(size);
                        setCurrentPage(1);
                      }}
                      setPageIndex={(index: number) =>
                        setCurrentPage(index + 1)
                      }
                      label={tMatches("itemLabelPlural")}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
