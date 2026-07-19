// src/backend/common/interceptors/transform.interceptor.ts
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
 * Standard API response structure.
 * Provides consistency across all endpoints.
 */
export interface ApiResponse<T> {
  /**
   * The actual response data
   */
  data: T;

  /**
   * Response metadata (optional)
   */
  meta?: {
    /**
     * Total count of items (useful for pagination)
     */
    count?: number;

    /**
     * Current page (if paginated)
     */
    page?: number;

    /**
     * Items per page (if paginated)
     */
    limit?: number;

    /**
     * Total number of pages (if paginated)
     */
    totalPages?: number;
  };

  /**
   * Timestamp of the response
   */
  timestamp: string;

  /**
   * Request path
   */
  path: string;

  /**
   * HTTP status code
   */
  statusCode: number;
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
 * @example
 * // Apply globally in main.ts
 * app.useGlobalInterceptors(new TransformInterceptor());
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
