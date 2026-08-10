// src/frontend/middleware.ts
import createMiddleware from "next-intl/middleware";

import { routing } from "./navigation";

export default createMiddleware(routing);

export const config = {
  // The locale alternation below is the one copy of the locale set that cannot
  // read locales.ts: Next requires `matcher` to be statically analysable and
  // ignores computed values. `npm run check:messages` parses this literal and
  // fails when it does not match the declared list, so adding a locale without
  // touching this line is caught rather than silently unrouted.
  matcher: [
    "/",
    "/(fr|en)/:path*",
    "/((?!robots.txt|sitemap.xml|_next|.*[.].*).*)",
  ],
};
