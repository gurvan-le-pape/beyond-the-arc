// src/frontend/shared/components/primitives/ComboBox.spec.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ComboBox, type ComboBoxProps } from "./ComboBox";

const CLUBS = [
  { value: 1, label: "Brest Basket" },
  { value: 2, label: "Quimper UJAP" },
  { value: 3, label: "Rennes Basket" },
];

const LABELS = {
  clear: "Clear club",
  loading: "Searching…",
  empty: "No club found",
  typeToSearch: "Type a club name",
};

const field = () => screen.getByRole("combobox", { name: "Club" });

type HarnessProps = Partial<ComboBoxProps<number>> & {
  readonly initial?: number;
  readonly onChange?: (value: number | undefined) => void;
  readonly onSearchChange?: (search: string) => void;
};

/**
 * A caller as the app writes one: the search runs "server-side" over
 * `CLUBS`, and the chosen club's name is kept beside its id.
 */
function Harness({
  initial,
  onChange,
  onSearchChange,
  ...props
}: HarnessProps) {
  const [value, setValue] = useState<number | undefined>(initial);
  const [search, setSearch] = useState("");
  const options = CLUBS.filter((club) =>
    club.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <ComboBox<number>
        label="Club"
        placeholder="All clubs"
        options={options}
        value={value}
        selectedLabel={CLUBS.find((club) => club.value === value)?.label}
        onChange={(next) => {
          setValue(next);
          onChange?.(next);
        }}
        onSearchChange={(next) => {
          setSearch(next);
          onSearchChange?.(next);
        }}
        labels={LABELS}
        {...props}
      />
      {/* Somewhere to click away to. While the list is open React Aria hides
          everything outside it from the accessibility tree, so a test finds
          this by its text rather than its role. */}
      <button type="button">elsewhere</button>
    </>
  );
}

describe("ComboBox", () => {
  it("searches as you type and picks a result", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.type(field(), "basket");
    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["Brest Basket", "Rennes Basket"]);

    await user.click(screen.getByRole("option", { name: "Rennes Basket" }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(3);
    expect(field()).toHaveValue("Rennes Basket");
  });

  it("is driven by the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.type(field(), "quim");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalledExactlyOnceWith(2);
    expect(field()).toHaveValue("Quimper UJAP");
  });

  it("puts the chosen club back when the field is left mid-search", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSearchChange = vi.fn();
    render(
      <Harness
        initial={1}
        onChange={onChange}
        onSearchChange={onSearchChange}
      />,
    );

    await user.clear(field());
    await user.type(field(), "ren");
    await user.click(screen.getByText("elsewhere"));

    expect(field()).toHaveValue("Brest Basket");
    expect(onSearchChange).toHaveBeenLastCalledWith("");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clears the value when the field is left empty", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial={1} onChange={onChange} />);

    await user.clear(field());
    await user.click(screen.getByText("elsewhere"));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(undefined);
    expect(field()).toHaveValue("");
  });

  it("clears the value from the ✕ button, which only shows while one is set", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial={2} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Clear club" }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(undefined);
    expect(field()).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Clear club" })).toBeNull();
  });

  it("says why the list is empty: loading, failed, or no match", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness isLoading />);

    await user.type(field(), "zzz");
    expect(screen.getByRole("listbox")).toHaveTextContent("Searching…");

    rerender(<Harness error="Search failed" />);
    expect(screen.getByRole("listbox")).toHaveTextContent("Search failed");

    rerender(<Harness />);
    expect(screen.getByRole("listbox")).toHaveTextContent("No club found");
  });

  it("asks for typing before a search when it is not browsable", async () => {
    const user = userEvent.setup();
    render(<Harness browsable={false} options={[]} />);

    await user.type(field(), " ");

    expect(screen.getByRole("listbox")).toHaveTextContent("Type a club name");
  });
});
