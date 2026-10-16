// src/frontend/shared/hooks/useUrlState.ts
"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";

import { usePathname, useRouter } from "@/navigation";
import { decodeUrlState, encodeUrlState, type UrlCodecs } from "@/shared/utils";

/**
 * Page state kept in the query string, so a filtered view survives a reload,
 * the back button and a shared link.
 *
 * `update` takes a partial state. Updates made in the same event are merged
 * into one navigation — a cascade such as "changing the level clears the
 * committee and the league" calls several setters in a row, and a navigation
 * per call would each start from the query string as it was before the event
 * and keep only the last change. The URL is replaced, not pushed: refining a
 * filter is not a new page in the history.
 *
 * Needs a Suspense boundary above it, like any `useSearchParams` caller.
 *
 * @param codecs - One codec per state key; the key is the parameter name
 * @returns The decoded state and the update function
 */
export function useUrlState<T>(codecs: UrlCodecs<T>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const pending = useRef<URLSearchParams | null>(null);

  const state = useMemo(
    () => decodeUrlState(new URLSearchParams(searchParams.toString()), codecs),
    [searchParams, codecs],
  );

  const update = useCallback(
    (patch: Partial<{ [K in keyof T]: T[K] | undefined }>) => {
      const base =
        pending.current ?? new URLSearchParams(searchParams.toString());
      const next = encodeUrlState(base, codecs, patch);
      pending.current = next;
      queueMicrotask(() => {
        if (pending.current !== next) return;
        pending.current = null;
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [searchParams, codecs, pathname, router],
  );

  return { state, update };
}
