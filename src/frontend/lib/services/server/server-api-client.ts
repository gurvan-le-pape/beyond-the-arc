// src/frontend/lib/services/server/server-api-client.ts
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
      const errorText = await response.text();
      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = await response.json();

    // Unwrap the standard API response format
    if (data && "data" in data) {
      return data.data as T;
    }

    return data as T;
  } catch (error) {
    console.error(`[Server API] Failed to fetch ${url}:`, error);
    throw error;
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
