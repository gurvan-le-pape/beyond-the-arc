// src/frontend/shared/components/feedback/withServerErrorState.tsx
import * as Sentry from "@sentry/nextjs";
import { unstable_rethrow } from "next/navigation";
import type { ReactNode } from "react";

import { ServerErrorState } from "./ServerErrorState";

/**
 * Wraps a page's default export so a failed server-side fetch renders
 * `ServerErrorState` instead of throwing out of the render.
 *
 * **Why a wrapper and not an `error.tsx`.** A throw during the server render of
 * the shell reaches no `error.tsx`: those boundaries are React class components
 * and Fizz never calls `getDerivedStateFromError`. Next answers with an empty
 * document. A plain `try/catch` inside the page function *does* work, because
 * every one of this app's server fetches is awaited at the top of the page
 * before any JSX is returned — so catching there catches all of them. This
 * wrapper is that `try/catch`, written once instead of twelve times.
 *
 * The trade-off it accepts, decided deliberately: the response is now **200**
 * with a rendered error card rather than 500 with a blank body. A crawler is
 * told `noindex` by `ServerErrorState`; a backend outage is still alerted on,
 * by the blackbox probe against `/api/health` rather than by the frontend
 * returning 500.
 *
 * `unstable_rethrow` must come first in the catch. `notFound()` and `redirect()`
 * interrupt control flow by throwing, and several pages call them *after* a
 * fetch — swallowing those would turn every 404 into this card.
 *
 * Sentry is captured here because catching the error means Next's
 * `onRequestError` hook (wired to `Sentry.captureRequestError` in
 * `instrumentation.ts`) no longer sees it. `handleServerError` has already
 * logged it once on the way past; this adds the capture that the throw used to
 * earn for free, and no second one, since the client boundary no longer runs.
 *
 * Pair with `withServerErrorMetadata` on the same page: `generateMetadata`
 * runs as its own function and its throw is not caught by this.
 */
export function withServerErrorState<P extends object>(
  Page: (props: P) => Promise<ReactNode>,
): (props: P) => Promise<ReactNode> {
  return async function PageWithServerErrorState(props: P) {
    try {
      return await Page(props);
    } catch (error) {
      unstable_rethrow(error);

      Sentry.captureException(error);

      return <ServerErrorState />;
    }
  };
}

export default withServerErrorState;
