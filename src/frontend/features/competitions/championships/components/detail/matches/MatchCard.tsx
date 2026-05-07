// src/frontend/features/competitions/championships/components/detail/matches/MatchCard.tsx
"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import { useMatchesPrefetch, useMatchEvents } from "@/features/matches/api";
import type { Match } from "@/features/matches/types/Match";
import { ErrorMessage } from "@/shared/components/feedback";
import { Badge, Card } from "@/shared/components/primitives";
import { formatMatchDateTime } from "@/shared/utils";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

import MatchDetailsTable from "./MatchDetailsTable";

interface MatchCardProps {
  match: Match;
  expanded: boolean;
  onToggleExpand: (matchId: number) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  expanded,
  onToggleExpand,
}) => {
  const params = useParams();
  const locale = params?.locale as string;
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");

  const {
    data: matchEvents,
    isLoading: isLoadingEvents,
    error: matchEventsError,
  } = useMatchEvents(match.id, { enabled: expanded });

  const prefetch = useMatchesPrefetch();

  const isHomeWinner = match.homeTeamScore > match.awayTeamScore;
  const isAwayWinner = match.awayTeamScore > match.homeTeamScore;
  const hasScores =
    match.homeTeamScore !== null && match.awayTeamScore !== null;

  return (
    <Card padding="sm" className="overflow-hidden">
      {/* Top Row - Date and Status */}
      <div className="flex justify-between items-center mb-2">
        <time className="text-sm text-text-body">
          {formatMatchDateTime(match.date)}
        </time>
        <Badge variant={match.overtime ? "warning" : "outline"} size="sm">
          {match.overtime ? tMatches("finalOT") : tMatches("final")}
        </Badge>
      </div>

      {/* Main Row - Teams and Score */}
      <div className="flex items-center justify-between gap-2">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <img
            src={`/images/clubs/${formatNameToFileName(
              match.homeTeam.club.name ?? "",
            )}.webp`}
            alt={`${match.homeTeam.club.name} logo`}
            className="w-8 h-8 object-contain mb-1"
            loading="lazy"
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).src = `/images/clubs/defaultLogo.30cc7520.svg`;
            }}
          />
          <div
            className={`text-sm text-center w-full ${
              isHomeWinner
                ? "font-bold text-text-heading"
                : "font-normal text-text-body"
            }`}
            title={`${match.homeTeam.club.name} - ${match.homeTeam.number}`}
          >
            <div className="truncate">{match.homeTeam.club.name}</div>
            <div className="text-xs text-text-secondary">
              {match.homeTeam.number}
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center flex-shrink-0 px-2">
          <div className="text-xl font-bold text-text-heading mb-1">
            <span
              className={isHomeWinner ? "text-primary" : "text-text-emphasis"}
            >
              {hasScores ? match.homeTeamScore : "-"}
            </span>
            <span className="mx-1.5 text-text-muted">-</span>
            <span
              className={isAwayWinner ? "text-primary" : "text-text-emphasis"}
            >
              {hasScores ? match.awayTeamScore : "-"}
            </span>
          </div>
          {/* Match Summary Link */}
          <a
            href={`/${locale}/matches/${match.id}`}
            className="text-sm text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface rounded-button"
          >
            Résumé
          </a>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <img
            src={`/images/clubs/${formatNameToFileName(
              match.awayTeam.club.name ?? "",
            )}.webp`}
            alt={`${match.awayTeam.club.name} logo`}
            className="w-8 h-8 object-contain mb-1"
            loading="lazy"
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).src = `/images/clubs/defaultLogo.30cc7520.svg`;
            }}
          />
          <div
            className={`text-sm text-center w-full ${
              isAwayWinner
                ? "font-bold text-text-heading"
                : "font-normal text-text-body"
            }`}
            title={`${match.awayTeam.club.name} - ${match.awayTeam.number}`}
          >
            <div className="truncate">{match.awayTeam.club.name}</div>
            <div className="text-xs text-text-secondary">
              {match.awayTeam.number}
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          type="button"
          onClick={() => onToggleExpand(match.id)}
          onMouseEnter={() => prefetch.events(match.id)}
          aria-expanded={expanded}
          aria-label={
            expanded
              ? tMatches("hideMatchDetails")
              : tMatches("viewMatchDetails")
          }
          className="flex-shrink-0 p-1 rounded-button hover:bg-surface-inset transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-offset-surface"
        >
          {expanded ? (
            <ChevronUpIcon className="h-5 w-5 text-text-body" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-text-body" />
          )}
        </button>
      </div>

      {/* Expandable Section */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-divide animate-slide-down">
          {matchEventsError ? (
            <ErrorMessage message={tCommon("errors.fetchMatchEvents")} />
          ) : (
            <MatchDetailsTable
              match={match}
              matchEvents={matchEvents ?? []}
              isLoadingEvents={isLoadingEvents}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default MatchCard;
