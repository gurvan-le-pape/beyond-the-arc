// src/backend/common/utils/prisma-selects.ts

/**
 * Prisma select fragments shared across modules.
 *
 * PRESIDENT_SELECT covers the president relation exposed by leagues,
 * committees, and clubs — the shape must stay identical everywhere so
 * PresidentResponseDto keeps matching all three endpoints.
 *
 * The API is public and unauthenticated, so this select lists only the
 * fields a screen renders. `address` and `code` are deliberately absent:
 * no screen shows them, and `address` would turn a scrape refresh into a
 * silent disclosure of 4,071 volunteers' postal addresses.
 */
export const PRESIDENT_SELECT = {
  select: {
    id: true,
    name: true,
    phone: true,
    email: true,
  },
} as const;
