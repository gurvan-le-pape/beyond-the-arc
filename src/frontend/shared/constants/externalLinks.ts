// src/frontend/shared/constants/externalLinks.ts

/**
 * Off-site destinations — the author's contact details and the project's own
 * public URLs. Kept in one place because they appear in the footer, the
 * contact page and the docs page, and drifting copies are hard to spot.
 */

export const CONTACT_EMAIL = "gurvan.lepape@hotmail.fr";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export const GITHUB_PROFILE_URL = "https://github.com/gurvan-le-pape";
export const GITHUB_REPO_URL = `${GITHUB_PROFILE_URL}/beyond-the-arc`;
export const GITHUB_CLONE_URL = `${GITHUB_REPO_URL}.git`;

export const LINKEDIN_URL = "https://linkedin.com/in/gurvan-le-pape";

/**
 * Swagger UI, which the backend serves at `/docs` — a sibling of the `/api`
 * base path, not a child of it. The fallback mirrors the client API base in
 * `lib/services/client/api-client.ts`: without one, an unset
 * `NEXT_PUBLIC_API_URL` inlines as the literal string "undefined" at build
 * time and renders a broken `undefined/docs` link.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const API_DOCS_URL = `${API_BASE_URL.replace(/\/api\/?$/, "")}/docs`;
