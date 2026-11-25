// src/backend/app.conventions.spec.ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { PaginationQueryDto } from "@common/dto";
import { applyApiPrefix, createOpenApiDocument } from "@common/utils";
import type { INestApplication } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";
import { ModulesContainer } from "@nestjs/core";
import { DECORATORS } from "@nestjs/swagger";
import { Test } from "@nestjs/testing";
import { getMetadataStorage } from "class-validator";

import { AppModule } from "./app.module";
import {
  CATEGORY_LIST,
  COMPETITION_LEVEL_LIST,
  GENDER_LIST,
  METRICS_PATH,
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

/** `$ref` every enveloped response composes onto. */
const ENVELOPE_REF = "#/components/schemas/ApiEnvelopeDto";

interface SuccessResponse {
  path: string;
  status: string;
  schema: unknown;
  responses: Record<string, unknown>;
  pathParams: number;
}

/**
 * Every 2xx in the committed document, with the sibling responses and path
 * parameters of the operation it belongs to.
 *
 * Reads `paths` rather than `components`, because both checks below are about
 * what a *route* declares, not what a DTO looks like.
 */
function successResponses(): SuccessResponse[] {
  const path = resolve(__dirname, "../../docs/openapi.json");
  const document = JSON.parse(readFileSync(path, "utf8")) as {
    paths?: Record<string, Record<string, unknown>>;
  };
  const paths = document.paths ?? {};
  if (Object.keys(paths).length === 0) {
    throw new Error(`No paths found in ${path}`);
  }

  const found: SuccessResponse[] = [];
  for (const [route, operations] of Object.entries(paths)) {
    for (const operation of Object.values(operations)) {
      const op = operation as {
        responses?: Record<string, { content?: Record<string, unknown> }>;
        parameters?: { in?: string }[];
      };
      const responses = op.responses ?? {};
      const pathParams = (op.parameters ?? []).filter(
        (parameter) => parameter.in === "path",
      ).length;

      for (const [status, response] of Object.entries(responses)) {
        if (!status.startsWith("2")) continue;
        found.push({
          path: route,
          status,
          schema:
            (response.content as Record<string, { schema?: unknown }>)?.[
              "application/json"
            ]?.schema ?? null,
          responses,
          pathParams,
        });
      }
    }
  }
  return found;
}

/** Every path key in the committed document. */
function documentedPaths(): string[] {
  const path = resolve(__dirname, "../../docs/openapi.json");
  const document = JSON.parse(readFileSync(path, "utf8")) as {
    paths?: Record<string, unknown>;
  };
  const paths = Object.keys(document.paths ?? {});
  if (paths.length === 0) {
    throw new Error(`No paths found in ${path}`);
  }
  return paths;
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
    // main.ts applies the prefix before building the document; so must this.
    applyApiPrefix(app);
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
  // Everything above this line checks query DTOs; the checks below hold the
  // response-side conventions `CLAUDE.md` credits this file with. What they
  // catch is a route whose decorator names one response DTO while it ships
  // another — `MatchDetailResponseDto` declared on a route returning
  // `MatchResponseDto` — which nothing else in the build notices.
  //
  // Both checks below read the **committed** `docs/openapi.json` rather than
  // a document built in-process. That is deliberate: the `@nestjs/swagger`
  // CLI plugin is configured in `nest-cli.json`, so it runs for `nest build`
  // and **not** under ts-jest — a document built here is missing whatever the
  // plugin infers. The committed file is the artefact that ships, the
  // `contracts` CI job already fails when it is stale, and checking it
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
    // `createOpenApiDocument`, the same call main.ts makes — a locally built
    // DocumentBuilder here would be another copy of the config #529 removed.
    const document = createOpenApiDocument(app);

    const declared = nullableProps(document.components?.schemas ?? {});
    const shipped = nullableProps(committedSchemas());

    // Only one direction is this test's business. The reverse (declared here,
    // absent from the committed file) means the snapshot is stale, which is
    // the `contracts` CI job's and would be a confusing failure to raise here.
    const inferredOnly = [...shipped].filter((p) => !declared.has(p)).sort();

    expect(inferredOnly).toEqual([]);
  });

  it("every documented path carries the global /api prefix, except /metrics", () => {
    // The guard `api-contract 1` did not have. That row shipped a one-line
    // fix — the generator was missing `setGlobalPrefix` — but nothing would
    // notice it going missing again, because the `contracts` CI job regenerates the
    // document and diffs it against the committed one: both sides come from
    // the generator, so they agree with each other while disagreeing with the
    // deployed app. Production was the only witness.
    //
    // #529 removed the duplication that caused it; this is what would catch a
    // recurrence. `/metrics` is excluded from the prefix by `applyApiPrefix`
    // and so is excluded here — the one path that must *not* be prefixed.
    const documented = documentedPaths();
    expect(documented.length).toBeGreaterThan(1);

    const unprefixed = documented.filter(
      (path) => path !== METRICS_PATH && !path.startsWith("/api/"),
    );

    expect(unprefixed).toEqual([]);
    expect(documented).toContain(METRICS_PATH);
  });

  it("every 2xx on an /api route is documented as the response envelope", () => {
    // `TransformInterceptor` wraps every route under the global prefix, and
    // `@SkipTransform` is applied in exactly one place — `/metrics`, which is
    // outside the prefix and serves Prometheus text. So a 2xx documented as a
    // bare DTO describes a body the API does not send, which is what all 34 of
    // them did before #523.
    //
    // The guard #523 deferred: nothing stopped one hand-written
    // `@ApiResponse({ type: Dto })` from undoing the convention for a route,
    // silently, because the document would still look plausible.
    const offenders = successResponses().filter(
      ({ path, schema }) =>
        path !== METRICS_PATH && !JSON.stringify(schema).includes(ENVELOPE_REF),
    );

    expect(offenders.map(({ path, status }) => `${path} ${status}`)).toEqual(
      [],
    );
  });

  it("only by-id endpoints declare a 404; list endpoints return an empty array", () => {
    // The half of the convention neither spec checked. It is checkable now
    // only because #523 made the response *shape* explicit in the document —
    // a 200 carrying `ApiListMetaDto` or `ApiPageMetaDto` is a list, and a
    // list has nothing to 404 on: an unknown id yields the same empty array
    // as a real id with no rows.
    //
    // "Has a path param" is *not* the discriminator: `/api/pools/{poolId}/matches`
    // has one and is still a list — an unknown pool returns 200 with
    // `{"data":[],"meta":{"count":0}}`, never a 404.
    const listsWith404 = successResponses()
      .filter(({ schema }) => {
        const text = JSON.stringify(schema);
        return (
          text.includes("ApiListMetaDto") || text.includes("ApiPageMetaDto")
        );
      })
      .filter(({ responses }) => "404" in responses)
      .map(({ path }) => path);

    expect(listsWith404).toEqual([]);

    // The converse: a single-object route addressed by id must say it can
    // 404, since that is the one shape where an unknown id has no empty
    // answer to give. Routes with no path param (`/api/stats`, the health
    // probes) are excluded — there is no id to miss.
    const byIdWithout404 = successResponses()
      .filter(({ schema }) => {
        const text = JSON.stringify(schema);
        return (
          text.includes(ENVELOPE_REF) &&
          !text.includes("ApiListMetaDto") &&
          !text.includes("ApiPageMetaDto")
        );
      })
      .filter(
        ({ pathParams, responses }) => pathParams > 0 && !("404" in responses),
      )
      .map(({ path }) => path);

    expect(byIdWithout404).toEqual([]);
  });
});
