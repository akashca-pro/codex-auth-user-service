# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g npm@latest

COPY package*.json ./

RUN npm install

COPY . .

# Include Prisma schema files
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Build the TypeScript project
RUN npm run build


# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/src

# Copy node_modules
COPY --from=builder /app/node_modules /app/node_modules

# Copy Prisma runtime requirements
COPY --from=builder /app/node_modules/prisma /app/node_modules/prisma
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/src/generated /app/src/generated

# Expose gRPC, and metrics ports
EXPOSE 9101 50051

# Start the app
CMD ["node", "src/index.cjs"]