// src/frontend/shared/utils/normalizeString.ts
/**
 * Normalize a string by converting it to lowercase and removing diacritical marks (accents).
 * @param input - The string to normalize.
 * @returns The normalized string.
 */
export const normalizeString = (input: string): string => {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "");
};
