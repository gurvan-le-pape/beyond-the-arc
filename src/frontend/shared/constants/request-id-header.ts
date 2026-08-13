// src/frontend/shared/constants/request-id-header.ts

/**
 * The response header carrying the backend's correlation id.
 *
 * Kebab-case because it is a wire vocabulary with a counterpart on the other
 * side — `src/backend/common/constants/request-id-header.ts` — and the two
 * have to agree. Both halves of the dual service layer read it, so it is
 * written once here rather than as a string literal in each.
 */
export const REQUEST_ID_HEADER = "x-request-id";
