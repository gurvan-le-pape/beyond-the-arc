// src/frontend/features/competitions/championships/components/detail/ChampionshipListItem.tsx

import { NavButton } from "@/shared/components/primitives/Button";

import type { Championship } from "../../types/Championship";

interface ChampionshipListItemProps {
  readonly championship: Championship;
  readonly onClick: () => void;
}

export function ChampionshipListItem({
  championship,
  onClick,
}: ChampionshipListItemProps) {
  return (
    <NavButton
      variant="listItem"
      size="auto"
      className="py-2.5 px-4 text-sm"
      onClick={onClick}
    >
      {championship.name}
    </NavButton>
  );
}
