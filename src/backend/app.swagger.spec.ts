// src/backend/app.swagger.spec.ts
import { applyApiPrefix, createOpenApiDocument } from "@common/utils";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { AppModule } from "./app.module";

/**
 * Builds the OpenAPI document against the real AppModule — the exact code
 * path main.ts runs at startup. A DTO whose (plugin-generated or manual)
 * schema metadata is broken makes SwaggerModule.createDocument throw, which
 * crashed the backend in production once; this spec turns that class of
 * failure into a CI failure. No database is needed: the app is created but
 * never init'd, so PrismaService never connects.
 */
describe("OpenAPI document generation", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    // main.ts applies the prefix before building the document; so must this.
    applyApiPrefix(app);
  });

  afterAll(async () => {
    // The app was never init'd, so there is nothing to close, but keep the
    // teardown in case init is ever added to this spec.
    await app?.close();
  });

  it("should build the document without throwing", () => {
    // `createOpenApiDocument`, not a `DocumentBuilder` written out here. This
    // spec exists because a broken DTO once made document generation throw at
    // startup — so it has to exercise the call `main.ts` makes, not an
    // approximation of it. It built its own config with a different set of
    // fields and no global prefix, which is the same defect `api-contract 10`
    // is about, one layer down.
    const document = createOpenApiDocument(app);

    expect(Object.keys(document.paths).length).toBeGreaterThan(0);
    expect(document.components?.schemas).toBeDefined();
  });

  it("should not contain untyped object schemas for response DTO properties", () => {
    const document = createOpenApiDocument(app);
    const schemas = document.components?.schemas ?? {};

    // PaginatedResponseDto.items is the single sanctioned generic object
    // array (its element type is a generic parameter).
    const allowed = new Set(["PaginatedResponseDto.items"]);
    const offenders = Object.entries(schemas)
      .flatMap(([name, schema]) => collectBareObjectProps(name, schema))
      .filter((path) => !allowed.has(path));

    expect(offenders).toEqual([]);
  });
});

/**
 * Unwraps array schemas to their element schema.
 */
function unwrapArraySchema(propSchema: object): object {
  if (
    "type" in propSchema &&
    propSchema.type === "array" &&
    "items" in propSchema &&
    typeof propSchema.items === "object" &&
    propSchema.items !== null
  ) {
    return propSchema.items;
  }
  return propSchema;
}

/**
 * True when `additionalProperties` types the values of an open-keyed map.
 *
 * A map whose keys are data — Terminus keys health indicators by indicator
 * name — cannot be described with `properties`, but it is not therefore
 * untyped: `additionalProperties: { $ref: … }` generates
 * `{ [key: string]: HealthIndicatorDto }`, which is exactly as checkable as a
 * named property. `additionalProperties: true` is the opposite and stays an
 * offender — it generates an index signature onto `unknown`, which is the
 * thing this spec exists to reject. `PaginatedResponseDto.items` is the one
 * sanctioned instance of that, and keeps its allowlist entry.
 */
function hasTypedAdditionalProperties(schema: object): boolean {
  if (!("additionalProperties" in schema)) return false;
  const additional = schema.additionalProperties;
  if (typeof additional !== "object" || additional === null) return false;
  return "$ref" in additional || "properties" in additional;
}

/**
 * True when a schema is a bare `type: object` with no shape information.
 */
function isBareObjectSchema(schema: object): boolean {
  return (
    "type" in schema &&
    schema.type === "object" &&
    !("properties" in schema) &&
    !("$ref" in schema) &&
    !("allOf" in schema) &&
    !hasTypedAdditionalProperties(schema)
  );
}

/**
 * Returns `Name.prop` paths of properties documented as bare objects.
 */
function collectBareObjectProps(name: string, schema: unknown): string[] {
  if (typeof schema !== "object" || schema === null) return [];
  if (!("properties" in schema)) return [];

  const properties = (schema.properties ?? {}) as Record<string, unknown>;
  return Object.entries(properties)
    .filter(
      ([, propSchema]) =>
        typeof propSchema === "object" &&
        propSchema !== null &&
        isBareObjectSchema(unwrapArraySchema(propSchema)),
    )
    .map(([prop]) => `${name}.${prop}`);
}
