// src/frontend/lib/services/server/server-api-client.ts
import { logger } from "@/shared/utils/logger";
import { parseApiError } from "@/shared/utils/parseApiError";

/**
 * Server-side API client for use in getStaticProps/getStaticPaths/getServerSideProps.
 *
 * IMPORTANT:
 * - DO NOT import this in client-side code!
 * - Use the regular apiClient for client-side requests.
 * - This uses native fetch and absolute URLs.
 *
 * Configuration:
 * - Uses internal Docker service name or localhost
 * - No authentication (internal network)
 * - Simple error handling
 */

/**
 * Base URL for internal API communication.
 * Uses Docker service name in production, localhost in development.
 */
const BASE_URL = process.env.INTERNAL_API_URL || "http://backend:4000";

/**
 * Fetches data from the API server-side.
 * Uses absolute URLs required for Node.js environment.
 *
 * @param endpoint - API endpoint (e.g., '/clubs')
 * @returns Parsed JSON response
 * @throws {Error} If request fails
 */
export async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Parse the backend error body so we get a proper ApiError
      const body = await response.json().catch(() => null);
      throw parseApiError(
        body ?? new Error(`${response.status} ${response.statusText}`),
      );
    }

    const data = await response.json();

    // Unwrap the standard API response format
    return (data && "data" in data ? data.data : data) as T;
  } catch (error) {
    logger.error(error, `Server API: ${url}`);
    throw error; // already an ApiError from parseApiError, or rethrown as-is
  }
}

/**
 * Utility to build query string from params object.
 *
 * @param params - Query parameters
 * @returns Query string (e.g., '?key=value&key2=value2')
 */
export function buildQueryString(
  params?: Record<string, string | number | boolean | undefined> | object,
): string {
  if (!params || Object.keys(params).length === 0) {
    return "";
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  return `?${searchParams.toString()}`;
}
