// src/frontend/shared/components/primitives/Switch.spec.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./Switch";

describe("Switch", () => {
  it("is a switch named by its label, reflecting `checked`", () => {
    render(<Switch checked label="Latest first" onCheckedChange={vi.fn()} />);

    expect(screen.getByRole("switch", { name: "Latest first" })).toBeChecked();
  });

  it("toggles from a click on its label", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        checked={false}
        label="Latest first"
        onCheckedChange={onCheckedChange}
      />,
    );

    await user.click(screen.getByText("Latest first"));

    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it("toggles from the space bar", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch checked label="Latest first" onCheckedChange={onCheckedChange} />,
    );

    await user.tab();
    await user.keyboard(" ");

    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(false);
  });
});
