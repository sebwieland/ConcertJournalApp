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

# Accept build arguments
ARG REACT_APP_BACKEND_IP

# Set environment variable for build
ENV REACT_APP_BACKEND_IP=$REACT_APP_BACKEND_IP

# Build the React application
RUN npm run build

# Expose the port that the application will use
EXPOSE 3000

# Run the command to serve the production build when the container launches
CMD ["npx", "serve", "-s", "build"]