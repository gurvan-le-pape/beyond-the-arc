// src/backend/common/interceptors/transform.interceptor.ts
import { ApiEnvelopeDto, ApiListMetaDto, ApiPageMetaDto } from "@common/dto";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";

import { SKIP_TRANSFORM_KEY } from "./skip-transform.interceptor";

/**
 * What `generateMeta` can produce: always a `count`, plus the three pagination
 * numbers when the payload is a page.
 *
 * `Partial<ApiPageMetaDto>` rather than a union with `ApiPageMetaDto` because
 * the paginated branch reads `page` and `limit` off an untyped payload and
 * computes `totalPages` only when `limit` is set — so at the type level any of
 * the three may be missing, even though every paginated endpoint in the API
 * supplies all three today (`resolvePagination` always defaults them).
 */
type EnvelopeMeta = ApiListMetaDto & Partial<ApiPageMetaDto>;

/**
 * The envelope this interceptor emits, defined in terms of the DTOs that
 * publish it rather than restating their fields.
 *
 * The two used to be independent declarations, and the drift that allows is
 * not hypothetical — it is the whole of `api-contract 5`. This interface
 * described `{ data, meta?, timestamp, path, statusCode }` correctly while the
 * OpenAPI document described the *unwrapped* payload, and nothing connected
 * them, so 34 endpoints published a body the API had never sent. Extending
 * `ApiEnvelopeDto` and building `meta` out of `ApiListMetaDto` /
 * `ApiPageMetaDto` means a field renamed on either side stops compiling here.
 *
 * @see ApiEnvelopeDto — the published counterpart
 * @see ApiEnvelope, ApiEnvelopeList, ApiEnvelopePage in `@common/decorators`
 */
export interface ApiResponse<T> extends ApiEnvelopeDto {
  /** The handler's return value — what the document describes per endpoint. */
  data: T;

  /** Absent entirely on single-object responses; see `generateMeta`. */
  meta?: EnvelopeMeta;
}

/**
 * Interceptor to transform all successful responses into a standard format.
 *
 * Transforms:
 * ```json
 * { "id": 1, "name": "..." }
 * ```
 *
 * Into:
 * ```json
 * {
 *   "data": { "id": 1, "name": "..." },
 *   "meta": { "count": 1 },
 *   "timestamp": "2024-02-05T10:00:00Z",
 *   "path": "/api/championships/1",
 *   "statusCode": 200
 * }
 * ```
 *
 * Applied globally in app.module.ts. It must be registered as a provider
 * rather than with `useGlobalInterceptors(new TransformInterceptor())`: the
 * constructor takes a Reflector, so a hand-built instance throws on the first
 * request. Registering it through APP_INTERCEPTOR is what injects one.
 *
 * @example
 * // app.module.ts
 * providers: [{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor }]
 *
 * @example
 * // Apply to specific controller
 * @UseInterceptors(TransformInterceptor)
 * export class ChampionshipsController { ... }
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) return next.handle();

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: this.generateMeta(data),
        timestamp: new Date().toISOString(),
        path: request.url,
        statusCode: response.statusCode,
      })),
    );
  }

  /**
   * Generates metadata based on the response data.
   *
   * @param data - The response data
   * @returns Metadata object
   */
  private generateMeta(data: T): ApiResponse<T>["meta"] {
    // If data is an array, include count
    if (Array.isArray(data)) {
      return { count: data.length };
    }

    // For paginated responses (if data has pagination info)
    if (
      data &&
      typeof data === "object" &&
      "items" in data &&
      "total" in data
    ) {
      const paginatedData = data as {
        items: unknown[];
        total: number;
        page?: number;
        limit?: number;
      };

      return {
        count: paginatedData.items.length,
        page: paginatedData.page,
        limit: paginatedData.limit,
        totalPages: paginatedData.limit
          ? Math.ceil(paginatedData.total / paginatedData.limit)
          : undefined,
      };
    }

    return undefined;
  }
}
