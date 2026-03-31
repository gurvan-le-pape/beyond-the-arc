// src/frontend/features/competitions/components/championships/ChampionshipListItem.tsx

import { NavButton } from "@/shared/components/primitives/Button";

import type { Championship } from "../../championships/types/Championship";

interface ChampionshipListItemProps {
  championship: Championship;
  onClick: () => void;
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
