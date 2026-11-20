// src/frontend/shared/components/primitives/SegmentedControl.spec.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "./SegmentedControl";

const QUARTERS = [
  { value: "all", label: "All" },
  { value: "q1", label: "Q1" },
  { value: "q2", label: "Q2" },
] as const;

describe("SegmentedControl", () => {
  it("is a radio group named by its label, with the value checked", () => {
    render(
      <SegmentedControl
        label="Quarter"
        options={QUARTERS}
        value="q1"
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("radiogroup", { name: "Quarter" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Q1" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "All" })).not.toBeChecked();
  });

  it("reports a click on another option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Quarter"
        options={QUARTERS}
        value="all"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Q2" }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith("q2");
  });

  it("is one tab stop, and the arrow keys move the selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Quarter"
        options={QUARTERS}
        value="q1"
        onChange={onChange}
      />,
    );

    await user.tab();
    expect(screen.getByRole("radio", { name: "Q1" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith("q2");
  });
});
