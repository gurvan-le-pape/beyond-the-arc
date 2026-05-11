// src/frontend/shared/components/domain/matches/MatchTeamLabel.tsx
interface MatchTeamLabelProps {
  name: string | null;
  teamId: number;
  currentTeamId: number;
}

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
