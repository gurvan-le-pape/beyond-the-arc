// src/frontend/features/competitions/championships/components/detail/ChampionshipHeader.tsx
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface ChampionshipHeaderProps {
  readonly organizationName: string | undefined;
  readonly championshipName: string;
}

export function ChampionshipHeader({
  organizationName,
  championshipName,
}: ChampionshipHeaderProps) {
  return (
    <Card variant="highlighted" padding="lg">
      <div className="space-y-3">
        {/* Region/Department */}
        <Text variant="overline">{organizationName || ""}</Text>

        <div className="flex justify-between items-start flex-wrap gap-4">
          {/* Championship Name */}
          <Text variant="h1" className="text-xl md:text-2xl">
            {championshipName}
          </Text>
        </div>
      </div>
    </Card>
  );
}

export default ChampionshipHeader;
