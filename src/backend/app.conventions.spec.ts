// src/backend/app.conventions.spec.ts
import { PaginationQueryDto } from "@common/dto";
import type { INestApplication } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";
import { ModulesContainer } from "@nestjs/core";
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
});
