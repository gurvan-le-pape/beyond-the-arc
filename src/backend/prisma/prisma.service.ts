// src/backend/prisma/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/prisma/client";

/**
 * Reads `DATABASE_URL`, and refuses to start without it.
 *
 * There is no sensible default for *where the database is*, and the failure
 * without this check is worse than a crash rather than milder than one.
 * Measured on the built backend with the variable unset: the process starts,
 * maps all 35 routes and logs "Nest application successfully started". Nothing
 * fails until a request arrives, and what surfaces then is
 *
 *   Can't reach database server at `127.0.0.1:5432`
 *
 * — because `PrismaPg` falls through to libpq's defaults when the connection
 * string is `undefined`. That message names a host nothing configured and
 * never mentions `DATABASE_URL` at all, so it reads as a database outage
 * rather than as missing configuration. Worse on a host that *does* run a
 * local Postgres, where it is a silent connection to the wrong database.
 *
 * An empty string is not a value either: it is what `?? ""` produces, and it
 * fails the same way.
 *
 * Two places it deliberately does *not* run:
 *
 * - **`prisma.config.ts`**, which reads the same variable. That file is loaded
 *   by every Prisma CLI command, including `prisma generate`, which needs no
 *   datasource and runs inside `npm run build` and `npm test` — both of which
 *   CI executes with `DATABASE_URL` unset. Asserting there fails
 *   `Backend – Build` and `Backend – Tests`.
 * - **The constructor.** `app.conventions.spec.ts` and `app.swagger.spec.ts`
 *   compile the whole application to introspect its routes and its OpenAPI
 *   document; they never connect to anything, and they too run with the
 *   variable unset. Constructing the provider stays pure, and the check runs
 *   in `onModuleInit`, which is where a connection is actually opened and
 *   which Nest calls during bootstrap — before the application reports that it
 *   started.
 */
function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. The backend cannot start without a database " +
        "connection string; set it in the environment (compose passes it from " +
        "the repository-root .env). Refusing to fall back to libpq defaults, " +
        "which would silently target 127.0.0.1:5432.",
    );
  }
  return url;
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly client: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    requireDatabaseUrl();
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
