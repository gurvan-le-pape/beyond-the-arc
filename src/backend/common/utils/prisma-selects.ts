// src/backend/common/utils/prisma-selects.ts

/**
 * Prisma select fragments shared across modules.
 *
 * PRESIDENT_SELECT covers the president relation exposed by leagues,
 * committees, and clubs — the shape must stay identical everywhere so
 * PresidentResponseDto keeps matching all three endpoints.
 */
export const PRESIDENT_SELECT = {
  select: {
    id: true,
    name: true,
    phone: true,
    email: true,
    address: true,
    code: true,
  },
} as const;
