// src/frontend/shared/components/layout/header/isActivePath.ts

/**
 * Whether `pathname` is inside the section at `href`: an exact match or a
 * path beneath it. The trailing slash is what keeps "/championships/12" in
 * "Championships" without letting "/searchfoo" match "/search".
 *
 * @param pathname - the current locale-free path
 * @param href - a section's root path
 * @returns whether the section is the current one
 */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
