// src/frontend/shared/utils/withServerErrorMetadata.ts
import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";

/**
 * Wraps a page's `generateMetadata` so a failed fetch inside it falls back to
 * the root layout's metadata instead of throwing out of the render.
 *
 * Seven of this app's pages fetch in `generateMetadata` — a detail page has no
 * title until it knows what it is showing. That function runs separately from
 * the page component, so `withServerErrorState` cannot catch it, and a throw
 * there produces the same empty 500 document the page wrapper exists to
 * prevent. The two are used together or the guard has a hole.
 *
 * Returning `{}` is the whole fallback: `app/layout.tsx` declares
 * `title.default` ("Beyond The Arc") and a description, so the document is
 * still correctly titled. `ServerErrorState`, rendered by the page wrapper a
 * moment later, contributes the `noindex`.
 *
 * Deliberately no Sentry capture. Whatever failed here is about to fail again
 * in the page body — same request, same backend — and be captured there. Two
 * events for one outage is how an error budget stops meaning anything.
 *
 * `unstable_rethrow` first, for the same reason as the page wrapper:
 * `handleServerError` turns a 404 into `notFound()`, which is a throw, and
 * several pages depend on that happening in `generateMetadata`.
 */
export function withServerErrorMetadata<P extends object>(
  generateMetadata: (props: P) => Promise<Metadata>,
): (props: P) => Promise<Metadata> {
  return async function GenerateMetadataWithServerErrorFallback(props: P) {
    try {
      return await generateMetadata(props);
    } catch (error) {
      unstable_rethrow(error);

      return {};
    }
  };
}

export default withServerErrorMetadata;
