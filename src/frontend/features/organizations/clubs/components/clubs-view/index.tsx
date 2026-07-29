// src/frontend/features/organizations/clubs/components/clubs-view/index.tsx
"use client";

import { useTranslations } from "next-intl";

import { Pagination } from "@/shared/components/navigation";

import { useClubs } from "../../api";
import { useClubsFilterState } from "../../hooks";
import type { ClubBasic } from "../../types/ClubBasic";
import { ClubsFilters } from "./ClubsFilters";
import { ClubsGrid } from "./ClubsGrid";

export function ClubsView() {
  const t = useTranslations("organizations");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useClubsFilterState();
  const { search, leagueId, committeeId, currentPage, pageSize } = filters;

  const { data: clubsData, isLoading } = useClubs({
    leagueId,
    committeeId,
    search: search || undefined,
    page: currentPage,
    limit: pageSize,
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
        filters={filters}
        setters={setters}
        onReset={resetFilters}
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
            pageSize={pageSize}
            setPageSize={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            setPageIndex={(i) => setCurrentPage(i + 1)}
            label={t("clubs.label").toLowerCase()}
          />
        </div>
      )}
    </>
  );
}
