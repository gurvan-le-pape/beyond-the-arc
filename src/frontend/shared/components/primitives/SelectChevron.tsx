// src/frontend/shared/components/primitives/SelectChevron.tsx
import { cn } from "@/shared/utils";

interface SelectChevronProps {
  /** Rotates the chevron 180° when true. */
  readonly open?: boolean;
  /** Positioning only; size and colour are fixed. */
  readonly className?: string;
}

/**
 * The downward chevron on a select or disclosure control, rotating 180° when
 * `open`.
 *
 * `aria-hidden`, because the control it sits inside owns the expanded state —
 * this must never be the only indication that something is open.
 *
 * `className` positions it; the size, colour and transition are fixed so every
 * such control turns at the same rate.
 */
export function SelectChevron({ open, className = "" }: SelectChevronProps) {
  return (
    <svg
      className={cn(
        "w-3.5 h-3.5 flex-shrink-0 text-text-muted transition-transform duration-200",
        open && "rotate-180",
        className,
      )}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 9-7 7-7-7"
      />
    </svg>
  );
}
