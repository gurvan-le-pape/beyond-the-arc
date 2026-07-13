FROM node:24-alpine AS base
WORKDIR /app
COPY src/frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

FROM base AS dev
COPY src/frontend ./
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG FRONTEND_URL
ENV FRONTEND_URL=${FRONTEND_URL}
COPY src/frontend ./
# SENTRY_AUTH_TOKEN is exposed to the build command only, via a BuildKit secret
# mount. It must never be an ARG/ENV: those persist in the image config pushed
# to the registry, where anyone who can pull the image can read them.
# An absent secret (local builds) just skips the Sentry source map upload.
RUN --mount=type=secret,id=sentry_auth_token \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || true)" \
    npm run build

# Runtime image: Next standalone output only — the traced subset of
# node_modules plus server.js, no build toolchain. Static assets and public/
# are not included in the standalone folder and must be copied explicitly.
FROM node:24-alpine AS prod
WORKDIR /app
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
