// src/frontend/features/matches/components/detail/player-match-stats/PlayerNameCell.tsx
import { TableCellLink } from "@/shared/components/table";

interface PlayerNameCellProps {
  readonly playerId: number;
  readonly playerName: string;
}

/**
 * Player-name cell in the box score, linking to the player's page.
 *
 * It is a link and not a `<button>` with `router.push`, which is what it used
 * to be: a button is not navigation. It gave no status-bar URL, no
 * middle-click, no open-in-new-tab and no href for a crawler to follow. The box
 * score is `stickyLead` and `wrap={false}`, so it cannot use `getRowHref` — see
 * TableCellLink.
 */
export function PlayerNameCell({ playerId, playerName }: PlayerNameCellProps) {
  return (
    <TableCellLink href={`/players/${playerId}`}>{playerName}</TableCellLink>
  );
}

export default PlayerNameCell;
