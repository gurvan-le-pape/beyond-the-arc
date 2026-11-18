// src/frontend/app/robots.ts
import type { MetadataRoute } from "next";

/**
 * Crawlers asked to stay off the whole site: AI-training collectors and
 * commercial SEO crawlers. Neither sends visitors, and every page they fetch
 * is a server render plus several API calls on a detail page the ISR cache
 * almost never holds — GPTBot alone was 63 % of the requests reaching Nginx.
 *
 * `robots.txt` only asks. The enforcement is Cloudflare's AI Crawl Control
 * (Block Crawler), which blocks GPTBot, Amazonbot, Meta-ExternalAgent,
 * Bytespider, ClaudeBot and CCBot at the edge; keep the two lists in step.
 * The last four entries here are not in Cloudflare's catalogue, so this file
 * is the only control for them, and it holds only for crawlers that honour it.
 *
 * Search and user-triggered agents stay allowed — Googlebot, Bingbot,
 * Applebot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot —
 * because they are how people find the site.
 */
const BLOCKED_CRAWLERS = [
  "GPTBot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "Bytespider",
  "ClaudeBot",
  "CCBot",
  "Reflectionbot",
  "ElevenlabsCrawler",
  "DataForSeoBot",
  "SemrushBot",
];

/**
 * The `robots.txt` Next generates for the site.
 *
 * Everything is allowed to every crawler except those in
 * {@link BLOCKED_CRAWLERS}. Pages that should not be indexed say so themselves
 * through their own metadata, `ServerErrorState` being the one that does.
 *
 * The sitemap URL is built from `FRONTEND_URL`, so an unset variable yields
 * `undefined/sitemap.xml` rather than failing the build.
 *
 * @returns the robots rules Next serialises to `/robots.txt`
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.FRONTEND_URL;
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: BLOCKED_CRAWLERS, disallow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
