// src/frontend/features/competitions/championships/utils/resolvePoolId.ts
import type { Pool } from "@/features/competitions/pools/types";

/**
 * The selected pool for a request: the one named by the `pool` query param
 * when it matches, otherwise the first pool. Assumes a non-empty pool list.
 *
 * @param pools - the championship's pools; must be non-empty, as the fallback indexes the first
 * @param poolParam - the raw `?pool=` value, if any
 * @returns the matching pool's id, or the first pool's — an unknown or absent param never yields nothing
 */
export function resolvePoolId(
  pools: Pool[],
  poolParam: string | undefined,
): number {
  if (!poolParam) return pools[0].id;

  return pools.find((p) => p.id === Number(poolParam))?.id ?? pools[0].id;
}
