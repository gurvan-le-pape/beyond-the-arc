// src/backend/common/guards/undeclared-query.guard.ts
import {
  BadRequestException,
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";
import type { Request } from "express";

/**
 * Rejects a query string on a route whose handler declares no `@Query()`.
 *
 * A handler that binds a query DTO already refuses undeclared parameters: the
 * global `ValidationPipe` runs with `forbidNonWhitelisted`. A handler with no
 * `@Query()` never reaches that check, so it would answer `?anything=1` with
 * 200. On a cached route that matters, because the cache key is the full URL:
 * every distinct junk parameter would store another copy of the same body, and
 * `/clubs/all` (~670 KB) times `CACHE_MAX_ENTRIES` is ~340 MB. This guard makes
 * such a route answer exactly one URL, with the same 400 the validated routes
 * return.
 *
 * Guards run before interceptors and pipes, so a rejected request is never
 * cached and never reaches the handler.
 */
@Injectable()
export class UndeclaredQueryGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== "http") return true;

    const names = Object.keys(
      context.switchToHttp().getRequest<Request>().query,
    );
    if (names.length === 0 || this.declaresQuery(context)) return true;

    throw new BadRequestException(
      names.map((name) => `property ${name} should not exist`),
    );
  }

  /**
   * Whether the handler binds `@Query()`. Nest records each parameter
   * decorator under `ROUTE_ARGS_METADATA` on the controller class, keyed by
   * method name, as `"<RouteParamtypes>:<index>"`.
   */
  private declaresQuery(context: ExecutionContext): boolean {
    const args: Record<string, unknown> | undefined = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      context.getClass(),
      context.getHandler().name,
    );
    return Object.keys(args ?? {}).some((key) =>
      key.startsWith(`${RouteParamtypes.QUERY}:`),
    );
  }
}
