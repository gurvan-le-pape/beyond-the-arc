// src/backend/app.conventions.spec.ts
import { PaginationQueryDto } from "@common/dto";
import type { INestApplication } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";
import { ModulesContainer } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { getMetadataStorage } from "class-validator";

import { AppModule } from "./app.module";
import {
  CATEGORY_LIST,
  COMPETITION_LEVEL_LIST,
  GENDER_LIST,
  MATCH_EVENT_ROLES_LIST,
  MATCH_EVENT_TYPE_LIST,
  POSITION_LIST,
} from "./common/constants";

/**
 * Property names that must always be validated with @IsEnum against the
 * matching constant list wherever they appear on a query DTO.
 */
const ENUM_PROPS: Record<string, readonly string[]> = {
  category: CATEGORY_LIST,
  gender: GENDER_LIST,
  level: COMPETITION_LEVEL_LIST,
  position: POSITION_LIST,
  role: MATCH_EVENT_ROLES_LIST,
  eventType: MATCH_EVENT_TYPE_LIST,
};

interface QueryArg {
  controller: string;
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

  it("enum-named query properties are validated with @IsEnum", () => {
    const offenders: string[] = [];

    for (const { name, cls } of queryDtos) {
      for (const prop of validatedProps(cls)) {
        if (!(prop in ENUM_PROPS)) continue;
        if (!constraintNames(cls, prop).includes("isEnum")) {
          offenders.push(`${name}.${prop}`);
        }
      }
    }

    expect(offenders).toEqual([]);
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
