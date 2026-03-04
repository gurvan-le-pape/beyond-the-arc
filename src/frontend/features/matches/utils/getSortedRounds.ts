// src/frontend/features/matches/utils/getSortedRounds.ts
// Utility to get sorted round numbers from groupedMatches
export const getSortedRounds = (groupedMatches: Record<number, any>) =>
  Object.keys(groupedMatches)
    .map(Number)
    .sort((a, b) => a - b);
