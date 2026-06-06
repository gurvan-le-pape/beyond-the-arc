// src/frontend/features/competitions/championships/components/detail/championship-matches/matches-section/match-card/ExpandButton.tsx
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface ExpandButtonProps {
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly onMouseEnter: () => void;
}

export function ExpandButton({
  expanded,
  onToggle,
  onMouseEnter,
}: ExpandButtonProps) {
  const tMatches = useTranslations("matches");

  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={onMouseEnter}
      aria-expanded={expanded}
      aria-label={
        expanded ? tMatches("hideMatchDetails") : tMatches("viewMatchDetails")
      }
      className="flex-shrink-0 p-1 rounded-button hover:bg-surface-inset transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ring-offset-surface"
    >
      {expanded ? (
        <ChevronUp className="h-5 w-5 text-text-body" />
      ) : (
        <ChevronDown className="h-5 w-5 text-text-body" />
      )}
    </button>
  );
}
