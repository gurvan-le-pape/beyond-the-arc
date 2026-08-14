// src/backend/app.conventions.spec.ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { PaginationQueryDto } from "@common/dto";
import type { INestApplication } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";
import { ModulesContainer } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { DECORATORS } from "@nestjs/swagger/dist/constants";
import { Test } from "@nestjs/testing";
import { getMetadataStorage } from "class-validator";

import { AppModule } from "./app.module";
import {
  CATEGORY_LIST,
  COMPETITION_LEVEL_LIST,
  GENDER_LIST,
} from "./common/constants";

/**
 * Property names that must always be validated with @IsEnum against the
 * matching constant list wherever they appear on a query DTO.
 *
 * The values are the contract, not decoration: the check below compares them
 * against the enum the decorator actually names. Only properties that exist on
 * a query DTO belong here — `position`, `role` and `eventType` were listed and
 * matched none, so half the map asserted nothing.
 */
const ENUM_PROPS: Record<string, readonly string[]> = {
  category: CATEGORY_LIST,
  gender: GENDER_LIST,
  level: COMPETITION_LEVEL_LIST,
};

interface QueryArg {
  controller: string;
  controllerClass: NewableFunction;
  handler: string;
  metatype: unknown;
  pipes: unknown[];
}

/**
 * Returns the @Query() arguments of one controller handler.
 */
function queryArgsOfHandler(
  metatype: NewableFunction,
  handlerName: string,
): QueryArg[] {
  const routeArgs =
    (Reflect.getMetadata(ROUTE_ARGS_METADATA, metatype, handlerName) as
      | Record<string, { index: number; pipes: unknown[] }>
      | undefined) ?? {};
  const paramtypes =
    (Reflect.getMetadata(
      "design:paramtypes",
      metatype.prototype,
      handlerName,
    ) as unknown[]) ?? [];

  return Object.entries(routeArgs)
    .filter(
      ([key]) =>
        Number(key.split(":")[0]) === (RouteParamtypes.QUERY as number),
    )
    .map(([, value]) => ({
      controller: metatype.name,
      controllerClass: metatype,
      handler: handlerName,
      metatype: paramtypes[value.index],
      pipes: value.pipes ?? [],
    }));
}

/**
 * Returns the handler method names defined on a controller prototype.
 */
function handlerNamesOf(metatype: NewableFunction): string[] {
  const prototype = metatype.prototype as Record<string, unknown>;
  return Object.getOwnPropertyNames(prototype).filter(
    (name) => name !== "constructor" && typeof prototype[name] === "function",
  );
}

/**
 * Walks every controller route and returns the @Query() arguments with
 * their declared metatype and inline pipes.
 */
function collectQueryArgs(app: INestApplication): QueryArg[] {
  const modulesContainer = app.get(ModulesContainer);
  const controllers = [...modulesContainer.values()]
    .flatMap((module) => [...module.controllers.values()])
    .map((wrapper) => wrapper.metatype)
    .filter((metatype): metatype is NewableFunction => Boolean(metatype));

  return controllers.flatMap((metatype) =>
    handlerNamesOf(metatype).flatMap((handlerName) =>
      queryArgsOfHandler(metatype, handlerName),
    ),
  );
}

/**
 * Names of the class-validator constraints declared for a property.
 */
function constraintNames(target: NewableFunction, property: string): string[] {
  return getMetadataStorage()
    .getTargetValidationMetadatas(target as never, "", false, false)
    .filter((meta) => meta.propertyName === property)
    .map((meta) => (meta as unknown as { name?: string }).name ?? meta.type);
}

/**
 * The value set an @IsEnum on this property validates against, or null if the
 * property carries no @IsEnum at all.
 *
 * class-validator stores the enum object in `constraints[0]`, which is what
 * makes "validated against the *matching* list" checkable rather than just
 * "validated somehow".
 */
