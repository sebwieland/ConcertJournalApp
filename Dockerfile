# Use an official Node.js 16 image as the base for building
FROM node:16-alpine AS build

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Enable SWC and build the React application
RUN SWC=true npm run build

# Expose the port that the application will use
EXPOSE 3000

# Use an official Node.js 16 image for the runtime
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the build artifacts from the build stage
COPY --from=build /app/build ./build

# Install serve for serving the static files
RUN npm install -g serve

# Run the command to serve the production build when the container launches
CMD ["serve", "-s", "build"]