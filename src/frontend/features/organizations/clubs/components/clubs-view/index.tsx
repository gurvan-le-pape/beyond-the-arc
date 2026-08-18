// src/frontend/features/organizations/clubs/components/clubs-view/index.tsx
"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { SearchTabShell } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";

import { useClubs } from "../../api";
import { useClubsFilterState } from "../../hooks";
import type { ClubBasic } from "../../types/ClubBasic";
import { ClubCard } from "./ClubCard";
import { ClubsFilters } from "./ClubsFilters";

// `ClubCard` is a wide horizontal card, so it pairs up from `md` rather than
// from `xl` — hence a local grid instead of `LIST_ENTITY_CARD_GRID`.
const CLUBS_GRID = "grid grid-cols-1 md:grid-cols-2 gap-4";

/**
 * The clubs list page: filters, results grid and pagination.
 *
 * Takes no props and owns everything, including its own data — which is why the
 * clubs route needs no server fetch and prerenders as a static shell.
 */
export function ClubsView() {
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
        <div className={CLUBS_GRID}>
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </SearchTabShell>
    </div>
  );
}
