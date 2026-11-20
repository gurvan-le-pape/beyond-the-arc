// src/frontend/shared/utils/onPlainClick.spec.ts
import type { MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { onPlainClick } from "./onPlainClick";

function click(modifiers: Partial<MouseEvent> = {}) {
  return {
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    preventDefault: vi.fn(),
    ...modifiers,
  } as unknown as MouseEvent & { preventDefault: ReturnType<typeof vi.fn> };
}

describe("onPlainClick", () => {
  it("runs the action instead of navigating on a plain click", () => {
    const action = vi.fn();
    const event = click();

    onPlainClick(action)(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(action).toHaveBeenCalledOnce();
  });

  it.each(["metaKey", "ctrlKey", "shiftKey", "altKey"] as const)(
    "lets a click with %s follow the link",
    (modifier) => {
      const action = vi.fn();
      const event = click({ [modifier]: true });

      onPlainClick(action)(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(action).not.toHaveBeenCalled();
    },
  );
});
