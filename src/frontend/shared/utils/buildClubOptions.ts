// src/frontend/shared/utils/buildClubOptions.ts
import type { NamedEntity } from "@/shared/types/SelectOption";

export function buildClubOptions(
  clubs: NamedEntity[],
): { value: number; label: string }[] {
  return clubs.map((club) => ({ value: club.id, label: club.name }));
}
