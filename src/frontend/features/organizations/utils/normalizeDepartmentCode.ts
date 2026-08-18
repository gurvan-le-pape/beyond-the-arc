// src/frontend/features/organizations/utils/normalizeDepartmentCode.ts
/**
 * Normalize department code by removing leading zeros
 * Example: "01" -> "1", "2A" -> "2A"
 *
 * @param code - the department code as stored, possibly zero-padded
 * @returns the code without leading zeros; Corsica's `2A`/`2B` are unaffected, having none
 */
export function normalizeDepartmentCode(code: string): string {
  return code.replace(/^0+/, "");
}
