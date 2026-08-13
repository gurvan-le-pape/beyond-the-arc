// src/backend/common/utils/request-id.util.spec.ts
import { REQUEST_ID_HEADER } from "@common/constants";

import { resolveRequestId } from "./request-id.util";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function makeResponse() {
  return { setHeader: jest.fn() };
}

/** The single header the response must carry, whatever the input was. */
function headerValue(res: { setHeader: jest.Mock }): unknown {
  expect(res.setHeader).toHaveBeenCalledTimes(1);
  const [name, value] = res.setHeader.mock.calls[0];
  expect(name).toBe(REQUEST_ID_HEADER);
  return value;
}

describe("resolveRequestId", () => {
  it("mints a UUID when no id arrives", () => {
    const res = makeResponse();

    const id = resolveRequestId({ headers: {} }, res);

    expect(id).toMatch(UUID);
    expect(headerValue(res)).toBe(id);
  });

  it("mints one when the request has no headers at all", () => {
    const res = makeResponse();

    expect(resolveRequestId({}, res)).toMatch(UUID);
  });

  it("reuses a well-formed inbound id, so an edge-generated id propagates", () => {
    const res = makeResponse();

    // Nginx's $request_id, the id this would carry if the edge started
    // generating one.
    const id = resolveRequestId(
      { headers: { [REQUEST_ID_HEADER]: "b1946ac92492d2347c6235b4d2611184" } },
      res,
    );

    expect(id).toBe("b1946ac92492d2347c6235b4d2611184");
    expect(headerValue(res)).toBe(id);
  });

  it("reuses a UUID unchanged", () => {
    const res = makeResponse();
    const inbound = "3f4b2c1e-8a7d-4e1f-9b0c-2d6a5e4f3b2a";

    expect(
      resolveRequestId({ headers: { [REQUEST_ID_HEADER]: inbound } }, res),
    ).toBe(inbound);
  });

  describe("replaces an id it will not echo", () => {
    // Measured on Node 24.15.0: res.setHeader throws for none of these — they
    // are echoed verbatim and bound to the request's logger for Loki's 31-day
    // retention. The bound is the point, not a crash.
    const rejected: Record<string, string> = {
      empty: "",
      "over 128 characters": "a".repeat(129),
      "spaces and punctuation": "foo bar;drop",
      tab: "foo\tbar",
      "high bytes": "café",
      "the joined form of a duplicated header": "one, two",
    };

    for (const [name, inbound] of Object.entries(rejected)) {
      it(name, () => {
        const res = makeResponse();

        const id = resolveRequestId(
          { headers: { [REQUEST_ID_HEADER]: inbound } },
          res,
        );

        expect(id).toMatch(UUID);
        expect(id).not.toBe(inbound);
        expect(headerValue(res)).toBe(id);
      });
    }

    it("accepts the boundary length of 128", () => {
      const res = makeResponse();
      const inbound = "a".repeat(128);

      expect(
        resolveRequestId({ headers: { [REQUEST_ID_HEADER]: inbound } }, res),
      ).toBe(inbound);
    });
  });

  it("ignores a non-string header value", () => {
    const res = makeResponse();

    // Node joins duplicate x-request-id headers into one string, so this is
    // defensive rather than observed — but the cast this replaces claimed
    // `string` unconditionally.
    const id = resolveRequestId(
      { headers: { [REQUEST_ID_HEADER]: ["one", "two"] } },
      res,
    );

    expect(id).toMatch(UUID);
  });

  it("gives two requests different ids", () => {
    const first = resolveRequestId({ headers: {} }, makeResponse());
    const second = resolveRequestId({ headers: {} }, makeResponse());

    expect(first).not.toBe(second);
  });
});
