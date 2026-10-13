# ==============================================================================
# DevOps Academy Backend - Production Multi-Stage Dockerfile
# ==============================================================================
# Optimization Features:
# - Multi-stage dependency caching
# - Tini init system (PID 1) for graceful SIGTERM/SIGINT propagation
# - Non-privileged user (devopsuser: 1001)
# - Minimal Alpine Linux attack surface
# - Native Docker healthcheck with readiness probe
# ==============================================================================

# ─── Stage 1: Dependency Cache ────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install build dependencies required by any native extensions
RUN apk add --no-cache libc6-compat

# Copy package manifests and install production-only dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# ─── Stage 2: Production Runner ──────────────────────────────────────────────
FROM node:20-alpine AS runner
LABEL maintainer="DevOps Academy Team <team@devopsacademy.com>" \
      description="Production backend API container for DevOps Academy" \
      version="1.0.0"

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000 \
    LOG_LEVEL=info

# Install tini for proper signal forwarding and curl for container health probes
RUN apk add --no-cache tini curl

# Create unprivileged application user and group
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S devopsuser -G nodejs

# Copy installed production node_modules from deps stage
COPY --from=deps --chown=devopsuser:nodejs /app/node_modules ./node_modules
COPY --chown=devopsuser:nodejs package.json ./
COPY --chown=devopsuser:nodejs app.js server.js ./
COPY --chown=devopsuser:nodejs src/ ./src/

# Create persistent storage directories with appropriate unprivileged permissions
RUN mkdir -p uploads logs && \
    chown -R devopsuser:nodejs uploads logs && \
    chmod 755 uploads logs

# Switch to non-root user
USER devopsuser

EXPOSE 5000

# Container Healthcheck Probe (tests readiness against live database)
HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5000/api/health/ready || exit 1

# Use Tini as PID 1 entrypoint for clean zombie process reaping and graceful shutdown
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "server.js"]
