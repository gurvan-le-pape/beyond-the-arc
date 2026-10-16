// src/backend/common/utils/name-search.util.ts

/**
 * Escapes the characters LIKE treats as wildcards (`%`, `_`) and its escape
 * character (`\`), so a search term matches literally.
 *
 * Prisma's `contains` becomes `ILIKE '%' || term || '%'` without escaping the
 * term, so unescaped, a search for `%` matches every row and `_` any single
 * character. PostgreSQL's default LIKE escape is the backslash.
 *
 * @param term - The raw search term
 * @returns The term with `\`, `%` and `_` escaped
 */
export function escapeLikePattern(term: string): string {
  return term.replace(/[\\%_]/g, (char) => `\\${char}`);
}

/**
 * The Prisma filter for a case-insensitive name search: the column contains
 * the term, matched literally.
 *
 * @param term - The raw search term
 * @returns A string filter for a `where` clause
 */
export function nameContains(term: string) {
  return { contains: escapeLikePattern(term), mode: "insensitive" as const };
}
