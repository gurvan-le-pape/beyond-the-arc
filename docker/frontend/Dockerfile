FROM node:24-alpine AS base
WORKDIR /app
COPY ../src/frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

FROM base AS dev
COPY ../src/frontend ./
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS prod
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG FRONTEND_URL
ENV FRONTEND_URL=${FRONTEND_URL}
COPY ../src/frontend ./
# SENTRY_AUTH_TOKEN is exposed to the build command only, via a BuildKit secret
# mount. It must never be an ARG/ENV: those persist in the image config pushed
# to the registry, where anyone who can pull the image can read them.
# An absent secret (local builds) just skips the Sentry source map upload.
RUN --mount=type=secret,id=sentry_auth_token \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || true)" \
    npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "run", "start"]