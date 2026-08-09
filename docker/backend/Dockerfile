FROM node:24-alpine AS base
WORKDIR /app
# Every container runs on UTC. Date logic must not depend on where the
# host happens to be — see .claude/rules/dates-and-timezones.md.
ENV TZ=UTC
COPY src/backend/package*.json ./
COPY src/backend/prisma ./prisma
RUN npm ci --prefer-offline --no-audit --progress=false && npx prisma generate

FROM base AS dev
COPY src/backend ./
EXPOSE 4000
CMD ["npm", "run", "start:dev"]

# One-shot migration runner: base already contains the Prisma CLI, the schema,
# and prisma/migrations (copied with the prisma directory). Run by compose
# before backend/scheduler start.
FROM base AS migrate
COPY src/backend/prisma.config.ts ./
# Holds DATABASE_URL and is one of only two writers to the database, so it
# runs unprivileged like the prod stage. migrate deploy only reads the image
# and writes to Postgres.
USER node
CMD ["npx", "prisma", "migrate", "deploy"]

FROM base AS build
COPY src/backend ./
RUN npm run build

# Runtime image: compiled dist + production dependencies only. No Nest CLI,
# no TypeScript — tsc-alias resolved the path aliases at build time, so dist
# runs under plain node.
FROM node:24-alpine AS prod
WORKDIR /app
# Every container runs on UTC. Date logic must not depend on where the
# host happens to be — see .claude/rules/dates-and-timezones.md.
ENV TZ=UTC
ENV NODE_ENV=production
COPY src/backend/package*.json ./
# Prisma 7's @prisma/client declares the full CLI toolchain (prisma, Studio,
# typescript, an embedded dev database) as production dependencies. None of it
# is used at runtime: the compiled client requires only @prisma/client/runtime/*
# and @prisma/adapter-pg. Strip the toolchain, the npm cache, and the WASM
# query compilers of databases other than postgresql (~300 MB combined).
RUN npm ci --omit=dev --prefer-offline --no-audit --progress=false \
    && rm -rf /root/.npm \
       node_modules/prisma \
       node_modules/typescript \
       node_modules/effect \
       node_modules/@electric-sql \
       node_modules/@prisma/studio-core \
       node_modules/@prisma/engines \
       node_modules/@prisma/dev \
       node_modules/@prisma/config \
       node_modules/@prisma/fetch-engine \
       node_modules/@prisma/get-platform \
    && find node_modules/@prisma/client/runtime \
       -name 'query_compiler*' ! -name '*postgresql*' -delete
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 4000
# --enable-source-maps is what makes the .map files emitted by tsconfig.build.json
# do anything: Node does not apply them to Error.stack otherwise. Measured in this
# image — without the flag a frame reads dist/common/pipes/parse-entity-id.pipe.js:31,
# with it, common/pipes/parse-entity-id.pipe.ts:30. Shipping the maps without the
# flag costs the image size and resolves nothing.
CMD ["node", "--enable-source-maps", "dist/main"]
