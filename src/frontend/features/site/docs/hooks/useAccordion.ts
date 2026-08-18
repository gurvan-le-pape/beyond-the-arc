// src/frontend/features/site/docs/hooks/useAccordion.ts
import { useCallback, useState } from "react";

/**
 * Single-open accordion state.
 *
 * **One section at a time** — opening one closes the rest, and clicking the open
 * one closes it, leaving none. That is the whole reason this is shared state
 * rather than a flag per section.
 *
 * @param initialId - the section open on first render; `null` means all closed
 * @returns a `toggle` for a section id, and an `isActive` predicate
 */
export function useAccordion(initialId: string | null = null) {
  const [activeSection, setActiveSection] = useState<string | null>(initialId);

  const toggle = useCallback((id: string) => {
    setActiveSection((current) => (current === id ? null : id));
  }, []);

  const isActive = useCallback(
    (id: string) => activeSection === id,
    [activeSection],
  );

  return { toggle, isActive };
}
