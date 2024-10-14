#IGNORE THIS PLACEHOLDER

# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock files for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Stage 2: Serve the built app using a smaller image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the built app from the previous stage
COPY --from=builder /app ./

# Install only production dependencies
RUN npm ci --production

# Expose the port Cloud Run will use
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
