// src/backend/prisma/prisma.service.spec.ts
import { PrismaService } from "./prisma.service";

/**
 * The invariant here is a *refusal*, and a refusal is exactly the kind of
 * behaviour that regresses silently: remove the guard and nothing fails, the
 * process just goes back to starting successfully against libpq's defaults at
 * 127.0.0.1:5432 and reporting a database outage the first time a request
 * arrives.
 *
 * `onModuleInit` rather than the constructor is itself part of the contract —
 * `app.conventions.spec.ts` and `app.swagger.spec.ts` compile the whole
 * application with no `DATABASE_URL`, so construction has to stay pure.
 */
describe("PrismaService", () => {
  const original = process.env.DATABASE_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = original;
  });

  it("constructs without DATABASE_URL, so metadata-only specs can compile the app", () => {
    delete process.env.DATABASE_URL;

    expect(() => new PrismaService()).not.toThrow();
  });

  it.each([
    ["unset", undefined],
    ["empty", ""],
  ])("refuses to initialise when DATABASE_URL is %s", async (_label, value) => {
    if (value === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = value;

    const service = new PrismaService();

    await expect(service.onModuleInit()).rejects.toThrow(
      /DATABASE_URL is not set/,
    );
  });

  it("initialises once DATABASE_URL is set, even with nothing listening", async () => {
    process.env.DATABASE_URL = "postgresql://u:p@127.0.0.1:5432/db";

    const service = new PrismaService();

    // This resolves. `$connect()` opens nothing eagerly through
    // `@prisma/adapter-pg`, which is the whole reason the missing variable was
    // invisible until a request arrived — so it is also the control for the
    // two cases above: they reject on the guard, not on a failed connection.
    await expect(service.onModuleInit()).resolves.toBeUndefined();

    await service.onModuleDestroy();
  });
});
