// src/backend/common/utils/name-search.util.spec.ts
import { escapeLikePattern, nameContains } from "./name-search.util";

describe("escapeLikePattern", () => {
  it("leaves an ordinary term unchanged", () => {
    expect(escapeLikePattern("Saint-Étienne")).toBe("Saint-Étienne");
  });

  it("escapes the two LIKE wildcards", () => {
    expect(escapeLikePattern("100%")).toBe("100\\%");
    expect(escapeLikePattern("A_S")).toBe("A\\_S");
  });

  it("escapes the escape character itself, first", () => {
    expect(escapeLikePattern("a\\%")).toBe("a\\\\\\%");
  });
});

describe("nameContains", () => {
  it("builds a case-insensitive contains filter on the escaped term", () => {
    expect(nameContains("%")).toEqual({ contains: "\\%", mode: "insensitive" });
  });
});
