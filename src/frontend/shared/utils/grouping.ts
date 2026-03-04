// src/frontend/shared/utils/grouping.ts
import type { Championship } from "@/features/competitions/championships/types/Championship";
import { Category } from "@/shared/constants";

export function groupByCategory<T extends { category?: Category }>(
  items: T[],
  defaultCategory: Category = Category.ALL,
): Partial<Record<Category, T[]>> {
  if (!items) return {};
  return items.reduce((acc: Partial<Record<Category, T[]>>, item: T) => {
    const category = item.category || defaultCategory;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});
}

export function groupByGender<T extends { gender?: string }>(
  items: T[],
): Record<string, T[]> {
  if (!items) return {};
  return items.reduce((acc: Record<string, T[]>, item: T) => {
    const gender = item.gender ?? "unknown";
    if (!acc[gender]) acc[gender] = [];
    acc[gender].push(item);
    return acc;
  }, {});
}

export function groupChampionshipsByCategory(
  championships: Championship[],
): Partial<Record<Category, Championship[]>> {
  return groupByCategory(championships);
}

export function groupChampionshipsByGender(
  championships: Championship[],
): Record<string, Championship[]> {
  return groupByGender(championships);
}

export function groupTeamsByCategory<T extends { category?: Category }>(
  teams: T[],
): Partial<Record<Category, T[]>> {
  return groupByCategory(teams);
}
