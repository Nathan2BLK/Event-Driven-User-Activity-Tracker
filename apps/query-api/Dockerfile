# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=app:app src ./src

ENV NODE_ENV=production
ENV QUERY_PORT=3001

EXPOSE 3001

CMD ["node", "src/server.js"]
