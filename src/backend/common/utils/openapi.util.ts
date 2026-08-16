// src/backend/common/utils/openapi.util.ts
import { METRICS_PATH } from "@common/constants";
import type { INestApplication } from "@nestjs/common";
import type { OpenAPIObject } from "@nestjs/swagger";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/**
 * The two pieces of bootstrap that decide what the OpenAPI document says,
 * declared once for the two callers that need them: `main.ts`, which serves
 * the document at `/api/docs`, and `scripts/generate-openapi.ts`, which writes
 * the committed snapshot.
 *
 * **A second copy held together by a `// Keep in sync with main.ts` comment is
 * not enough here, because nothing can see the disagreement.**
 * `openapi-drift` regenerates the document and diffs it against the committed
 * one — both sides come from the script, so they agree with each other while
 * disagreeing with production. The only witness is the deployed app. A second
 * copy that no test compares is worse than no copy.
 *
 * Scope of the guarantee, stated because it is narrower than "the two
 * bootstraps match": what `SwaggerModule.createDocument` reads is the module
 * graph, the route decorators, the global prefix and the `DocumentBuilder`
 * config. The rest of `main.ts` — CORS, the validation pipe, shutdown hooks,
 * the Pino logger — cannot change the document, so it is deliberately *not*
 * shared. These two functions cover everything that can.
 */

/** The global prefix, exactly as the deployed app applies it. */
export function applyApiPrefix(app: INestApplication): void {
  // `METRICS_PATH`, not a literal "/metrics". Two spellings of one value agree
  // until one of them moves, which is precisely how this class of divergence
  // stays invisible.
  app.setGlobalPrefix("api", { exclude: [METRICS_PATH] });
}

/**
 * The document both callers publish.
 *
 * Takes the app rather than returning a config object so that a caller cannot
 * build the document with a different `DocumentBuilder` by accident — the
 * config is not reachable from outside this function.
 */
export function createOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle("Beyond the Arc API")
    .setDescription(
      "API documentation for a basketball federation management platform, inspired by the FFBB",
    )
    .setVersion("1.0")
    .build();

  return SwaggerModule.createDocument(app, config);
}
