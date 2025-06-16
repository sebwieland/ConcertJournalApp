# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Add logging and fix for Rollup musl issue
RUN echo "Node version: $(node -v)" && \
    echo "NPM version: $(npm -v)" && \
    # Set environment variable to skip optional Rollup native dependencies
    export ROLLUP_SKIP_NODEJS_NATIVE=1 && \
    npm install
COPY . .
# Set environment variable to skip optional Rollup native dependencies during build
RUN export ROLLUP_SKIP_NODEJS_NATIVE=1 && npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./build
RUN npm install -g serve
CMD ["serve", "-s", "build"]
