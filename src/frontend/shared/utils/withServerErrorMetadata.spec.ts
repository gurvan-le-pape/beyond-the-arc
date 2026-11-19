// src/frontend/shared/utils/withServerErrorMetadata.spec.ts
import { notFound } from "next/navigation";
import { describe, expect, it } from "vitest";

import { withServerErrorMetadata } from "./withServerErrorMetadata";

describe("withServerErrorMetadata", () => {
  it("returns the page's metadata when it builds", async () => {
    const generate = withServerErrorMetadata(
      async ({ id }: { id: number }) => ({
        title: `Team ${id}`,
      }),
    );

    await expect(generate({ id: 4 })).resolves.toEqual({ title: "Team 4" });
  });

  it("falls back to the layout's metadata when the fetch fails", async () => {
    const generate = withServerErrorMetadata(async () => {
      throw new Error("backend down");
    });

    await expect(generate({})).resolves.toEqual({});
  });

  it("lets Next's own control flow through, so a 404 still reaches the not-found page", async () => {
    const generate = withServerErrorMetadata(async () => notFound());

    await expect(generate({})).rejects.toMatchObject({
      digest: "NEXT_HTTP_ERROR_FALLBACK;404",
    });
  });
});
