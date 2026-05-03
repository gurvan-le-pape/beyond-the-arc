// src/frontend/app/[locale]/(public)/organizations/clubs/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

import { useClubs } from "@/features/organizations/clubs/api/use-clubs";
import type { ClubBasic } from "@/features/organizations/clubs/types/ClubBasic";
import { useCommittees } from "@/features/organizations/committees/api/use-committees";
import { useLeagues } from "@/features/organizations/leagues/api/use-leagues";
import { Link } from "@/navigation";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { Pagination } from "@/shared/components/table";
import { Text } from "@/shared/components/typography";
import { useDebounce } from "@/shared/hooks/useDebounce";

const SKELETON_KEYS = Array.from({ length: 12 }, () => crypto.randomUUID());

// ---------------------------------------------------------------------------
// Club Card
// ---------------------------------------------------------------------------
function ClubCard({ club }: { readonly club: ClubBasic }) {
  return (
    <Link
      href={`/organizations/clubs/${club.id}`}
      className="group flex flex-col gap-2 p-4 rounded-card border border-divide border-l-4 border-l-clubs surface-subtle hover:shadow-card-hover hover:scale-[1.01] transition-all duration-200 shadow-card"
    >
      <div className="font-semibold text-text-heading group-hover:text-primary-600 transition-colors duration-200 leading-snug">
        {club.name}
      </div>
      {(club.city || club.zipCode) && (
        <div className="text-sm text-text-secondary">
          {[club.zipCode, club.city].filter(Boolean).join(" · ")}
        </div>
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function OrganizationsClubsPage() {
  const tCommon = useTranslations("common");
  const tOrganizations = useTranslations("organizations");

  const [search, setSearch] = useState("");
  const [leagueId, setLeagueId] = useState<string>("");
  const [committeeId, setCommitteeId] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 50;

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
    limit,
  });

  const clubs = clubsData?.items ?? [];
  const pagination = clubsData
    ? {
        total: clubsData.total,
        page: clubsData.page,
        limit: clubsData.limit,
        totalPages: clubsData.totalPages,
      }
    : null;

  const hasActiveFilters = !!(search || leagueId || committeeId);

  const resetFilters = () => {
    setSearch("");
    setLeagueId("");
    setCommitteeId("");
    setPage(1);
  };

  const breadcrumbItems = [
    { label: tOrganizations("breadcrumb"), href: "/organizations" },
    { label: tOrganizations("clubs.label"), current: true },
  ];

  // Inputs sit inside PageLayout (surface-base), so bg-surface-inset resolves
  // to surface-subtle — one step above the page, correct for form controls.
  const inputClass =
    "text-sm rounded-input border border-divide bg-surface-inset text-text-body placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 ring-offset-surface";

  let gridContent: React.ReactNode;
  if (isLoading) {
    gridContent = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SKELETON_KEYS.map((key) => (
          <div
            key={key}
            className="h-20 rounded-card bg-surface-inset animate-pulse"
          />
        ))}
      </div>
    );
  } else if (clubs.length === 0) {
    gridContent = (
      <div className="text-center py-16 text-text-secondary">
        {tOrganizations("clubs.noResults", { search })}
      </div>
    );
  } else {
    gridContent = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {clubs.map((club: ClubBasic) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    );
  }

  return (
    <PageLayout>
      <Breadcrumb items={breadcrumbItems} />

      <Text variant="h1" className="mb-6">
        {tOrganizations("clubs.label")}
      </Text>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tOrganizations("clubs.searchPlaceholder")}
            className={`${inputClass} pl-9 pr-4 py-2 w-64`}
          />
        </div>

        {/* League filter */}
        <select
          value={leagueId}
          onChange={(e) => setLeagueId(e.target.value)}
          className={`${inputClass} px-3 py-2`}
        >
          <option value="">{tCommon("filters.allLeagues")}</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        {/* Committee filter — only shown when league is selected */}
        {leagueId && (
          <select
            value={committeeId}
            onChange={(e) => setCommitteeId(e.target.value)}
            className={`${inputClass} px-3 py-2`}
          >
            <option value="">{tCommon("filters.allCommittees")}</option>
            {committees.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-heading transition-colors"
          >
            <FaTimes className="text-xs" />
            {tCommon("clearSearch")}
          </button>
        )}
      </div>

      {/* Results count */}
      {!isLoading && pagination && (
        <div className="text-sm text-text-secondary mb-4">
          {pagination.total} {tOrganizations("clubs.label").toLowerCase()}
        </div>
      )}

      {/* Grid */}
      {gridContent}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            pagination={pagination}
            pageSize={limit}
            setPageSize={() => {}}
            setPageIndex={(index) => setPage(index + 1)}
            label={tOrganizations("clubs.label").toLowerCase()}
          />
        </div>
      )}
    </PageLayout>
  );
}
