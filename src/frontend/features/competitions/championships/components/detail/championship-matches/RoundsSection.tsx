// src/frontend/features/competitions/championships/components/detail/championship-matches/RoundsSection.tsx
import { useTranslations } from "next-intl";

import type { Match } from "@/features/matches/types";
import { getSortedRounds } from "@/features/matches/utils";
import { Text } from "@/shared/components/typography";

import RoundSelector from "./RoundSelector";

interface RoundsSectionProps {
  readonly groupedMatches: Record<number, Match[]>;
  readonly selectedRound: number | null;
  readonly onSelectRound: (round: number) => void;
}

/**
 * The matchday selector, driven by which rounds actually have fixtures.
 *
 * The round list is derived from `groupedMatches`' keys, so a matchday with no
 * matches simply never appears — there is no empty round to select. Those keys
 * are strings at runtime whatever the type says, which is why they are
 * converted before sorting.
 */
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
