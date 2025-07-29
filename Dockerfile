# Stage 1: Build
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies (clean and fast)
RUN npm ci

# Copy the rest of your codebase
COPY . .

# Include Prisma schema files
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Build the TypeScript project
RUN npm run build


# Stage 2: Runtime
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy built JS code
COPY --from=builder /app/dist /app

COPY --from=builder /app/.env /app

# Copy node_modules
COPY --from=builder /app/node_modules /app/node_modules

# Copy Prisma runtime requirements (important)
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/prisma /app/prisma

# Expose gRPC, HTTP, and metrics ports
EXPOSE 4001 9100 50051 5432

# Start the app
CMD ["node", "index.js"]
