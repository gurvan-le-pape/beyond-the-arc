// src/backend/app.pipeline.spec.ts
import type { Server } from "node:http";

import { METRICS_PATH } from "@common/constants";
import { configureApp } from "@common/utils";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { Cache } from "cache-manager";
import { PARAMS_PROVIDER_TOKEN } from "nestjs-pino";
import { PrismaService } from "prisma/prisma.service";
import request from "supertest";

import { AppModule } from "./app.module";

/**
 * The one test tier that composes the application instead of a unit of it.
 *
 * Every other spec here exercises a controller, a service, an interceptor or a
 * filter on its own. The properties below belong to none of them individually
 * — they only exist once the global prefix, the `ValidationPipe`, the route
 * cache, the envelope interceptor and the exception filter are stacked in one
 * order around one route. A unit test cannot state them; this tier does.
 *
 * The seam is `PrismaService`, and nothing below it: no database, no fixtures,
 * no migrations. Everything above it is the real wiring, including the module
 * graph, so this also fails if a provider stops resolving.
 *
 * Two of the defects this tier is aimed at have already happened — the cache
 * key collision (#467) and the metrics error path (#469).
 */
describe("HTTP pipeline (composed)", () => {
  let app: INestApplication;
  let server: Server;
  let cache: Cache;

  /**
   * Shaped to `LEAGUE_SELECT` in `leagues.service.ts`, which is what the
   * mapper reads. Kept minimal on purpose: this suite asserts the pipeline
   * around the handler, not the handler's mapping, which `leagues.service`'s
   * own spec covers.
   */
  const leagueRow = {
    id: 1,
    name: "Ligue Test",
    address: null,
    region: { id: 10, name: "Region Test", code: "RT" },
    committees: [
      { _count: { clubs: 3 }, clubs: [{ code: "ARA0001001" }] },
      { _count: { clubs: 4 }, clubs: [{ code: "ARA0003001" }] },
    ],
  };

  const prisma = {
    client: {
      leagues: { findMany: jest.fn() },
      teams: { findUnique: jest.fn() },
      // A team's detail reads its box scores beside the team itself.
      matches: { findMany: jest.fn().mockResolvedValue([]) },
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      // Silences pino-http only. `logger: false` below covers Nest's own
      // logger but not the request logger, which is middleware from
      // LoggerModule and would otherwise print a pretty-printed request and
      // response block for each of the requests this suite makes.
      .overrideProvider(PARAMS_PROVIDER_TOKEN)
      .useValue({ pinoHttp: { level: "silent" } })
      .compile();

    app = moduleRef.createNestApplication({ logger: false });
    // The production composition, called rather than restated — see
    // common/utils/app-bootstrap.util.ts.
    configureApp(app);
    await app.init();

    server = app.getHttpServer() as Server;
    cache = app.get<Cache>(CACHE_MANAGER);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await cache.clear();
  });

  describe("global prefix", () => {
    it("serves routes under /api and nowhere else", async () => {
      prisma.client.leagues.findMany.mockResolvedValue([leagueRow]);

      await request(server).get("/api/leagues").expect(200);
      await request(server).get("/leagues").expect(404);
    });

    it("excludes /metrics, and only /metrics", async () => {
      // The exclusion is one entry in `applyApiPrefix`. If it is dropped,
      // Prometheus scrapes 404 and the dashboards go flat with nothing failing
      // — so both directions are asserted, not just the reachable one.
      await request(server).get(METRICS_PATH).expect(200);
      await request(server).get(`/api${METRICS_PATH}`).expect(404);
    });

    it("does not wrap the metrics body in the envelope", async () => {
      // `@SkipTransform` on the metrics controller, seen from outside: a
      // Prometheus exposition body is a text format, and an envelope around it
      // is unparseable to the scraper.
      const res = await request(server).get(METRICS_PATH).expect(200);

      expect(res.text).toContain("# HELP");
      expect(res.body).not.toHaveProperty("data");
    });
  });

  describe("response envelope", () => {
    it("wraps a list handler's return value and counts it", async () => {
      prisma.client.leagues.findMany.mockResolvedValue([leagueRow]);

      const res = await request(server).get("/api/leagues").expect(200);

      expect(res.body).toMatchObject({
        data: [{ id: 1, name: "Ligue Test", clubCount: 7 }],
        meta: { count: 1 },
        path: "/api/leagues",
        statusCode: 200,
      });
      expect(typeof res.body.timestamp).toBe("string");
    });
  });

  describe("route cache", () => {
    it("stores the handler's payload, not the envelope", async () => {
      prisma.client.leagues.findMany.mockResolvedValue([leagueRow]);

      await request(server).get("/api/leagues").expect(200);

      // The key format is `generateCacheKey`'s, and the URL it sees already
      // carries the global prefix.
      const stored = await cache.get("cache:/api/leagues");

      expect(Array.isArray(stored)).toBe(true);
      expect(stored).toEqual([
        expect.objectContaining({ id: 1, name: "Ligue Test" }),
      ]);
    });

    it("re-envelopes a cache hit rather than replaying a stored envelope", async () => {
      prisma.client.leagues.findMany.mockResolvedValue([leagueRow]);

      const first = await request(server).get("/api/leagues").expect(200);
      const second = await request(server).get("/api/leagues").expect(200);

      // One upstream call for two requests: the second was served from cache.
      expect(prisma.client.leagues.findMany).toHaveBeenCalledTimes(1);

      // Same payload, and a full envelope both times. Were the envelope
      // cached instead of the payload, the second body would still look
      // right here — which is why the stored value is asserted directly
      // above, and why both assertions are needed to state the property.
      expect(second.body.data).toEqual(first.body.data);
      expect(second.body).toMatchObject({
        meta: { count: 1 },
        path: "/api/leagues",
        statusCode: 200,
      });
    });
  });

  describe("undeclared query parameters", () => {
    it("rejects a parameter on a route with no query DTO, before cache and handler", async () => {
      // The cache key is the full URL, so a route that answered `?a=1` with
      // 200 would store one copy of its body per junk parameter.
      const res = await request(server).get("/api/leagues?a=1").expect(400);

      expect(res.body).toMatchObject({
        statusCode: 400,
        error: "Bad Request",
        message: ["property a should not exist"],
      });
      expect(prisma.client.leagues.findMany).not.toHaveBeenCalled();
      expect(await cache.get("cache:/api/leagues?a=1")).toBeUndefined();
    });
  });

  describe("errors", () => {
    it("rejects a non-numeric id with 400 in the error shape", async () => {
      const res = await request(server).get("/api/teams/abc").expect(400);

      expect(res.body).toMatchObject({
        statusCode: 400,
        error: "Bad Request",
        path: "/api/teams/abc",
      });
      expect(prisma.client.teams.findUnique).not.toHaveBeenCalled();
    });

    it("rejects an id past the int4 ceiling with 400, and accepts the ceiling", async () => {
      // `ParseEntityIdPipe`'s upper bound (#443). Without it the value reaches
      // Prisma and comes back as a 500 plus a Sentry event, from an anonymous
      // GET. The boundary value is asserted alongside it so a fencepost error
      // in the bound cannot pass.
      await request(server).get("/api/teams/2147483648").expect(400);

      prisma.client.teams.findUnique.mockResolvedValue(null);
      await request(server).get("/api/teams/2147483647").expect(404);
    });

    it("returns 404 in the error shape when the row is absent", async () => {
      prisma.client.teams.findUnique.mockResolvedValue(null);

      const res = await request(server).get("/api/teams/999999").expect(404);

      expect(res.body).toMatchObject({
        statusCode: 404,
        error: "Not Found",
        path: "/api/teams/999999",
      });
      expect(res.body).not.toHaveProperty("data");
    });

    it("rejects an undeclared query parameter with 400", async () => {
      // `forbidNonWhitelisted` on the global pipe. It holds only because the
      // pipe is global and the endpoint binds a DTO — neither half is visible
      // from a controller unit test.
      const res = await request(server).get("/api/teams?bogus=1").expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining("bogus")]),
      );
    });
  });
});
