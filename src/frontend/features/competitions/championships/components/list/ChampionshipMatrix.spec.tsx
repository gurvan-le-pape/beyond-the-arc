// src/frontend/features/competitions/championships/components/list/ChampionshipMatrix.spec.tsx
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Championship } from "@/features/competitions/championships/types";
import { renderWithIntl } from "@/testing/renderWithIntl";

import { ChampionshipMatrix } from "./ChampionshipMatrix";

function championship(
  id: number,
  overrides: Partial<Championship> & Pick<Championship, "category" | "gender">,
): Championship {
  return {
    id,
    seasonYear: "2026-2027",
    level: "regional",
    division: 1,
    leagueId: 1,
    committeeId: null,
    pools: [],
    ...overrides,
  } as Championship;
}

/** The cell at one category row and gender column, by their visible headers. */
function cell(category: string, gender: "Men" | "Women") {
  const table = screen.getByRole("table");
  const column = within(table)
    .getAllByRole("columnheader")
    .findIndex((header) => header.textContent === gender);
  const row = within(table).getByRole("rowheader", { name: category })
    .parentElement as HTMLElement;
  return within(row).getAllByRole("cell")[column];
}

describe("ChampionshipMatrix", () => {
  it("lays out a row per category and a column per gender", () => {
    renderWithIntl(
      <ChampionshipMatrix
        championships={[]}
        caption="Bretagne"
        tone="regional"
      />,
    );

    expect(screen.getByRole("table", { name: "Bretagne" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("columnheader").map((header) => header.textContent),
    ).toEqual(["Men", "Women"]);
    expect(
      screen.getAllByRole("rowheader").map((header) => header.textContent),
    ).toEqual(["U11", "U13", "U15", "U18", "U21", "Seniors"]);
  });

  it("puts each championship in its own slot, divisions in order", () => {
    renderWithIntl(
      <ChampionshipMatrix
        caption="Bretagne"
        tone="regional"
        championships={[
          championship(3, { category: "U18", gender: "male", division: 2 }),
          championship(4, { category: "U18", gender: "male", division: 1 }),
          championship(5, { category: "Seniors", gender: "female" }),
        ]}
      />,
    );

    const u18Men = within(cell("U18", "Men")).getAllByRole("link");
    expect(u18Men.map((link) => link.getAttribute("href"))).toEqual([
      "/en/championships/4",
      "/en/championships/3",
    ]);
    expect(u18Men[0]).toHaveTextContent("Division 1");
    expect(within(cell("Seniors", "Women")).getByRole("link")).toHaveAttribute(
      "href",
      "/en/championships/5",
    );
  });

  it("shows a dash in a slot with no championship", () => {
    renderWithIntl(
      <ChampionshipMatrix
        caption="Bretagne"
        tone="regional"
        championships={[championship(1, { category: "U11", gender: "male" })]}
      />,
    );

    expect(cell("U11", "Women")).toHaveTextContent("—");
    expect(within(cell("U11", "Women")).queryByRole("link")).toBeNull();
  });

  it("counts pools with the locale's plural", () => {
    const pools = [{ id: 1 }, { id: 2 }] as Championship["pools"];
    const { unmount } = renderWithIntl(
      <ChampionshipMatrix
        caption="Bretagne"
        tone="regional"
        championships={[
          championship(1, { category: "U13", gender: "female", pools }),
        ]}
      />,
    );
    expect(cell("U13", "Women")).toHaveTextContent("2 pools");
    unmount();

    renderWithIntl(
      <ChampionshipMatrix
        caption="Bretagne"
        tone="regional"
        championships={[
          championship(1, { category: "U13", gender: "female", pools }),
        ]}
      />,
      "fr",
    );
    expect(screen.getByRole("link")).toHaveTextContent("2 poules");
  });
});
