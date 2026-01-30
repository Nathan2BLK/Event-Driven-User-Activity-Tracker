# syntax=docker/dockerfile:1

# ---- Build stage (installs deps deterministically) ----
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json ./
# Install production dependencies only, excluding dev dependencies
# Uses npm ci for reliable, reproducible installs (recommended for CI/CD environments)
RUN npm ci --omit=dev

# ---- Runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Security: run as non-root
RUN addgroup -S app && adduser -S app -G app
USER app

# Copy installed production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY --chown=app:app src ./src

# Default config (can be overridden by env)
ENV NODE_ENV=production
ENV COLLECTOR_PORT=3000

EXPOSE 3000

CMD ["node", "src/server.js"]
