// src/backend/common/pipes/parse-entity-id.pipe.spec.ts
import type { ArgumentMetadata } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";

import { ParseEntityIdPipe } from "./parse-entity-id.pipe";

describe("ParseEntityIdPipe", () => {
  const pipe = new ParseEntityIdPipe();
  const metadata: ArgumentMetadata = { type: "param", data: "id" };

  it("parses an ordinary id", async () => {
    await expect(pipe.transform("42", metadata)).resolves.toBe(42);
  });

  it("accepts the int4 bounds themselves", async () => {
    await expect(pipe.transform("2147483647", metadata)).resolves.toBe(
      2147483647,
    );
    await expect(pipe.transform("-2147483648", metadata)).resolves.toBe(
      -2147483648,
    );
  });

  // The defect this pipe exists for: these parse cleanly under ParseIntPipe,
  // reach Postgres, and come back as a Prisma ValueOutOfRange — a 500 and a
  // Sentry event from an anonymous GET.
  it.each(["2147483648", "-2147483649", "99999999999"])(
    "rejects %s as a bad request rather than letting it reach the database",
    async (value) => {
      await expect(pipe.transform(value, metadata)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it("does not echo the value back in the message", async () => {
    await expect(pipe.transform("2147483648", metadata)).rejects.toThrow(
      /Route parameter "id" is outside the supported id range/,
    );
  });

  it("still rejects a non-numeric id, as ParseIntPipe did", async () => {
    await expect(pipe.transform("abc", metadata)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
