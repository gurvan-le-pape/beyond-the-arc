// src/frontend/shared/hooks/useMediaQuery.ts
import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a CSS media query matches, kept current as it changes.
 *
 * The server cannot know the viewport, so the server render and hydration use
 * `serverValue`; a client whose viewport disagrees re-renders straight after
 * hydrating. Pick the `serverValue` whose markup is harmless on every
 * viewport — typically the one CSS already hides where it does not apply.
 *
 * @param query - a media query, e.g. `"(min-width: 768px)"`
 * @param serverValue - the value assumed on the server and during hydration
 * @returns whether `query` matches the current viewport
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = globalThis.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => globalThis.matchMedia(query).matches,
    () => serverValue,
  );
}
