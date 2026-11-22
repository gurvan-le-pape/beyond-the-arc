// src/frontend/features/organizations/clubs/components/list/club-directory/index.tsx
"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

import { useCommittees } from "@/features/organizations/committees/api";
import { useLeagues } from "@/features/organizations/leagues/api";
import { normalizeDepartmentCode } from "@/features/organizations/utils";
import { EmptyState, Spinner } from "@/shared/components/feedback";
import { SearchTabShell } from "@/shared/components/navigation";

import { useClubs } from "../../../api";
import type { ClubBasic } from "../../../types/ClubBasic";
import { ClubsFilters } from "./ClubsFilters";
import { ClubsMap } from "./ClubsMap";
import { type ClubPlaces, ClubsTable } from "./ClubsTable";
import { useClubsFilterState } from "./useClubsFilterState";

function ClubDirectoryContent() {
  const tCommon = useTranslations("common");
  const tOrganizations = useTranslations("organizations");

  const { filters, set, page, pageSize, setPage, setPageSize } =
    useClubsFilterState();
  const query = useClubs({
    leagueId: filters.league,
    committeeId: filters.committee,
    search: filters.q,
    page,
    limit: pageSize,
  });

  const { data: committees = [] } = useCommittees();
  const { data: leagues = [] } = useLeagues();
  const places: ClubPlaces = {
    committees: Object.fromEntries(
      committees.map((c) => [
        c.id,
        `${normalizeDepartmentCode(c.department.code)} · ${c.department.name}`,
      ]),
    ),
    leagues: Object.fromEntries(leagues.map((l) => [l.id, l.region.name])),
  };

  const clubs: ClubBasic[] = query.data?.items ?? [];

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-start">
      {/* The finding column: search, location filters and the map that
          drives them, kept in view while the results scroll. */}
      <div className="lg:sticky lg:top-24 space-y-6">
        <ClubsFilters filters={filters} set={set} />
        <ClubsMap committees={committees} filters={filters} set={set} />
      </div>

      <div className="space-y-4">
        {/* Polite: a new count is read once typing settles, not per keystroke. */}
        <p
          className="text-sm font-medium text-text-secondary min-h-5"
          aria-live="polite"
        >
          {query.data &&
            tOrganizations("clubs.resultCount", { count: query.data.total })}
        </p>

        <SearchTabShell
          query={query}
          errorMessage={tCommon("errors.fetchClubs")}
          emptyState={
            <EmptyState
              icon={<Users className="w-16 h-16" />}
              title={tCommon("emptyState.clubs")}
              description={tOrganizations("clubs.tryAdjustingFilters")}
            />
          }
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onPageChange={setPage}
          itemLabel={tOrganizations("clubs.itemLabel", {
            count: query.data?.total ?? 0,
          })}
        >
          <ClubsTable clubs={clubs} places={places} />
        </SearchTabShell>
      </div>
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
