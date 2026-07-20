// src/frontend/features/matches/components/detail/player-match-stats/PlayerNameCell.tsx
"use client";

interface PlayerNameCellProps {
  readonly playerId: number;
  readonly playerName: string;
  readonly onNavigate: (id: number) => void;
}

/** Player-name table cell that navigates to the player's page on click. */
export function PlayerNameCell({
  playerId,
  playerName,
  onNavigate,
}: PlayerNameCellProps) {
  return (
    <button
      type="button"
      className="cursor-pointer hover:text-primary bg-transparent border-none p-0 m-0 font-inherit text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ring-offset-surface rounded"
      onClick={() => onNavigate(playerId)}
    >
      {playerName}
    </button>
  );
}

export default PlayerNameCell;
