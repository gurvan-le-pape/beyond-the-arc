// src/frontend/features/competitions/utils/sortCategories.ts
// Sort categories (U11, U13, U15, etc.)
export const sortCategories = (categories: string[]) => {
  return categories.sort((a, b) => {
    const extractNumber = (cat: string) => {
      const regex = /U(\d+)/;
      const match = regex.exec(cat);
      return match ? Number.parseInt(match[1]) : 999;
    };
    return extractNumber(a) - extractNumber(b);
  });
};
