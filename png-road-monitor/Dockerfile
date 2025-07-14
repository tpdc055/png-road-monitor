# PNG Road Construction Monitor - Production Dockerfile
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r pngroad && useradd -r -g pngroad pngroad

# Install dependencies (separate layer for better caching)
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Build stage
FROM base AS builder
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build the application
RUN bun run build

# Production stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

# Create directories
RUN mkdir -p /usr/src/app/uploads && \
    mkdir -p /usr/src/app/.next && \
    mkdir -p /var/log/png-road-monitor

# Copy built application
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/prisma ./prisma

# Copy production dependencies
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy configuration files
COPY --from=builder /usr/src/app/next.config.js ./
COPY --from=builder /usr/src/app/package.json ./

# Set ownership
RUN chown -R pngroad:pngroad /usr/src/app && \
    chown -R pngroad:pngroad /var/log/png-road-monitor

# Switch to non-root user
USER pngroad

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Expose port
EXPOSE 3000

# Start application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["bun", "run", "start"]
