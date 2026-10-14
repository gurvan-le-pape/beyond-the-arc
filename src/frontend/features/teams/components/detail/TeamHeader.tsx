// src/frontend/features/teams/components/detail/TeamHeader.tsx
import { ClubMarkLink, EntityHeader } from "@/shared/components/domain";
import { formatTeamName } from "@/shared/utils";

import type { Team } from "../../types/Team";

interface TeamHeaderProps {
  readonly team: Team;
}

/**
 * Identity block at the top of a team detail page: club mark, team name, the
 * team's badges, and a link into its championship.
 */
export function TeamHeader({ team }: TeamHeaderProps) {
  const club = team.club;

  return (
    <EntityHeader
      visual={<ClubMarkLink clubId={club.id} clubName={club.name} />}
      title={formatTeamName(club.name, team.number)}
      category={team.category}
      gender={team.gender}
      championship={team.pool?.championship}
    />
  );
}

export default TeamHeader;
