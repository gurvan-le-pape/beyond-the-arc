// src/frontend/features/competitions/championships/utils/resolveInitialPoolId.ts
import type { Pool } from "@/features/competitions/pools/types";

/**
 * The pool to select on first render: the one named by the `pool` query param
 * when it matches, otherwise the first pool. Assumes a non-empty pool list.
 */
export function resolveInitialPoolId(
  pools: Pool[],
  poolParam: string | undefined,
): number {
  if (!poolParam) return pools[0].id;

  return pools.find((p) => p.id === Number(poolParam))?.id ?? pools[0].id;
}
