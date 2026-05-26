// src/frontend/shared/utils/formatOrganizationName.ts
export function formatLeagueName(name: string): string {
  return name
    .replace(/REGIONALE /i, "")
    .replace(/ DE BASKET-BALL$/i, "")
    .trim();
}

export function formatCommitteeName(name: string): string {
  return name.replace(/ DE BASKET-BALL$/i, "");
}
