// src/frontend/features/site/architecture/components/ArchitectureArrow.tsx
import { ArrowRight } from "lucide-react";

/**
 * The connector between two nodes of the architecture diagram, pointing the way
 * the request or the data flows.
 *
 * The diagram is a column below `lg` and a row from it, so the arrow points
 * down, then right. Purely decorative: the order of the nodes carries the
 * same information for a screen reader.
 */
export function ArchitectureArrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="h-6 w-6 shrink-0 self-center rotate-90 text-text-muted lg:rotate-0"
    />
  );
}
