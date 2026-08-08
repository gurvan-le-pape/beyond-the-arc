// src/backend/common/interceptors/http-metrics.interceptor.spec.ts
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NotFoundException,
} from "@nestjs/common";
import { lastValueFrom, of, throwError } from "rxjs";

import { HttpMetricsInterceptor } from "./http-metrics.interceptor";

function makeContext(path: string, method = "GET", statusCode = 200) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ method, path, route: { path } }),
      getResponse: () => ({ statusCode }),
    }),
  } as unknown as ExecutionContext;
}

function makeCounter() {
  return { inc: jest.fn() };
}

function makeHistogram() {
  return { observe: jest.fn() };
}

function makeInterceptor() {
  const counter = makeCounter();
  const histogram = makeHistogram();
  const instance = new HttpMetricsInterceptor(
    counter as never,
    histogram as never,
  );
  return { instance, counter, histogram };
}

const ok: CallHandler = { handle: () => of({ ok: true }) };
const fails = (error: unknown): CallHandler => ({
  handle: () => throwError(() => error),
});

describe("HttpMetricsInterceptor", () => {
  describe("successful requests", () => {
    it("records the route, method and status", async () => {
      const { instance, counter, histogram } = makeInterceptor();

      await lastValueFrom(instance.intercept(makeContext("/api/clubs"), ok));

      expect(counter.inc).toHaveBeenCalledWith({
        method: "GET",
        route: "/api/clubs",
        status_code: "200",
      });
      expect(histogram.observe).toHaveBeenCalledTimes(1);
    });
  });

  describe("failed requests", () => {
    // The whole point of this block: exception filters run after
    // interceptors, so res.statusCode is still 200 here. A status read off
    // the response would file every failure as a success.
    it("records a 404 from a NotFoundException, not the response's 200", async () => {
      const { instance, counter } = makeInterceptor();

      await expect(
        lastValueFrom(
          instance.intercept(
            makeContext("/api/teams/:teamId", "GET", 200),
            fails(new NotFoundException("Team 1 not found")),
          ),
        ),
      ).rejects.toThrow(NotFoundException);

      expect(counter.inc).toHaveBeenCalledWith({
        method: "GET",
        route: "/api/teams/:teamId",
        status_code: "404",
      });
    });

    it("records a 400 from a BadRequestException", async () => {
      const { instance, counter } = makeInterceptor();

      await expect(
        lastValueFrom(
          instance.intercept(
            makeContext("/api/clubs", "GET", 200),
            fails(new BadRequestException()),
          ),
        ),
      ).rejects.toThrow(BadRequestException);

      expect(counter.inc).toHaveBeenCalledWith(
        expect.objectContaining({ status_code: "400" }),
      );
    });

    it("records a 500 for a non-HTTP error", async () => {
      const { instance, counter, histogram } = makeInterceptor();

      await expect(
        lastValueFrom(
          instance.intercept(
            makeContext("/api/clubs", "GET", 200),
            fails(new Error("connection lost")),
          ),
        ),
      ).rejects.toThrow("connection lost");

      expect(counter.inc).toHaveBeenCalledWith(
        expect.objectContaining({ status_code: "500" }),
      );
      // The duration is recorded for failures too — an endpoint that is slow
      // *and* failing is the case you most want on the histogram.
      expect(histogram.observe).toHaveBeenCalledTimes(1);
    });
  });

  describe("the metrics endpoint itself", () => {
    it("does not count Prometheus scraping this service", async () => {
      const { instance, counter, histogram } = makeInterceptor();

      await lastValueFrom(instance.intercept(makeContext("/metrics"), ok));

      expect(counter.inc).not.toHaveBeenCalled();
      expect(histogram.observe).not.toHaveBeenCalled();
    });

    it("still passes the scrape through untouched", async () => {
      const { instance } = makeInterceptor();

      await expect(
        lastValueFrom(instance.intercept(makeContext("/metrics"), ok)),
      ).resolves.toEqual({ ok: true });
    });
  });
});
