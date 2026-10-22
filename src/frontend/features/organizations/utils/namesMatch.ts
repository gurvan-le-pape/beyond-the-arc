// src/frontend/features/organizations/utils/namesMatch.ts
/**
 * Whether two spellings name the same place, ignoring case, accents,
 * punctuation and spacing: `"ARDECHE"` matches `"Ardèche"`, `"SUD"` does not
 * match `"Provence-Alpes-Côte d'Azur"`.
 *
 * @param a - one spelling, typically the federation's capitalised name
 * @param b - the other, typically the geography name
 * @returns true when both fold to the same letters and digits
 */
export function namesMatch(a: string, b: string): boolean {
  return fold(a) === fold(b);
}

function fold(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}
