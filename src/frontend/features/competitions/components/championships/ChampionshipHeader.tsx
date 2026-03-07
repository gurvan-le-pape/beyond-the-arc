// src/frontend/features/competitions/components/championships/ChampionshipHeader.tsx
import { SwitchGenderButton } from "@/features/competitions/components";
import { Card } from "@/shared/components/ui";
import type { Gender } from "@/shared/constants";

interface ChampionshipHeaderProps {
  regionName: string | undefined;
  championshipName: string;
  gender: Gender | undefined;
  onSwitchGender: () => void;
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
        {/* Region/Department Title */}
        <div className="border-b-2 border-primary-500 dark:border-primary-400 pb-3">
          <h2 className="text-xl text-primary-600 dark:text-primary-400 font-semibold">
            {regionName || ""}
          </h2>
        </div>

        {/* Championship Name & Gender Switch */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {championshipName}
          </h1>
          {gender !== undefined && (
            <SwitchGenderButton gender={gender} onClick={onSwitchGender} />
          )}
        </div>
      </div>
    </Card>
  );
}

export default ChampionshipHeader;
