// src/frontend/features/teams/components/TeamListItem.tsx
import { useTranslations } from "next-intl";

import type { ClubTeamInfo } from "@/features/organizations/clubs/types/ClubDetailed";
import { Button } from "@/shared/components/ui";

interface TeamListItemProps {
  team: ClubTeamInfo;
  clubName: string;
  onClick: () => void;
}

export function TeamListItem({ team, clubName, onClick }: TeamListItemProps) {
  const t = useTranslations("teams");

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="w-full h-auto px-6 py-4 flex items-center justify-between..."
    >
      <div className="text-left">
        <p className="font-medium">
          {clubName} {team.number || ""}
        </p>
        {team.pool?.championship && (
          <p className="text-sm text-gray-600">{team.pool.championship.name}</p>
        )}
      </div>

      {team.leaderboards?.[0] && (
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">{t("teamDetail.points")}</p>
            <p className="font-semibold">{team.leaderboards[0].points}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">{t("teamDetail.gamesPlayed")}</p>
            <p className="font-semibold">{team.leaderboards[0].gamesPlayed}</p>
          </div>
        </div>
      )}
    </Button>
  );
}
