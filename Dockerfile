# syntax=docker/dockerfile:1

# Build the backend with dev dependencies and the shared types from commons/.
FROM node:24 AS build
WORKDIR /app
COPY commons/ commons/
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Production dependencies only. Install scripts are skipped: they only fetch
# the Supabase and Sentry CLIs, which the server never runs.
FROM node:24-slim AS deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:24-slim
ENV NODE_ENV=production
WORKDIR /app/backend
COPY --from=deps /app/backend/package.json ./
COPY --from=deps /app/backend/node_modules node_modules/
COPY --from=build /app/backend/build build/
USER node
EXPOSE 3000
CMD ["node", "build/server.js"]
