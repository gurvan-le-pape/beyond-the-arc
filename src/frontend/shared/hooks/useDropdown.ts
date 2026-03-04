// src/frontend/shared/hooks/useDropdown.ts
import type { RefObject } from "react";
import { useEffect, useState } from "react";

/**
 * Custom hook for dropdown open/close logic
 * @template T extends string
 * @param {T[]} dropdownKeys
 * @param {Record<T, RefObject<HTMLDivElement>>} refs
 * @returns {{ openDropdown: T | null, setOpenDropdown: (key: T | null) => void }}
 */
export function useDropdown<T extends string>(
  dropdownKeys: T[],
  refs: Record<T, RefObject<HTMLDivElement | null>>,
) {
  const [openDropdown, setOpenDropdown] = useState<T | null>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openDropdown &&
        refs[openDropdown]?.current &&
        !refs[openDropdown]?.current?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, refs]);
  return { openDropdown, setOpenDropdown };
}