function enumValidatedAgainst(
  target: NewableFunction,
  property: string,
): string[] | null {
  const meta = getMetadataStorage()
    .getTargetValidationMetadatas(target as never, "", false, false)
    .find(
      (m) =>
        m.propertyName === property &&
        ((m as unknown as { name?: string }).name ?? m.type) === "isEnum",
    );

  const declared = meta?.constraints?.[0] as Record<string, string> | undefined;

  return declared ? Object.values(declared) : null;
}

/**
 * Names of the query parameters a handler declares with @ApiQuery.
 *
 * @nestjs/swagger stores each one on the handler function itself under
 * `DECORATORS.API_PARAMETERS`, tagged with the `in` it applies to — so
 * @ApiParam and @ApiBody land in the same array and are filtered out here.
 */
function apiQueryNamesOfHandler(
  metatype: NewableFunction,
  handlerName: string,
): string[] {
  const prototype = metatype.prototype as Record<string, object>;
  const declared =
    (Reflect.getMetadata(DECORATORS.API_PARAMETERS, prototype[handlerName]) as
      | { name?: string; in?: string }[]
      | undefined) ?? [];

  return declared
    .filter((param) => param.in === "query" && typeof param.name === "string")
    .map((param) => param.name as string);
}

/**
 * Property names a DTO class documents to Swagger, including inherited ones.
 *
 * Read from two places on purpose: `@ApiProperty` records the property in
 * `API_MODEL_PROPERTIES_ARRAY` on the prototype that declares it — which does
 * not merge across the prototype chain — and class-validator's storage covers
 * a property that carries validators but no explicit Swagger decorator.
 */
function documentedProps(target: NewableFunction): string[] {
  const names = new Set(validatedProps(target));

  let prototype: object | null = target.prototype as object;
  while (prototype && prototype !== Object.prototype) {
    const declared =
      (Reflect.getOwnMetadata(
        DECORATORS.API_MODEL_PROPERTIES_ARRAY,
        prototype,
      ) as string[] | undefined) ?? [];
    for (const key of declared) names.add(key.replace(/^:/, ""));
    prototype = Object.getPrototypeOf(prototype) as object | null;
  }

  return [...names];
}

/**
 * All property names carrying validation metadata on a DTO class.
 */
function validatedProps(target: NewableFunction): string[] {
  return [
    ...new Set(
      getMetadataStorage()
        .getTargetValidationMetadatas(target as never, "", false, false)
        .map((meta) => meta.propertyName),
    ),
  ];
}

/** The committed contract — the artefact the frontend generates from. */
function committedSchemas(): Record<string, unknown> {
  const path = resolve(__dirname, "../../docs/openapi.json");
  const document = JSON.parse(readFileSync(path, "utf8")) as {
    components?: { schemas?: Record<string, unknown> };
  };
  const schemas = document.components?.schemas;
  // A silently empty read would make both response-side checks vacuous, which
  // is the failure mode this whole section exists to prevent.
  if (!schemas || Object.keys(schemas).length === 0) {
    throw new Error(`No component schemas found in ${path}`);
  }
  return schemas;
}

/** `Name.prop` for every property carrying `nullable: true`. */
function nullableProps(schemas: Record<string, unknown>): Set<string> {
  const found = new Set<string>();
  for (const [name, schema] of Object.entries(schemas)) {
    const properties = (schema as { properties?: Record<string, unknown> })
      .properties;
    for (const [prop, propSchema] of Object.entries(properties ?? {})) {
      if ((propSchema as { nullable?: boolean })?.nullable === true) {
        found.add(`${name}.${prop}`);
      }
    }
  }
  return found;
}

/**
 * `Name.path` for every property documented as an inline object with its own
 * `properties`, rather than a `$ref` to a named class.
 *
 * Recurses through arrays and nested properties so a shape buried two levels
 * down is caught too.
 */
