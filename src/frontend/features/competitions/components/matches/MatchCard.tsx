// src/frontend/features/competitions/components/matches/MatchCard.tsx
"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import React from "react";

import { MatchDetailsTable } from "@/features/competitions/components";
import { Badge, Card } from "@/shared/components/ui";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

interface MatchCardProps {
  match: any;
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

  const isHomeWinner = match.homeTeamScore > match.awayTeamScore;
  const isAwayWinner = match.awayTeamScore > match.homeTeamScore;
  const hasScores =
    match.homeTeamScore !== null && match.awayTeamScore !== null;

  return (
    <Card padding="sm" className="overflow-hidden">
      {/* Top Row - Date and Status */}
      <div className="flex justify-between items-center mb-2">
        <time className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(match.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        <Badge variant={match.overtime ? "warning" : "default"} size="sm">
          {match.overtime ? "Final/OT" : "Final"}
        </Badge>
      </div>

      {/* Main Row - Teams and Score */}
      <div className="flex items-center justify-between gap-2">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <img
            src={`/images/clubs/${formatNameToFileName(
              match.homeTeam.club.name,
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
                ? "font-bold text-gray-900 dark:text-gray-100"
                : "font-normal text-gray-600 dark:text-gray-400"
            }`}
            title={`${match.homeTeam.club.name} - ${match.homeTeam.number}`}
          >
            <div className="truncate">{match.homeTeam.club.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {match.homeTeam.number}
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center flex-shrink-0 px-2">
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            <span
              className={
                isHomeWinner
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300"
              }
            >
              {hasScores ? match.homeTeamScore : "-"}
            </span>
            <span className="mx-1.5 text-gray-400 dark:text-gray-500">-</span>
            <span
              className={
                isAwayWinner
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300"
              }
            >
              {hasScores ? match.awayTeamScore : "-"}
            </span>
          </div>
          {/* Match Summary Link */}
          <a
            href={`/${locale}/matches/${match.id}`}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-button"
          >
            Résumé
          </a>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <img
            src={`/images/clubs/${formatNameToFileName(
              match.awayTeam.club.name,
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
                ? "font-bold text-gray-900 dark:text-gray-100"
                : "font-normal text-gray-600 dark:text-gray-400"
            }`}
            title={`${match.awayTeam.club.name} - ${match.awayTeam.number}`}
          >
            <div className="truncate">{match.awayTeam.club.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {match.awayTeam.number}
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          type="button"
          onClick={() => onToggleExpand(match.id)}
          aria-expanded={expanded}
          aria-label={
            expanded
              ? "Réduire les détails du match"
              : "Afficher les détails du match"
          }
          className="flex-shrink-0 p-1 rounded-button hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        >
          {expanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Expandable Section */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
          <MatchDetailsTable match={match} />
        </div>
      )}
    </Card>
  );
};

export default MatchCard;
