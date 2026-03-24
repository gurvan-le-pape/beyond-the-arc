// src/frontend/shared/utils/handleServerError.ts
import { notFound } from "next/navigation";

import { ApiError } from "@/shared/types";

export function handleServerError(error: unknown): never {
  if (error instanceof ApiError && error.statusCode === 404) notFound();
  throw error;
}
