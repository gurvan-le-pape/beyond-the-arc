// src/frontend/lib/services/client/api-client.ts
import axios from "axios";

import { parseApiError } from "@/shared/utils";

/**
 * Axios instance for client-side API requests.
 *
 * Configuration:
 * - Base URL: Direct connection to backend (no proxy)
 * - Timeout: 30 seconds
 * - Headers: JSON content type
 * - Interceptors: Response unwrapping and error handling
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Matches your backend CORS config
});

/**
 * Response interceptor to unwrap the standard API response format.
 *
 * Backend returns:
 * {
 *   data: T,
 *   timestamp: string,
 *   path: string,
 *   statusCode: number
 * }
 *
 * This interceptor extracts just the `data` field so services
 * work directly with the actual data type.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap the `data` field from ApiResponse
    if (response.data && "data" in response.data) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  // Normalise every error to ApiError — nothing downstream needs to handle raw axios errors
  (error): Promise<never> => {
    const apiError = parseApiError(error);
    return Promise.reject(apiError);
  },
);

export default apiClient;