function collectInlineObjectProps(name: string, schema: unknown): string[] {
  const offenders: string[] = [];

  const walk = (node: unknown, path: string): void => {
    if (typeof node !== "object" || node === null) return;
    const shape = node as {
      type?: string;
      items?: unknown;
      properties?: Record<string, unknown>;
    };

    if (shape.type === "array" && shape.items) {
      walk(shape.items, `${path}[]`);
      return;
    }
    if (shape.type === "object" && shape.properties) {
      offenders.push(`${name}.${path}`);
    }
    for (const [key, child] of Object.entries(shape.properties ?? {})) {
      walk(child, `${path}.${key}`);
    }
  };

  const properties = (schema as { properties?: Record<string, unknown> })
    .properties;
  for (const [prop, propSchema] of Object.entries(properties ?? {})) {
    walk(propSchema, prop);
  }
  return offenders;
}

describe("API conventions", () => {
  let app: INestApplication;
  let queryArgs: QueryArg[];
  let queryDtos: { name: string; cls: NewableFunction }[];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    queryArgs = collectQueryArgs(app);

    const primitives = new Set<unknown>([Object, String, Number, Boolean]);
    const seen = new Map<string, NewableFunction>();
    for (const arg of queryArgs) {
      const cls = arg.metatype as NewableFunction | undefined;
      if (cls && !primitives.has(cls)) seen.set(cls.name, cls);
    }
    queryDtos = [...seen.entries()].map(([name, cls]) => ({ name, cls }));
  });

  afterAll(async () => {
    await app?.close();
  });

  it("should find query-taking routes to check", () => {
    expect(queryArgs.length).toBeGreaterThan(0);
    expect(queryDtos.length).toBeGreaterThan(0);
  });

  it("every @Query() argument binds a validated DTO class, not a primitive", () => {
    const primitives = new Set<unknown>([Object, String, Number, Boolean]);
    const offenders = queryArgs
      .filter((arg) => !arg.metatype || primitives.has(arg.metatype))
      .map((arg) => `${arg.controller}.${arg.handler}`);

    expect(offenders).toEqual([]);
  });

  it("no @Query() argument uses inline pipes", () => {
    const offenders = queryArgs
      .filter((arg) => arg.pipes.length > 0)
      .map((arg) => `${arg.controller}.${arg.handler}`);

    expect(offenders).toEqual([]);
  });

  it("no @ApiQuery re-declares a parameter the bound query DTO already documents", () => {
    const offenders: string[] = [];

    for (const arg of queryArgs) {
      const dto = arg.metatype as NewableFunction | undefined;
      if (!dto) continue;

      const documented = new Set(documentedProps(dto));
      for (const name of apiQueryNamesOfHandler(
        arg.controllerClass,
        arg.handler,
      )) {
        if (documented.has(name)) {
          offenders.push(`${arg.controller}.${arg.handler}: ${name}`);
        }
      }
    }

    // The DTO is the single declaration of the query contract. A second one on
    // the controller does not merely duplicate it: @nestjs/swagger merges the
    // explicit parameter over the reflected one key by key, so the decorator
    // silently wins on every field it sets and the DTO's own `example` and
    // `enum` stop reaching the document. That is how `gender` came to be
    // published with `example: "M"` against an enum of `male`/`female`, and
    // how two endpoints published a two-member `level` enum for a DTO that
    // accepts three.
    expect(offenders).toEqual([]);
  });

  it("paginated query DTOs extend PaginationQueryDto", () => {
    const offenders = queryDtos
      .filter(({ cls }) => {
        const props = validatedProps(cls);
        const paginates = props.includes("page") || props.includes("limit");
        return paginates && !(cls.prototype instanceof PaginationQueryDto);
      })
      .map(({ name }) => name);

    expect(offenders).toEqual([]);
  });

  it("enum-named query properties are validated with @IsEnum against the matching constant list", () => {
    const offenders: string[] = [];

    for (const { name, cls } of queryDtos) {
      for (const prop of validatedProps(cls)) {
        const expected = ENUM_PROPS[prop];
        if (!expected) continue;

        const actual = enumValidatedAgainst(cls, prop);
        if (!actual) {
          offenders.push(`${name}.${prop}: no @IsEnum`);
          continue;
        }

        // Compare as sets: @IsEnum takes the enum object, and neither the
        // declaration order nor the key names are part of the contract.
        const same =
          actual.length === expected.length &&
          [...expected].every((value) => actual.includes(value));

        if (!same) {
          offenders.push(
            `${name}.${prop}: @IsEnum validates against [${[...actual].sort().join(", ")}], expected [${[...expected].sort().join(", ")}]`,
          );
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("every property named in ENUM_PROPS exists on at least one query DTO", () => {
    // Otherwise an entry can be added, match nothing, and look enforced.
    const seen = new Set(queryDtos.flatMap(({ cls }) => validatedProps(cls)));
    const dead = Object.keys(ENUM_PROPS).filter((prop) => !seen.has(prop));

    expect(dead).toEqual([]);
  });

  it("query DTO numeric properties use @IsInt, never @IsNumber", () => {
    const offenders: string[] = [];

    for (const { name, cls } of queryDtos) {
      for (const prop of validatedProps(cls)) {
        if (constraintNames(cls, prop).includes("isNumber")) {
          offenders.push(`${name}.${prop}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  // ---------------------------------------------------------------------
  // Response side
  //
  // Everything above this line checks query DTOs. `CLAUDE.md` credits this
  // file with the response-side conventions too, and until now it asserted
  // none of them — the absence `api-contract 2` went through, where a
  // decorator named `MatchDetailResponseDto` for a route shipping
  // `MatchResponseDto` and nothing noticed.
  //
  // Both checks below read the **committed** `docs/openapi.json` rather than
  // a document built in-process. That is deliberate: the `@nestjs/swagger`
  // CLI plugin is configured in `nest-cli.json`, so it runs for `nest build`
  // and **not** under ts-jest — a document built here is missing whatever the
  // plugin infers. The committed file is the artefact that ships, the
  // `openapi-drift` CI job already fails when it is stale, and checking it
  // means these conventions are asserted against what consumers actually get.
  // ---------------------------------------------------------------------

  it("response DTO properties reference real nested classes, never inline object schemas", () => {
    // A nested shape must be its own DTO class, so it lands in
    // `components.schemas` and generates a named frontend type. An inline
    // `{ type: "object", properties: {...} }` describes the same data as an
    // anonymous shape nothing can name or reuse.
    //
    // Distinct from `app.swagger.spec.ts`'s check, which rejects a *bare*
    // `type: object` with no shape at all. An inline object carries
    // `properties`, so it passes that check and fails this one.
    const offenders = Object.entries(committedSchemas()).flatMap(
      ([name, schema]) => collectInlineObjectProps(name, schema),
    );

    expect(offenders).toEqual([]);
  });

  it("nullable response properties say so in @ApiProperty, not via plugin inference", () => {
    // The convention is that the *decorator* states nullability. A property
    // typed `Foo | null` whose `@ApiProperty` omits `nullable: true` still
    // reaches the document marked nullable, because the CLI plugin infers it
    // from the TypeScript type — so the contract is right by accident, and
    // only for as long as the plugin runs.
    //
    // Comparing the two documents is what makes that visible: this one is
    // built without the plugin, the committed one with it. A property nullable
    // there and not here is relying on inference. Three were, when this test
    // was written (`MatchHistoryDto.homeTeamScore`, `.awayTeamScore`,
    // `TeamInfoDto.leaderboard`) — each sitting beside a sibling that did
    // declare it.
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setVersion("1.0").build(),
    );

    const declared = nullableProps(document.components?.schemas ?? {});
    const shipped = nullableProps(committedSchemas());

    // Only one direction is this test's business. The reverse (declared here,
    // absent from the committed file) means the snapshot is stale, which is
    // `openapi-drift`'s job and would be a confusing failure to raise here.
    const inferredOnly = [...shipped].filter((p) => !declared.has(p)).sort();

    expect(inferredOnly).toEqual([]);
  });
});
