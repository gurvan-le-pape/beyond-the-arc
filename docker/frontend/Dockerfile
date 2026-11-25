FROM node:24-alpine AS base
WORKDIR /app
# Every container runs on UTC. Date logic must not depend on where the
# host happens to be — see .claude/rules/dates-and-timezones.md.
ENV TZ=UTC
COPY src/frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

FROM base AS dev
COPY src/frontend ./
# The frontend's own ESLint rule derives its barrel-directory list from this
# file, so a copy of src/frontend without it cannot lint (see
# eslint-rules/enforce-barrel-import.js). It goes at / rather than in /app
# because /app *is* src/frontend here, so the container root is playing the
# part of the repo root — and because the dev compose file bind-mounts the
# real file over this copy, and a target inside /app would be inside the
# src/frontend bind mount, where Docker would create the mountpoint as a
# root-owned empty file in the working tree.
COPY barrelsby.json /barrelsby.json
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG FRONTEND_URL
ENV FRONTEND_URL=${FRONTEND_URL}
COPY src/frontend ./
# `next build` runs ESLint, and without this the barrel rule threw ENOENT and
# Next skipped the whole lint pass — non-fatal, so the image built green with
# its lint gate off. Same placement and reason as the dev stage above.
COPY barrelsby.json /barrelsby.json
# SENTRY_AUTH_TOKEN is exposed to the build command only, via a BuildKit secret
# mount. It must never be an ARG/ENV: those persist in the image config pushed
# to the registry, where anyone who can pull the image can read them.
# An absent secret (local builds) just skips the Sentry source map upload. CI=true
# makes the Sentry plugin log: it is silent otherwise, even when an upload fails,
# and a failed upload does not fail the build.
RUN --mount=type=secret,id=sentry_auth_token \
    CI=true SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || true)" \
    npm run build

# Runtime image: Next standalone output only — the traced subset of
# node_modules plus server.js, no build toolchain. Static assets and public/
# are not included in the standalone folder and must be copied explicitly.
FROM node:24-alpine AS prod
WORKDIR /app
# Every container runs on UTC. Date logic must not depend on where the
# host happens to be — see .claude/rules/dates-and-timezones.md.
ENV TZ=UTC
ENV NODE_ENV=production
# Next's standalone server binds to localhost unless HOSTNAME is set; inside
# a container it must listen on all interfaces to be reachable.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
