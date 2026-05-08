// src/frontend/features/organizations/clubs/components/list/ClubsView.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCommittees } from "@/features/organizations/committees/api/use-committees";
import { useLeagues } from "@/features/organizations/leagues/api/use-leagues";
import { Pagination } from "@/shared/components/table";
import { useDebounce } from "@/shared/hooks/useDebounce";

import { useClubs } from "../../api/use-clubs";
import type { ClubBasic } from "../../types/ClubBasic";
import { ClubsFilters } from "./ClubsFilters";
import { ClubsGrid } from "./ClubsGrid";

const LIMIT = 50;

export function ClubsView() {
  const t = useTranslations("organizations");

  const [search, setSearch] = useState("");
  const [leagueId, setLeagueId] = useState("");
  const [committeeId, setCommitteeId] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, leagueId, committeeId]);
  useEffect(() => {
    setCommitteeId("");
  }, [leagueId]);

  const { data: leagues = [] } = useLeagues();
  const { data: committees = [] } = useCommittees(
    leagueId ? { leagueId: Number(leagueId) } : undefined,
  );
  const { data: clubsData, isLoading } = useClubs({
    leagueId: leagueId ? Number(leagueId) : undefined,
    committeeId: committeeId ? Number(committeeId) : undefined,
    search: debouncedSearch || undefined,
    page,
    limit: LIMIT,
  });

  const clubs: ClubBasic[] = clubsData?.items ?? [];
  const pagination = clubsData
    ? {
        total: clubsData.total,
        page: clubsData.page,
        limit: clubsData.limit,
        totalPages: clubsData.totalPages,
      }
    : null;

  return (
    <>
      <ClubsFilters
        search={search}
        leagueId={leagueId}
        committeeId={committeeId}
        leagues={leagues}
        committees={committees}
        hasActiveFilters={!!(search || leagueId || committeeId)}
        onSearchChange={setSearch}
        onLeagueChange={setLeagueId}
        onCommitteeChange={setCommitteeId}
        onReset={() => {
          setSearch("");
          setLeagueId("");
          setCommitteeId("");
          setPage(1);
        }}
      />

      {!isLoading && pagination && (
        <p className="text-sm text-text-secondary mb-4">
          {pagination.total} {t("clubs.label").toLowerCase()}
        </p>
      )}

      <ClubsGrid clubs={clubs} isLoading={isLoading} search={search} />

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            pagination={pagination}
            pageSize={LIMIT}
            setPageSize={() => {}}
            setPageIndex={(i) => setPage(i + 1)}
            label={t("clubs.label").toLowerCase()}
          />
        </div>
      )}
    </>
  );
}
