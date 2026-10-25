// src/frontend/shared/utils/urlStateCodec.spec.ts
import { describe, expect, it } from "vitest";

import {
  dateParam,
  decodeUrlState,
  encodeUrlState,
  enumParam,
  intParam,
  pageSizeParam,
  textParam,
} from "./urlStateCodec";

const codecs = {
  q: textParam,
  club: intParam,
  gender: enumParam(["male", "female"] as const),
};

describe("decodeUrlState", () => {
  it("reads each coded key and ignores the others", () => {
    expect(
      decodeUrlState(
        new URLSearchParams("q=mar&club=12&gender=female&tab=players"),
        codecs,
      ),
    ).toEqual({ q: "mar", club: 12, gender: "female" });
  });

  it("treats absent and rejected values as not set", () => {
    expect(
      decodeUrlState(new URLSearchParams("q=&club=0&gender=other"), codecs),
    ).toEqual({ q: undefined, club: undefined, gender: undefined });
    expect(decodeUrlState(new URLSearchParams("club=1.5"), codecs).club).toBe(
      undefined,
    );
  });
});

describe("encodeUrlState", () => {
  it("sets, replaces and removes only the keys in the update", () => {
    const next = encodeUrlState(
      new URLSearchParams("tab=players&q=mar&club=12"),
      codecs,
      { q: "martin", club: undefined, gender: "male" },
    );
    expect(Object.fromEntries(next)).toEqual({
      tab: "players",
      q: "martin",
      gender: "male",
    });
  });

  it("drops an empty text value instead of writing q=", () => {
    expect(
      encodeUrlState(new URLSearchParams("q=mar"), codecs, {
        q: "",
      }).toString(),
    ).toBe("");
  });

  it("does not modify its input", () => {
    const params = new URLSearchParams("q=mar");
    encodeUrlState(params, codecs, { q: "x" });
    expect(params.toString()).toBe("q=mar");
  });
});

describe("dateParam", () => {
  it("accepts a YYYY-MM-DD day and rejects anything else", () => {
    expect(dateParam.parse("2026-10-10")).toBe("2026-10-10");
    expect(dateParam.parse("10/10/2026")).toBeUndefined();
  });
});

describe("pageSizeParam", () => {
  it("accepts an offered page size and rejects anything else", () => {
    expect(pageSizeParam.parse("25")).toBe(25);
    expect(pageSizeParam.parse("100")).toBe(100);
    expect(pageSizeParam.parse("200")).toBeUndefined();
    expect(pageSizeParam.parse("30")).toBeUndefined();
    expect(pageSizeParam.parse("abc")).toBeUndefined();
  });
});
