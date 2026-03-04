// src/frontend/shared/utils/cn.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with clsx and merges Tailwind classes with tailwind-merge
 *
 * Benefits:
 * - Handles conditional classes
 * - Resolves Tailwind class conflicts (last one wins)
 * - Type-safe with TypeScript
 *
 * @example
 * cn('px-4', 'py-2', condition && 'bg-blue-500')
 * cn('px-4', 'px-6') // px-6 wins (tailwind-merge resolves conflict)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
