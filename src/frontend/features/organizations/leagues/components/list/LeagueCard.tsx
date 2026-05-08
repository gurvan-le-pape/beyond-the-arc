// src/frontend/features/organizations/leagues/components/list/LeagueCard.tsx
import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import type { League } from "../../types";

interface LeagueCardProps {
  readonly league: League;
  readonly clubLabel: string;
}

export function LeagueCard({ league, clubLabel }: LeagueCardProps) {
  const router = useRouter();

  return (
    <Card
      variant="default"
      padding="md"
      clickable
      onClick={() => router.push(`/organizations/leagues/${league.id}`)}
      className="border-l-4 border-l-regional hover:border-l-regional-strong"
    >
      <Text variant="h3" className="mb-2">
        {league.name}
      </Text>
      <p className="text-xl font-bold text-regional-strong">
        {league.clubCount}
      </p>
      <Text variant="caption">{clubLabel}</Text>
    </Card>
  );
}
