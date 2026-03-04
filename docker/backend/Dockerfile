FROM node:20-alpine AS base
WORKDIR /app
COPY ../src/backend/package*.json ./
COPY ../src/backend/prisma ./prisma
RUN npm ci --prefer-offline --no-audit --progress=false && npx prisma generate

FROM base AS dev
COPY ../src/backend ./
EXPOSE 4000
CMD ["npm", "run", "start:dev"]

FROM base AS prod
COPY ../src/backend ./
RUN npm run build
EXPOSE 4000
ENV NODE_ENV=production
CMD ["npm", "run", "start"]