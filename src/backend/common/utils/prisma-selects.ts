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
 *
 * `phone` and `email` are absent for the same reason, and were not:
 * 3,953 numbers and 3,968 addresses of named individuals, enumerable one
 * request at a time over a sequential id space. Nothing renders them.
 */
export const PRESIDENT_SELECT = {
  select: {
    id: true,
    name: true,
  },
} as const;
