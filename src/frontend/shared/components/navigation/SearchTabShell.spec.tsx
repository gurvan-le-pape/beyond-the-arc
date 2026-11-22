// src/frontend/shared/components/navigation/SearchTabShell.spec.tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { PaginatedResponse } from "@/shared/types";
import { renderWithIntl } from "@/testing/renderWithIntl";

import { SearchTabShell } from "./SearchTabShell";

function page(
  overrides: Partial<PaginatedResponse<string>> = {},
): PaginatedResponse<string> {
  return {
    items: ["a", "b"],
    total: 60,
    page: 2,
    limit: 25,
    totalPages: 3,
    ...overrides,
  };
}

function renderShell(
  data: PaginatedResponse<string> | undefined,
  onPageChange = vi.fn(),
  state: { isLoading?: boolean; error?: unknown } = {},
) {
  renderWithIntl(
    <SearchTabShell
      query={{
        data,
        isLoading: state.isLoading ?? false,
        error: state.error ?? null,
        refetch: vi.fn(),
      }}
      errorMessage="Could not load"
      emptyState="Nothing here"
      pageSize={25}
      onPageSizeChange={vi.fn()}
      onPageChange={onPageChange}
      itemLabel="items"
    >
      <p>results</p>
    </SearchTabShell>,
  );
  return onPageChange;
}

describe("SearchTabShell", () => {
  it("shows the empty state before the query has run", () => {
    renderShell(undefined);

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.queryByText("results")).not.toBeInTheDocument();
  });

  it("shows the empty state when the query returns no item", () => {
    renderShell(page({ items: [], total: 0, page: 1, totalPages: 0 }));

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("shows the error over any data", () => {
    renderShell(page(), vi.fn(), { error: new Error("boom") });

    expect(screen.getByText("Could not load")).toBeInTheDocument();
    expect(screen.queryByText("results")).not.toBeInTheDocument();
  });

  it("reports pages one-based, as the API counts them", async () => {
    const user = userEvent.setup();
    const onPageChange = renderShell(page());

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);

    await user.click(screen.getByRole("button", { name: "First page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });

  it("hides the pagination when everything fits on one page", () => {
    renderShell(page({ page: 1, totalPages: 1, total: 2 }));

    expect(screen.getByText("results")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next page" }),
    ).not.toBeInTheDocument();
  });

  it("goes back to the first page from a page past the last one", () => {
    const onPageChange = renderShell(
      page({ items: [], page: 9, totalPages: 3 }),
    );

    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.queryByText("Nothing here")).not.toBeInTheDocument();
  });
});
