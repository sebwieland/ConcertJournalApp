# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy build output to nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 (nginx default)
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]