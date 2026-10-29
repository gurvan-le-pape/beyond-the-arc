// src/frontend/features/organizations/clubs/components/list/club-directory/index.tsx
"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

import { EmptyState, Spinner } from "@/shared/components/feedback";
import { SearchTabShell } from "@/shared/components/navigation";

import { useClubs } from "../../../api";
import type { ClubBasic } from "../../../types/ClubBasic";
import { ClubsFilters } from "./ClubsFilters";
import { ClubsTable } from "./ClubsTable";
import { useClubsFilterState } from "./useClubsFilterState";

function ClubDirectoryContent() {
  const tCommon = useTranslations("common");
  const tOrganizations = useTranslations("organizations");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useClubsFilterState();
  const { search, leagueId, committeeId, currentPage, pageSize } = filters;

  const { data, error, isLoading, refetch } = useClubs({
    leagueId,
    committeeId,
    search: search || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const clubs: ClubBasic[] = data?.items ?? [];
  const pagination = data
    ? {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      }
    : null;

  return (
    <div className="space-y-6">
      <ClubsFilters
        filters={filters}
        setters={setters}
        onReset={resetFilters}
      />

      <SearchTabShell
        isLoading={isLoading}
        error={error}
        errorMessage={tCommon("errors.fetchClubs")}
        onRetry={refetch}
        isEmpty={clubs.length === 0}
        emptyState={
          <EmptyState
            icon={<Users className="w-16 h-16" />}
            title={tCommon("emptyState.clubs")}
            description={tOrganizations("clubs.tryAdjustingFilters")}
          />
        }
        pagination={pagination}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={(index) => setCurrentPage(index + 1)}
        itemLabel={tOrganizations("clubs.itemLabel", {
          count: pagination?.total ?? 0,
        })}
      >
        <ClubsTable clubs={clubs} />
      </SearchTabShell>
    </div>
  );
}

/**
 * The directory of clubs: filters, results table and pagination.
 *
 * Takes no props and owns everything, including its own data — which is why the
 * clubs route needs no server fetch and prerenders as a static shell. The
 * filters live in the query string, and reading it needs a Suspense boundary to
 * keep the route prerendered: the shell carries the loading spinner, and the
 * directory swaps in once the search params are available.
 */
export function ClubDirectory() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      }
    >
      <ClubDirectoryContent />
    </Suspense>
  );
}
