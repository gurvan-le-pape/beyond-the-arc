// src/frontend/features/site/docs/hooks/useAccordion.ts
import { useCallback, useState } from "react";

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
