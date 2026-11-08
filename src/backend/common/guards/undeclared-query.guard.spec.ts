// src/backend/common/guards/undeclared-query.guard.spec.ts
import type { ExecutionContext } from "@nestjs/common";
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";

import { UndeclaredQueryGuard } from "./undeclared-query.guard";

class FiltersDto {
  search?: string;
}

@Controller("things")
class ThingsController {
  @Get()
  list(@Query() _query: FiltersDto): void {}

  @Get(":id")
  byId(@Param("id") _id: string): void {}

  @Get("all")
  all(): void {}
}

function contextFor(
  handler: keyof ThingsController,
  query: Record<string, string>,
): ExecutionContext {
  return {
    getType: () => "http",
    getClass: () => ThingsController,
    getHandler: () => ThingsController.prototype[handler],
    switchToHttp: () => ({ getRequest: () => ({ query }) }),
  } as unknown as ExecutionContext;
}

describe("UndeclaredQueryGuard", () => {
  const guard = new UndeclaredQueryGuard();

  it("lets a handler with a query DTO receive parameters", () => {
    // The DTO's own whitelist is the ValidationPipe's job, not this guard's.
    expect(guard.canActivate(contextFor("list", { search: "x" }))).toBe(true);
  });

  it("allows a bare URL on a handler with no query DTO", () => {
    expect(guard.canActivate(contextFor("all", {}))).toBe(true);
    expect(guard.canActivate(contextFor("byId", {}))).toBe(true);
  });

  it("rejects any parameter on a handler with no query DTO", () => {
    expect(() => guard.canActivate(contextFor("all", { a: "1" }))).toThrow(
      BadRequestException,
    );
    // A @Param is not a @Query: the route still declares no query string.
    expect(() => guard.canActivate(contextFor("byId", { a: "1" }))).toThrow(
      BadRequestException,
    );
  });

  it("names every rejected parameter the way the ValidationPipe does", () => {
    try {
      guard.canActivate(contextFor("all", { a: "1", b: "2" }));
      throw new Error("expected a rejection");
    } catch (error) {
      expect((error as BadRequestException).getResponse()).toMatchObject({
        message: ["property a should not exist", "property b should not exist"],
      });
    }
  });

  it("ignores non-HTTP contexts", () => {
    const rpc = { getType: () => "rpc" } as unknown as ExecutionContext;
    expect(guard.canActivate(rpc)).toBe(true);
  });
});
