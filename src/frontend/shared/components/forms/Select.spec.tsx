// src/frontend/shared/components/forms/Select.spec.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ComboBoxOption } from "@/shared/components/primitives";
import type { Category } from "@/shared/constants";

import { Select } from "./Select";

const OPTIONS: ComboBoxOption<Category>[] = [
  { value: undefined, label: "All categories" },
  { value: "U13", label: "U13" },
  { value: "U18", label: "U18" },
];

describe("Select", () => {
  it("shows the selected option's label on a trigger named by its label", () => {
    render(
      <Select<Category>
        label="Category"
        options={OPTIONS}
        value="U18"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /Category/ })).toHaveTextContent(
      "U18",
    );
  });

  it("picks an option with the mouse and reports its value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select<Category>
        label="Category"
        options={OPTIONS}
        value="U18"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Category/ }));
    await user.click(screen.getByRole("option", { name: "U13" }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith("U13");
  });

  it("reports undefined for the option that stands for no value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select<Category>
        label="Category"
        options={OPTIONS}
        value="U18"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Category/ }));
    await user.click(screen.getByRole("option", { name: "All categories" }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(undefined);
  });

  it("is driven by the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select<Category>
        label="Category"
        options={OPTIONS}
        value="U13"
        onChange={onChange}
      />,
    );

    screen.getByRole("button", { name: /Category/ }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalledExactlyOnceWith("U18");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("shows the placeholder when no option stands for the value", () => {
    render(
      <Select<Category>
        label="Category"
        placeholder="Pick one"
        options={OPTIONS.slice(1)}
        value={undefined}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /Category/ })).toHaveTextContent(
      "Pick one",
    );
  });

  it("is named by its placeholder when it has no label", () => {
    render(
      <Select<Category>
        placeholder="Season"
        options={OPTIONS.slice(1)}
        value="U13"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /Season/ })).toBeInTheDocument();
  });

  it("cannot be opened when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Select<Category>
        label="Category"
        options={OPTIONS}
        value="U18"
        onChange={vi.fn()}
        disabled
      />,
    );

    await user.click(screen.getByRole("button", { name: /Category/ }));

    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
