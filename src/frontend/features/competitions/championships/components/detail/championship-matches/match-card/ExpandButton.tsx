// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/ExpandButton.tsx
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { IconButton } from "@/shared/components/primitives";

interface ExpandButtonProps {
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly onMouseEnter: () => void;
}

/**
 * The chevron that opens a match card's box score.
 *
 * `onMouseEnter` is separate from `onToggle` on purpose — it is the prefetch
 * trigger, warming the events query before the click. Wiring both to the same
 * handler loses the head start; omitting `onMouseEnter` makes every expand pay
 * the full round trip.
 */
export function ExpandButton({
  expanded,
  onToggle,
  onMouseEnter,
}: ExpandButtonProps) {
  const tMatches = useTranslations("matches");

  return (
    <IconButton
      size="sm"
      onClick={onToggle}
      onMouseEnter={onMouseEnter}
      aria-expanded={expanded}
      label={
        expanded ? tMatches("hideMatchDetails") : tMatches("viewMatchDetails")
      }
    >
      {expanded ? <ChevronUp /> : <ChevronDown />}
    </IconButton>
  );
}
