# ==============================================================================
# DevOps Academy Frontend - Production Multi-Stage Dockerfile
# ==============================================================================
# Stage 1: Build production static bundle using Vite + TypeScript
# Stage 2: Serve optimized bundle using lightweight Alpine Nginx
# ==============================================================================

# ─── Stage 1: Build Application ───────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build Vite application with production optimizations
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ─── Stage 2: Production Nginx Server ─────────────────────────────────────────
FROM nginx:1.25-alpine AS runner
LABEL maintainer="DevOps Academy Team <team@devopsacademy.com>" \
      description="Production frontend static web server for DevOps Academy"

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy hardened production Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck probe using internal endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
