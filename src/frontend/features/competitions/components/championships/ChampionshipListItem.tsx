// src/frontend/features/competitions/components/championships/ChampionshipListItem.tsx
import { Button } from "@/shared/components/ui";

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
    <Button
      variant="listItem"
      size="auto"
      className="py-2.5 px-4 text-sm text-gray-700 dark:text-gray-300"
      onClick={onClick}
    >
      {championship.name}
    </Button>
  );
}
