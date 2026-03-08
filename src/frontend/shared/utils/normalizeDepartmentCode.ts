// src/frontend/shared/utils/normalizeDepartmentCode.ts
/**
 * Normalize department code by removing leading zeros
 * Example: "01" -> "1", "2A" -> "2A"
 */
export function normalizeDepartmentCode(code: string): string {
  return code.replace(/^0+/, "");
}
