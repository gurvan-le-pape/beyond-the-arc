FROM node:20-alpine AS base
WORKDIR /app
COPY ../src/frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

FROM base AS dev
COPY ../src/frontend ./
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS prod
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
COPY ../src/frontend ./
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "run", "start"]