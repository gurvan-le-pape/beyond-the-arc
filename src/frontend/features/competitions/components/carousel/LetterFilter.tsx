// src/frontend/features/competitions/components/carousel/LetterFilter.tsx
import { cn } from "@/shared/utils/cn";

interface LetterFilterProps {
  availableLetters: string[];
  selectedLetter: string | null;
  onSelectLetter: (letter: string | null) => void;
}

/**
 * LetterFilter
 *
 * Alphabetical filter pills for quick navigation.
 * Includes "All" option to clear filter.
 */
export function LetterFilter({
  availableLetters,
  selectedLetter,
  onSelectLetter,
}: LetterFilterProps) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {/* "All" pill */}
      <button
        type="button"
        onClick={() => onSelectLetter(null)}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-semibold",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          "dark:focus:ring-offset-gray-800",
          selectedLetter === null
            ? ["bg-primary-600 dark:bg-primary-500", "text-white", "shadow-sm"]
            : [
                "bg-gray-100 dark:bg-gray-700",
                "text-gray-700 dark:text-gray-300",
                "hover:bg-gray-200 dark:hover:bg-gray-600",
              ],
        )}
      >
        Tous
      </button>

      {/* Letter pills */}
      {availableLetters.map((letter) => (
        <button
          key={letter}
          type="button"
          onClick={() => onSelectLetter(letter)}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            "text-xs font-semibold transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            "dark:focus:ring-offset-gray-800",
            selectedLetter === letter
              ? [
                  "bg-primary-600 dark:bg-primary-500",
                  "text-white",
                  "shadow-sm",
                  "scale-110",
                ]
              : [
                  "bg-gray-100 dark:bg-gray-700",
                  "text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-200 dark:hover:bg-gray-600",
                  "hover:scale-105",
                ],
          )}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
