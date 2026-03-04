// src/frontend/shared/constants/testIds.ts
export const COMMON_TEST_IDS = {
  table: "entity-table",
  header: (colId: string) => `header-${colId}`,
  errorRow: "error-row",
  retryButton: "retry-button",
  emptyRow: "empty-row",
  cell: (cellId: string) => `cell-${cellId}`,
};

// Entity-specific test IDs
export const PLAYER_TEST_IDS = {
  ...COMMON_TEST_IDS,
  table: "players-table",
  playerRow: (id: string | number) => `player-row-${id}`,
};

export const TEAM_TEST_IDS = {
  ...COMMON_TEST_IDS,
  table: "teams-table",
  teamRow: (id: string | number) => `team-row-${id}`,
};
