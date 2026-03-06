// src/backend/common/pipes/parse-optional-int.pipe.spec.ts
import { BadRequestException } from "@nestjs/common";

import { ParseOptionalIntPipe } from "./parse-optional-int.pipe";

describe("ParseOptionalIntPipe", () => {
  let pipe: ParseOptionalIntPipe;

  beforeEach(() => {
    pipe = new ParseOptionalIntPipe();
  });

  describe("transform", () => {
    it("should return undefined when value is undefined", () => {
      expect(pipe.transform(undefined)).toBeUndefined();
    });

    it("should return undefined when value is empty string", () => {
      expect(pipe.transform("")).toBeUndefined();
    });

    it("should return parsed integer for valid numeric string", () => {
      expect(pipe.transform("42")).toBe(42);
    });

    it("should return parsed integer for string with leading zeros", () => {
      expect(pipe.transform("007")).toBe(7);
    });

    it("should throw BadRequestException for non-numeric string", () => {
      expect(() => pipe.transform("abc")).toThrow(BadRequestException);
    });

    it("should throw BadRequestException with correct message", () => {
      expect(() => pipe.transform("abc")).toThrow("Invalid number");
    });

    it("should throw BadRequestException for float string", () => {
      expect(() => pipe.transform("3.14")).not.toThrow();
      expect(pipe.transform("3.14")).toBe(3);
    });
  });
});
