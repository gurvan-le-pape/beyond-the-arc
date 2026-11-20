// src/frontend/shared/utils/positionVariant.spec.ts
import { describe, expect, it } from "vitest";

import { Position } from "@/shared/constants";

import { positionVariant } from "./positionVariant";

describe("positionVariant", () => {
  it("collapses the five positions into guard, forward and centre", () => {
    expect(positionVariant(Position.PG)).toBe("position-g");
    expect(positionVariant(Position.SG)).toBe("position-g");
    expect(positionVariant(Position.SF)).toBe("position-f");
    expect(positionVariant(Position.PF)).toBe("position-f");
    expect(positionVariant(Position.C)).toBe("position-c");
  });

  it("degrades anything unrecognised to the neutral badge", () => {
    expect(positionVariant(undefined)).toBe("default");
    expect(positionVariant("")).toBe("default");
    expect(positionVariant("pg")).toBe("default");
  });
});
