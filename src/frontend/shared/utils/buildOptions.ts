// src/frontend/shared/utils/buildOptions.ts
// Utility function to build dropdown options for tables
// Used by PlayersTable, TeamsTable, etc.
export function buildOptions(
  allLabel: string,
  values: readonly (string | number)[],
) {
  return [
    { value: "", label: allLabel },
    ...values.map((v) => ({ value: String(v), label: String(v) })),
  ];
}
