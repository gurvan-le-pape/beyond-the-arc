// src/frontend/features/competitions/championships/components/ChampionshipListItem.tsx
import { Link } from "@/navigation";

import type { Championship } from "../types/Championship";

interface ChampionshipListItemProps {
  readonly championship: Championship;
}

export function ChampionshipListItem({
  championship,
}: ChampionshipListItemProps) {
  return (
    <Link
      href={`/championships/${championship.id}`}
      className="w-full flex items-center justify-start text-left text-sm font-medium py-2.5 px-4 rounded-none border-l-4 border-l-transparent hover:bg-primary-subtle hover:border-l-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      {championship.name}
    </Link>
  );
}
