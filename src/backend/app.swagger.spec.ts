// src/backend/app.swagger.spec.ts
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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
  });

  afterAll(async () => {
    // The app was never init'd, so there is nothing to close, but keep the
    // teardown in case init is ever added to this spec.
    await app?.close();
  });

  it("should build the document without throwing", () => {
    const config = new DocumentBuilder()
      .setTitle("Beyond the Arc API")
      .setVersion("1.0")
      .build();

    const document = SwaggerModule.createDocument(app, config);

    expect(Object.keys(document.paths).length).toBeGreaterThan(0);
    expect(document.components?.schemas).toBeDefined();
  });

  it("should not contain untyped object schemas for response DTO properties", () => {
    const config = new DocumentBuilder().setVersion("1.0").build();
    const document = SwaggerModule.createDocument(app, config);
    const schemas = document.components?.schemas ?? {};

    // PaginatedResponseDto.items is the single sanctioned generic object
    // array (its element type is a generic parameter).
    const allowed = new Set(["PaginatedResponseDto.items"]);
    const offenders: string[] = [];

    for (const [name, schema] of Object.entries(schemas)) {
      if (typeof schema !== "object" || !("properties" in schema)) continue;
      for (const [prop, propSchema] of Object.entries(
        schema.properties ?? {},
      )) {
        if (typeof propSchema !== "object" || !("type" in propSchema)) {
          continue;
        }
        const target =
          propSchema.type === "array" &&
          typeof propSchema.items === "object" &&
          propSchema.items !== null
            ? propSchema.items
            : propSchema;
        const isBareObject =
          typeof target === "object" &&
          "type" in target &&
          target.type === "object" &&
          !("properties" in target) &&
          !("$ref" in target) &&
          !("allOf" in target);
        if (isBareObject && !allowed.has(`${name}.${prop}`)) {
          offenders.push(`${name}.${prop}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
