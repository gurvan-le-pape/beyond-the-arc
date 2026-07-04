// src/frontend/middleware.ts
import createMiddleware from "next-intl/middleware";

import { routing } from "./navigation";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(fr|en)/:path*",
    String.raw`/((?!robots.txt|sitemap.xml|_next|_vercel|.*\..*).*)`,
  ],
};
