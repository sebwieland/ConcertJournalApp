# Use an official Node.js 16 image as the base
FROM node:16

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Expose the port that the application will use
EXPOSE 3000

# Run the command to start the development server when the container launches
CMD ["npm", "start"]