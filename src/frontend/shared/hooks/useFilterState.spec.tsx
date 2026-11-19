// src/frontend/shared/hooks/useFilterState.spec.tsx
import { act, renderHook } from "@testing-library/react";
import { useSyncExternalStore } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { enumParam, intParam, textParam } from "@/shared/utils";

import { useFilterState } from "./useFilterState";

// Next keeps `useSearchParams` in sync with `history.replaceState` by patching
// it. The same arrangement here: replaceState announces the change, and the
// hook re-reads `location.search`, so a `set` round-trips through the real URL.
const URL_CHANGE = "test:urlchange";

vi.mock("next/navigation", () => ({
  useSearchParams: () =>
    new URLSearchParams(
      useSyncExternalStore(
        (notify) => {
          globalThis.addEventListener(URL_CHANGE, notify);
          return () => globalThis.removeEventListener(URL_CHANGE, notify);
        },
        () => globalThis.location.search,
      ),
    ),
}));

const replaceState = globalThis.history.replaceState.bind(globalThis.history);

/** The players list's real shape: a level, then an organiser, then a team. */
const CODECS = {
  level: enumParam(["departmental", "regional"] as const),
  committee: intParam,
  league: intParam,
  team: intParam,
  search: textParam,
};

const CASCADES = {
  level: ["committee", "league"],
  committee: ["team"],
  league: ["team"],
} as const;

function renderFilters(query = "") {
  act(() => globalThis.history.replaceState(null, "", `/players${query}`));
  return renderHook(() => useFilterState(CODECS, CASCADES));
}

const search = () => globalThis.location.search;

describe("useFilterState", () => {
  beforeEach(() => {
    vi.spyOn(globalThis.history, "replaceState").mockImplementation(
      (...args) => {
        replaceState(...args);
        globalThis.dispatchEvent(new Event(URL_CHANGE));
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reads the filters and paging from the query string", () => {
    const { result } = renderFilters("?level=regional&league=4&page=3&size=25");

    expect(result.current.filters).toEqual({
      level: "regional",
      committee: undefined,
      league: 4,
      team: undefined,
      search: undefined,
    });
    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(25);
  });

  it("ignores a value its codec rejects, and defaults the paging", () => {
    const { result } = renderFilters("?level=world&league=abc&size=33&page=0");

    expect(result.current.filters.level).toBeUndefined();
    expect(result.current.filters.league).toBeUndefined();
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(50);
  });

  it("writes a change to the URL and reads it back", () => {
    const { result } = renderFilters();

    act(() => result.current.set({ search: "Le Pape" }));

    expect(search()).toBe("?search=Le+Pape");
    expect(result.current.filters.search).toBe("Le Pape");
  });

  it("clears every filter downstream of a changed one, transitively", () => {
    const { result } = renderFilters(
      "?level=departmental&committee=29&team=8&search=x",
    );

    act(() => result.current.set({ level: "regional" }));

    expect(search()).toBe("?level=regional&search=x");
  });

  it("keeps a dependent the same update sets", () => {
    const { result } = renderFilters("?level=departmental&committee=29&team=8");

    act(() => result.current.set({ level: "regional", league: 4 }));

    expect(result.current.filters).toMatchObject({
      level: "regional",
      league: 4,
      committee: undefined,
      team: undefined,
    });
  });

  it("goes back to page 1 when a filter changes", () => {
    const { result } = renderFilters("?page=4");

    act(() => result.current.set({ search: "x" }));

    expect(result.current.page).toBe(1);
    expect(search()).toBe("?search=x");
  });

  it("leaves page 1 and the default size out of the URL", () => {
    const { result } = renderFilters("?page=2&size=25");

    act(() => result.current.setPage(1));
    expect(search()).toBe("?size=25");

    act(() => result.current.setPageSize(50));
    expect(search()).toBe("");
    expect(globalThis.location.pathname).toBe("/players");
  });

  it("goes back to page 1 when the page size changes", () => {
    const { result } = renderFilters("?page=3");

    act(() => result.current.setPageSize(100));

    expect(search()).toBe("?size=100");
  });

  it("resets every filter but keeps the page size and unrelated parameters", () => {
    const { result } = renderFilters(
      "?tab=regional&level=regional&league=4&search=x&page=2&size=100",
    );

    act(() => result.current.reset());

    expect(search()).toBe("?tab=regional&size=100");
  });

  it("replaces the history entry rather than pushing one", () => {
    const push = vi.spyOn(globalThis.history, "pushState");
    const { result } = renderFilters();
    const before = globalThis.history.length;

    act(() => result.current.set({ search: "x" }));

    expect(push).not.toHaveBeenCalled();
    expect(globalThis.history.length).toBe(before);
  });

  it("builds several updates in one event on each other", () => {
    const { result } = renderFilters();

    act(() => {
      result.current.set({ search: "x" });
      result.current.setPage(2);
    });

    expect(search()).toBe("?search=x&page=2");
  });
});
