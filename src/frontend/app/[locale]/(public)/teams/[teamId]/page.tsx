// src/frontend/app/[locale]/(public)/teams/[teamId]/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TeamShotChart } from "@/features/charts/components";
import { serverMatchesService } from "@/features/matches/api";
import { serverTeamsService } from "@/features/teams/api";
import {
  TeamHeader,
  TeamMatchHistoryTable,
  TeamRoster,
} from "@/features/teams/components";
import { buildTeamRoster } from "@/features/teams/utils";
import { PerGameStatsPanel } from "@/shared/components/domain";
import { PageLayout } from "@/shared/components/layout";
import { handleServerError, parseRouteId } from "@/shared/utils";

interface TeamDetailPageProps {
  readonly params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { teamId: teamIdStr, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "teams" });

  const teamId = parseRouteId(teamIdStr);

  const [team, matchHistory, matchEvents] = await Promise.all([
    serverTeamsService.getById(teamId),
    serverTeamsService.getMatches(teamId),
    serverMatchesService.getEventsByTeamId(teamId),
  ]).catch(handleServerError);

  const { matches, seasonStats } = matchHistory;

  const rosterPlayers = buildTeamRoster(matches, teamId);

  return (
    <PageLayout>
      {/* Team Header */}
      <TeamHeader team={team} />

      {/* Team Stats */}
      <PerGameStatsPanel stats={seasonStats} />

      {/* Roster */}
      <TeamRoster players={rosterPlayers} />

      {/* Match History */}
      <TeamMatchHistoryTable team={team} matches={matches} maxRows={5} />

      {/* Team Shot Chart Heatmap */}
      <TeamShotChart
        matchEvents={matchEvents}
        title={t("teamDetail.shotchartTitle")}
        description={t("teamDetail.shotchartDescription")}
        isLoading={false}
        error={null}
      />
    </PageLayout>
  );
}
