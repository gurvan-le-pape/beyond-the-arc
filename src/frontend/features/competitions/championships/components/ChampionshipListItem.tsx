// src/frontend/features/competitions/championships/components/ChampionshipListItem.tsx
import { Link } from "@/navigation";
import { ChampionshipLabel } from "@/shared/components/domain";

import type { Championship } from "../types/Championship";

interface ChampionshipListItemProps {
  readonly championship: Championship;
}

/**
 * A championship as a row in an organisation's detail page.
 *
 * The organisation page around it already names the league or committee, so
 * the row carries the short label: category, gender and division.
 */
export function ChampionshipListItem({
  championship,
}: ChampionshipListItemProps) {
  return (
    <Link
      href={`/championships/${championship.id}`}
      className="w-full flex items-center justify-start text-left text-sm font-medium py-2.5 px-4 rounded-none border-l-4 border-l-transparent hover:bg-tint-primary hover:border-l-solid-primary transition-all duration-200 focus-ring-inset"
    >
      <ChampionshipLabel
        category={championship.category}
        gender={championship.gender}
        division={championship.division}
      />
    </Link>
  );
}
