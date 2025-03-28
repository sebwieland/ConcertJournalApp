# Use an official Node.js 16 image as the base for building
FROM node:16-alpine AS build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the application code to the working directory
COPY . .

# Enable SWC and build the React application
RUN SWC=true npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the build artifacts from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that the application will use
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
