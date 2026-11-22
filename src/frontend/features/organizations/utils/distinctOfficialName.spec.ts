// src/frontend/features/organizations/utils/distinctOfficialName.spec.ts
import { describe, expect, it } from "vitest";

import { distinctOfficialName } from "./distinctOfficialName";

describe("distinctOfficialName", () => {
  it("drops a name that only repeats the place, across case and accents", () => {
    expect(distinctOfficialName("ARDECHE", "Ardèche")).toBeNull();
    expect(distinctOfficialName("ILE-DE-FRANCE", "Île-de-France")).toBeNull();
  });

  it("keeps a name that says something the place does not", () => {
    expect(distinctOfficialName("SUD", "Provence-Alpes-Côte d'Azur")).toBe(
      "SUD",
    );
  });
});
