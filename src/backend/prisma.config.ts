// src/backend/prisma.config.ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // `?? ""` rather than an assertion, and that is not an oversight. This
    // file is loaded by every Prisma CLI command, and `prisma generate` needs
    // no datasource — it runs in `npm run build` and `npm test`, both of which
    // CI executes with `DATABASE_URL` unset. Throwing here would fail the
    // `Backend – Build` and `Backend – Tests` jobs.
    //
    // The commands that *do* need a real URL (`migrate deploy`, `migrate dev`)
    // fail on their own when it is empty. The application's own guard is in
    // `prisma/prisma.service.ts`, where a connection is opened.
    url: process.env.DATABASE_URL ?? "",
  },
});
