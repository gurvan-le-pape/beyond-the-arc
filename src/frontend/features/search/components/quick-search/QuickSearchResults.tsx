// src/frontend/features/search/components/quick-search/QuickSearchResults.tsx
"use client";

import { Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  Header,
  type Key,
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "react-aria-components";

import type { ClubBasic } from "@/features/organizations/clubs/types";
import type { Player } from "@/features/players/types";
import type { Team } from "@/features/teams/types";
import { formatTeamName } from "@/shared/utils";

const ROW_BASE =
  "flex gap-x-4 rounded-lg px-3 py-2 cursor-pointer text-sm text-text-heading focus-visible:outline-none data-[focused]:bg-tint-primary data-[focused]:text-ink-primary";

/**
 * A result row: name and detail on one line where there is room, the detail
 * under the name on a phone, so a long city never truncates the name.
 */
const ROW = `${ROW_BASE} flex-col sm:flex-row sm:items-baseline sm:justify-between`;

/**
 * The Explore page's players tab, filtered by the term: where "See all
 * results" leads. `tab` and `q` are the parameters that page already reads.
 */
const exploreHref = (query: string) =>
  `/search?${new URLSearchParams({ tab: "players", q: query }).toString()}`;

interface ResultRowProps {
  /** The row's key and the path it opens. */
  readonly id: string;
  readonly title: string;
  /** A line telling same-named rows apart; a club with no city has none. */
  readonly detail: string | null;
}

function ResultRow({ id, title, detail }: ResultRowProps) {
  return (
    <ListBoxItem id={id} textValue={title} className={ROW}>
      <span className="min-w-0 truncate font-medium">{title}</span>
      {detail && (
        <span className="min-w-0 truncate text-xs text-text-secondary sm:shrink-0">
          {detail}
        </span>
      )}
    </ListBoxItem>
  );
}

interface ResultGroupProps {
  readonly id: string;
  readonly label: string;
  readonly children: ReactNode;
}

function ResultGroup({ id, label, children }: ResultGroupProps) {
  return (
    <ListBoxSection id={id} className="flex flex-col pb-2">
      <Header className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </Header>
      {children}
    </ListBoxSection>
  );
}

interface ExploreRowProps {
  readonly query: string;
}

/** The last row: the same term, opened in Explore to browse with filters. */
function ExploreRow({ query }: ExploreRowProps) {
  const t = useTranslations("search.quick");

  return (
    <ListBoxSection id="explore" className="mt-1 border-t border-divide pt-2">
      <ListBoxItem
        id={exploreHref(query)}
        textValue={t("seeAll", { query })}
        className={`${ROW_BASE} items-center text-ink-primary`}
      >
        <Compass aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="truncate font-medium">{t("seeAll", { query })}</span>
        <span className="ml-auto shrink-0 text-xs text-text-secondary">
          {t("seeAllHint")}
        </span>
      </ListBoxItem>
    </ListBoxSection>
  );
}

interface QuickSearchResultsProps {
  /** The term the rows answer: the debounced one, not what is being typed. */
  readonly query: string;
  readonly clubs: readonly ClubBasic[];
  readonly teams: readonly Team[];
  readonly players: readonly Player[];
  /** Shown in place of the rows when there are none: a prompt, a wait, a miss. */
  readonly emptyMessage: string;
  readonly onNavigate: (href: string) => void;
}

/**
 * The quick search's rows, a group per kind with a heading, and a last row
 * handing the term to Explore. Each row's key is the path it opens, so a pick
 * needs no lookup. Empty groups are left out; with no rows at all the list
 * shows `emptyMessage`.
 */
export function QuickSearchResults({
  query,
  clubs,
  teams,
  players,
  emptyMessage,
  onNavigate,
}: QuickSearchResultsProps) {
  const t = useTranslations("search.quick");
  const tCommon = useTranslations("common");
  const hasRows = clubs.length + teams.length + players.length > 0;

  return (
    <ListBox
      aria-label={t("results")}
      onAction={(key: Key) => onNavigate(String(key))}
      renderEmptyState={() => (
        <p className="px-3 py-6 text-center text-sm text-text-secondary">
          {emptyMessage}
        </p>
      )}
      className="max-h-[min(60vh,28rem)] overflow-y-auto p-2 focus-visible:outline-none"
    >
      {clubs.length > 0 && (
        <ResultGroup id="clubs" label={t("clubs")}>
          {clubs.map((club) => (
            <ResultRow
              key={club.id}
              id={`/organizations/clubs/${club.id}`}
              title={club.name}
              detail={club.city}
            />
          ))}
        </ResultGroup>
      )}
      {teams.length > 0 && (
        <ResultGroup id="teams" label={t("teams")}>
          {teams.map((team) => (
            <ResultRow
              key={team.id}
              id={`/teams/${team.id}`}
              title={formatTeamName(team.club.name, team.number)}
              detail={t("teamDetail", {
                category: team.category,
                gender: tCommon(`gender.${team.gender}`),
              })}
            />
          ))}
        </ResultGroup>
      )}
      {players.length > 0 && (
        <ResultGroup id="players" label={t("players")}>
          {players.map((player) => (
            <ResultRow
              key={player.id}
              id={`/players/${player.id}`}
              title={player.name}
              detail={formatTeamName(player.team.club.name, player.team.number)}
            />
          ))}
        </ResultGroup>
      )}
      {hasRows && <ExploreRow query={query} />}
    </ListBox>
  );
}
