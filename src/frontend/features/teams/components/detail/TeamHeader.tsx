// src/frontend/features/teams/components/detail/TeamHeader.tsx
import { getTranslations } from "next-intl/server";

import { Link } from "@/navigation";
import { Badge, Card, ImageWithFallback } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { CompetitionLevel } from "@/shared/constants";
import { formatNameToFileName, normalizeString } from "@/shared/utils";

import type { Team } from "../../types/Team";

interface TeamHeaderProps {
  readonly team: Team;
}

export async function TeamHeader({ team }: TeamHeaderProps) {
  const tCommon = await getTranslations("common");
  const tCompetitions = await getTranslations("competitions");

  const club = team.club;
  const clubId = club.id;
  const clubName = club.name;
  const committeeId = club.committee.id;
  const leagueId = club.committee.league.id;
  const teamNumber = team.number;
  const category = team.category;
  const gender = team.gender;
  const championship = team.pool?.championship;

  let competitionUrl: string | null = null;

  if (championship) {
    const level = normalizeString(championship.level);
    let parentId: number | null | undefined = null;
    if (level === CompetitionLevel.DEPARTMENTAL) {
      parentId = committeeId;
    } else if (level === CompetitionLevel.REGIONAL) {
      parentId = leagueId;
    }
    if (parentId) {
      competitionUrl = `/championships/${championship.id}`;
    }
  }

  const clubUrl = `/organizations/clubs/${clubId}`;
  const isFemale = gender?.toLowerCase() === "female";

  return (
    <Card
      variant="custom"
      padding="none"
      className={`overflow-hidden border-2 surface-subtle shadow-card ${
        isFemale ? "border-team-female" : "border-team-male"
      }`}
    >
      <div className="flex items-center gap-5 p-6">
        {/* Club Logo */}
        <Link
          href={clubUrl}
          aria-label={tCommon("club.seeClub", { name: clubName })}
        >
          <button
            type="button"
            className="w-16 h-16 flex-shrink-0 p-0 rounded-card border border-divide bg-surface-inset overflow-hidden flex items-center justify-center"
            tabIndex={-1}
            aria-hidden
          >
            <ImageWithFallback
              src={`/images/clubs/${formatNameToFileName(clubName)}.webp`}
              alt={clubName}
              fallback="/images/clubs/defaultLogo.30cc7520.svg"
              className="w-14 h-14 object-contain"
            />
          </button>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Text variant="h1" className="mb-3">
            {clubName}
          </Text>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Category */}
            <Badge variant="category" size="sm">
              {category}
            </Badge>

            {/* Gender */}
            <Badge
              variant={gender.toLowerCase() as "male" | "female"}
              size="sm"
            >
              {tCommon(`gender.${gender.toLowerCase()}`)}
            </Badge>

            {/* Competition level */}
            {championship?.level && (
              <Badge
                variant={
                  normalizeString(championship.level) as
                    | "departmental"
                    | "regional"
                    | "national"
                }
                size="sm"
              >
                {tCommon(
                  `competition.levels.${normalizeString(
                    championship.level,
                  )}Short`,
                )}
              </Badge>
            )}

            {/* Division */}
            {championship && (
              <Badge variant="division" size="sm">
                {`Div ${championship.division}`}
              </Badge>
            )}
          </div>

          {/* Championship link */}
          {competitionUrl && (
            <Link
              href={competitionUrl}
              aria-label={tCommon("competition.seeCompetition")}
              className="text-sm text-text-secondary hover:text-primary hover:underline"
            >
              {tCompetitions("championship")}
            </Link>
          )}
        </div>

        {/* Team number */}
        <div className="flex-shrink-0 pl-5 border-l border-divide self-stretch flex items-center">
          <span className="text-3xl font-bold text-text-muted">
            #{teamNumber}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default TeamHeader;
