// src/frontend/shared/utils/formatNameToFileName.ts
import { normalizeString } from "./normalizeString";

/**
 * Format a name into a file name by normalizing it and replacing spaces and special characters.
 * @param name - The name to format.
 * @returns The formatted file name.
 */
export const formatNameToFileName = (name: string): string => {
  return normalizeString(name)
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9-]/g, "");
};
