// src/frontend/shared/components/domain/matches/MatchTeamLabel.tsx
interface MatchTeamLabelProps {
  name: string | null;
  teamId: number;
  currentTeamId: number;
}

/**
 * A team name in a match row, emboldened when it is the team whose page you are
 * on.
 *
 * Emphasis is decided by comparing `teamId` with `currentTeamId`, so both must
 * come from the same id space — passing a club id for either silently produces
 * a row with no emphasis rather than an error.
 *
 * A missing name renders as empty rather than a placeholder, since the row's
 * other side already identifies the fixture.
 */
export function MatchTeamLabel({
  name,
  teamId,
  currentTeamId,
}: MatchTeamLabelProps) {
  return teamId === currentTeamId ? (
    <span className="font-bold">{name ?? ""}</span>
  ) : (
    <span>{name ?? ""}</span>
  );
}
