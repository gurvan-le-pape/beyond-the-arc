// src/frontend/features/teams/components/detail/TeamHeader.tsx
import { getTranslations } from "next-intl/server";

import { Link } from "@/navigation";
import { ClubLogoLink, EntityHeaderBadges } from "@/shared/components/domain";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { CompetitionLevel } from "@/shared/constants";
import { normalizeString } from "@/shared/utils";

import type { Team } from "../../types/Team";

interface TeamHeaderProps {
  readonly team: Team;
}

/**
 * Identity block at the top of a team detail page: club crest, club name, the
 * badges that identify the team, and a link into its championship.
 *
 * **Requires a fully hydrated team.** It reads `team.club.committee.league.id`
 * without optional chaining, so a team whose club or committee is missing
 * throws rather than degrading. Only the detail response carries that depth —
 * `TeamCard` optional-chains the same path because it renders list data.
 *
 * The championship link appears only for regional and departmental teams, where
 * a league or committee id exists to anchor it; otherwise the name renders
 * unlinked.
 *
 * The card border is a **two-way split on gender**: anything that is not
 * `"female"` — including a missing value — takes the male border. There is no
 * neutral state.
 *
 * An **async server component**: it awaits its own translations, so it cannot be
 * rendered inside a client boundary.
 */
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

  const isFemale = gender?.toLowerCase() === "female";

  return (
    <Card
      variant="custom"
      padding="none"
      className={`overflow-hidden border-2 surface-subtle shadow-card ${
        isFemale ? "border-team-female" : "border-team-male"
      }`}
    >
      <div className="flex items-center gap-3 p-4 sm:gap-5 sm:p-6">
        <ClubLogoLink clubId={clubId} clubName={clubName} />

        <div className="flex-1 min-w-0">
          <Text variant="h1" className="mb-3">
            {clubName}
          </Text>

          <EntityHeaderBadges
            category={category}
            gender={gender}
            championship={championship}
          />

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

        <div className="flex-shrink-0 pl-3 sm:pl-5 border-l border-divide self-stretch flex items-center">
          <span className="text-2xl sm:text-3xl font-bold text-text-secondary">
            #{teamNumber}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default TeamHeader;
