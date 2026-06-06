// src/frontend/features/competitions/championships/components/detail/championship-matches/rounds-section/_RoundsSection.tsx
import { useTranslations } from "next-intl";

import { getSortedRounds } from "@/features/matches/utils";
import { Text } from "@/shared/components/typography";

import RoundSelector from "./RoundSelector";

interface RoundsSectionProps {
  readonly groupedMatches: Record<number, any[]>;
  readonly selectedRound: number | null;
  readonly onSelectRound: (round: number) => void;
}

export function RoundsSection({
  groupedMatches,
  selectedRound,
  onSelectRound,
}: RoundsSectionProps) {
  const tCompetitions = useTranslations("competitions");

  return (
    <div>
      <Text variant="h3" className="mb-3">
        {tCompetitions("roundsLabel")}
      </Text>
      <RoundSelector
        rounds={getSortedRounds(groupedMatches)}
        selectedRound={selectedRound}
        onSelect={onSelectRound}
        className="mb-0"
      />
    </div>
  );
}
