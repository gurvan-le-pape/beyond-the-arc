// src/frontend/shared/components/primitives/MultiSelect.spec.tsx
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { MultiSelect } from "./MultiSelect";

const LABELS = {
  summary: (count: number) =>
    count === 0 ? "Players" : `Players, ${count} selected`,
  close: "Close",
  clear: "Clear all",
};

interface HarnessProps {
  readonly initial?: number[];
}

/** Two teams' players, checked state held the way the match page holds it. */
function Harness({ initial = [] }: HarnessProps) {
  const [picked, setPicked] = useState(new Set(initial));
  const toggle = (id: number) =>
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const item = (id: number, label: string) => ({
    id,
    label,
    checked: picked.has(id),
    onToggle: () => toggle(id),
  });

  return (
    <MultiSelect
      label="Players"
      selectedCount={picked.size}
      onClear={() => setPicked(new Set())}
      labels={LABELS}
      columns={[
        { title: "Brest", items: [item(1, "Le Gall"), item(2, "Kerjean")] },
        { title: "Rennes", items: [item(3, "Morvan")] },
      ]}
    />
  );
}

describe("MultiSelect", () => {
  it("names its trigger with the selection count", () => {
    render(<Harness initial={[1, 3]} />);

    expect(
      screen.getByRole("button", { name: "Players, 2 selected" }),
    ).toBeInTheDocument();
  });

  it("opens a dialog of checkboxes grouped by column", async () => {
    const user = userEvent.setup();
    render(<Harness initial={[3]} />);

    await user.click(screen.getByRole("button", { name: /Players/ }));

    const dialog = screen.getByRole("dialog", { name: "Players" });
    const rennes = within(dialog).getByRole("group", { name: "Rennes" });
    expect(
      within(rennes).getByRole("checkbox", { name: "Morvan" }),
    ).toBeChecked();
    expect(
      within(dialog).getByRole("checkbox", { name: "Le Gall" }),
    ).not.toBeChecked();
  });

  it("toggles a player and updates the count", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Players" }));
    await user.click(screen.getByRole("checkbox", { name: "Kerjean" }));

    expect(screen.getByRole("checkbox", { name: "Kerjean" })).toBeChecked();
    expect(
      screen.getByRole("button", { name: "Players, 1 selected", hidden: true }),
    ).toBeInTheDocument();
  });

  it("offers Clear all only with a selection, and keeps focus in the panel after it", async () => {
    const user = userEvent.setup();
    render(<Harness initial={[1, 2]} />);

    await user.click(screen.getByRole("button", { name: /Players/ }));
    await user.click(screen.getByRole("button", { name: "Clear all" }));

    expect(screen.queryByRole("button", { name: "Clear all" })).toBeNull();
    for (const box of screen.getAllByRole("checkbox")) {
      expect(box).not.toBeChecked();
    }
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Players" });

    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
    // React Aria restores focus once the popover has unmounted.
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
