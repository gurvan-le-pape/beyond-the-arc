// src/frontend/features/matches/utils/forfeitSides.spec.ts
import { describe, expect, it } from "vitest";

import { forfeitSides } from "./forfeitSides";

describe("forfeitSides", () => {
  it("names the home side when it scored 0", () => {
    const home = { name: "Home", score: 0 };
    const away = { name: "Away", score: 20 };

    expect(forfeitSides(home, away)).toEqual({
      forfeiting: home,
      winner: away,
    });
  });

  it("names the away side when it scored 0", () => {
    const home = { name: "Home", score: 20 };
    const away = { name: "Away", score: 0 };

    expect(forfeitSides(home, away)).toEqual({
      forfeiting: away,
      winner: home,
    });
  });
});
