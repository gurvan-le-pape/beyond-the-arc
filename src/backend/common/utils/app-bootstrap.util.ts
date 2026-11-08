// src/backend/common/utils/app-bootstrap.util.ts
import { UndeclaredQueryGuard } from "@common/guards";
import { type INestApplication, ValidationPipe } from "@nestjs/common";

import { applyApiPrefix } from "./openapi.util";

/**
 * Everything that decides how a request is routed and validated, in one call.
 *
 * `main.ts` is the only production caller. It exists as a function because
 * `app.pipeline.spec.ts` needs the *same* pipeline, and a test that
 * re-declares the global prefix and the `ValidationPipe` options is testing a
 * copy of the application rather than the application — it would keep passing
 * through exactly the change it is there to catch.
 *
 * Same reasoning as `applyApiPrefix`, which was extracted for the OpenAPI
 * script in #529 after a duplicated literal and a constant sat side by side
 * holding the same value: see `openapi.util.ts`.
 *
 * Deliberately excluded, because none of it shapes request handling and all of
 * it needs the environment: CORS (reads the origin allowlist), Swagger, the
 * Pino logger, and `enableShutdownHooks`.
 */
export function configureApp(app: INestApplication): void {
  applyApiPrefix(app);

  // The ValidationPipe below rejects parameters a query DTO does not declare;
  // the guard rejects any parameter on a handler that has no query DTO.
  app.useGlobalGuards(new UndeclaredQueryGuard());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}
