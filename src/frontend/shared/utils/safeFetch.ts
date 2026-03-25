// src/frontend/shared/utils/safeFetch.ts
import { parseApiError } from "./parseApiError";

export async function safeFetch<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok)
    throw parseApiError(new Error(`${response.status} ${response.statusText}`));
  return response.json() as Promise<T>;
}
