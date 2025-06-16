# Build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
# Add logging and explicitly install Rollup native dependencies
RUN echo "Node version: $(node -v)" && \
    echo "NPM version: $(npm -v)" && \
    # Install dependencies
    npm install && \
    # Explicitly install the Rollup native dependencies for both architectures
    if [ "$(uname -m)" = "x86_64" ]; then \
        npm install --no-save @rollup/rollup-linux-x64-gnu; \
    elif [ "$(uname -m)" = "aarch64" ]; then \
        npm install --no-save @rollup/rollup-linux-arm64-gnu; \
    fi
COPY . .
# Build the application
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./build
RUN npm install -g serve
CMD ["serve", "-s", "build"]
