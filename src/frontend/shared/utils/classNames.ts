// src/frontend/shared/utils/classNames.ts
/**
 * Utility for conditional classNames
 * @param {...(string | false | null | undefined)[]} classes
 * @returns {string}
 */
export function classNames(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}
