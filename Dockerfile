FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    RELEASE_CACHE_DIR=/app/data \
    NODE_OPTIONS=--max-old-space-size=192
RUN addgroup -S -g 10001 hikari && adduser -S -u 10001 -G hikari hikari
COPY --from=builder --chown=hikari:hikari /app/.next/standalone ./
COPY --from=builder --chown=hikari:hikari /app/.next/static ./.next/static
COPY --from=builder --chown=hikari:hikari /app/public ./public
RUN mkdir -p /app/data /app/.next/cache && chown -R hikari:hikari /app/data /app/.next/cache
USER 10001:10001
EXPOSE 3000
HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
