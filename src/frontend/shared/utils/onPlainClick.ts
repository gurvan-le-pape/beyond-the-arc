// src/frontend/shared/utils/onPlainClick.ts
import type { MouseEvent } from "react";

/**
 * A link's click handler that runs `action` in place of the navigation, for a
 * link that changes the page it sits on. A click with a modifier key still
 * follows the link, so it opens in a new tab or window as usual.
 *
 * @param action - what a plain click does instead of navigating
 * @returns the handler for the link's `onClick`
 */
export function onPlainClick(action: () => void) {
  return (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    action();
  };
}
