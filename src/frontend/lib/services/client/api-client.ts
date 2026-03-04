// src/frontend/lib/services/client/api-client.ts
import axios from "axios";

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
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
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
  (error) => {
    // Enhanced error logging for better debugging
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      const path = error.config?.url;
      console.error("API Error:", {
        status,
        message,
        path,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response
      console.error(
        "Network Error (no response):",
        error.message,
        error.request,
      );
    } else {
      // Something else happened
      console.error("Request Setup Error:", error.message, error);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
