// src/frontend/shared/components/primitives/ToggleChips.spec.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ToggleChips } from "./ToggleChips";

const KINDS = [
  { value: "shot", label: "Shots", count: 12 },
  { value: "foul", label: "Fouls", count: 3 },
  { value: "sub", label: "Substitutions" },
] as const;

describe("ToggleChips", () => {
  it("is a named group of toggle buttons pressed by the selection", () => {
    render(
      <ToggleChips
        label="Show"
        options={KINDS}
        selected={new Set(["shot"])}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByRole("toolbar", { name: "Show" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Shots/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /Fouls/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows each chip's count after its label", () => {
    render(
      <ToggleChips
        label="Show"
        options={KINDS}
        selected={new Set()}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /Shots/ })).toHaveTextContent(
      "12",
    );
  });

  it("reports the one chip that changed, on or off", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ToggleChips
        label="Show"
        options={KINDS}
        selected={new Set(["shot", "foul"])}
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Substitutions/ }));
    await user.click(screen.getByRole("button", { name: /Fouls/ }));

    expect(onToggle.mock.calls).toEqual([["sub"], ["foul"]]);
  });

  it("can turn the last chip off: an empty selection is allowed", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ToggleChips
        label="Show"
        options={KINDS}
        selected={new Set(["shot"])}
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Shots/ }));

    expect(onToggle).toHaveBeenCalledExactlyOnceWith("shot");
  });
});
