// src/frontend/features/competitions/championships/components/detail/ChampionshipHeader.tsx
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import type { Gender } from "@/shared/constants";

import SwitchGenderButton from "./navigation/SwitchGenderButton";

interface ChampionshipHeaderProps {
  readonly regionName: string | undefined;
  readonly championshipName: string;
  readonly gender: Gender | undefined;
  readonly onSwitchGender: () => void;
}

export function ChampionshipHeader({
  regionName,
  championshipName,
  gender,
  onSwitchGender,
}: ChampionshipHeaderProps) {
  return (
    <Card variant="highlighted" padding="lg">
      <div className="space-y-4">
        {/* Championship Name */}
        <Text variant="h1" className="text-lg md:text-xl">
          {championshipName}
        </Text>

        {/* Region/Department */}
        <div className="border-b-2 border-primary-500 dark:border-primary-400 pb-3 flex justify-between items-center flex-wrap gap-4">
          <Text
            variant="h2"
            className="text-primary-600 dark:text-primary-400 text-base"
          >
            {regionName || ""}
          </Text>
          {gender !== undefined && (
            <SwitchGenderButton gender={gender} onClick={onSwitchGender} />
          )}
        </div>
      </div>
    </Card>
  );
}

export default ChampionshipHeader;
