// src/frontend/app/robots.ts
import type { MetadataRoute } from "next";

/**
 * The `robots.txt` Next generates for the site.
 *
 * Allows everything — the dataset is public and there is nothing to hide from a
 * crawler. Pages that should not be indexed say so themselves through their own
 * metadata, `ServerErrorState` being the one that does.
 *
 * The sitemap URL is built from `FRONTEND_URL`, so an unset variable yields
 * `undefined/sitemap.xml` rather than failing the build.
 *
 * @returns the robots rules Next serialises to `/robots.txt`
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.FRONTEND_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
