// src/frontend/features/matches/utils/formatPlaytime.ts
/**
 * Converts seconds into a "mm:ss" format.
 * @param seconds - The total time in seconds.
 * @returns A string in "mm:ss" format.
 */
export const formatPlaytime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};
