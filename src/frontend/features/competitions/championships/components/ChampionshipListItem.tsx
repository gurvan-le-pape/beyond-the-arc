// src/frontend/features/competitions/championships/components/ChampionshipListItem.tsx
import { Link } from "@/navigation";

import type { Championship } from "../types/Championship";

interface ChampionshipListItemProps {
  readonly championship: Championship;
}

/**
 * A championship as a row in an organisation's detail page.
 *
 * A championship has no name of its own — the label is assembled from its
 * category, gender and division, so a row missing any of those reads as a
 * partial title rather than as an error.
 */
export function ChampionshipListItem({
  championship,
}: ChampionshipListItemProps) {
  return (
    <Link
      href={`/championships/${championship.id}`}
      className="w-full flex items-center justify-start text-left text-sm font-medium py-2.5 px-4 rounded-none border-l-4 border-l-transparent hover:bg-primary-subtle hover:border-l-primary transition-all duration-200 focus-ring-inset"
    >
      {championship.name}
    </Link>
  );
}
