# Use Node.js as the base image for building
FROM node:lts AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Run the generate script
RUN npm run generate

# Use Nginx as the base image for serving
FROM nginx:alpine

# Copy the built files from the builder stage to Nginx's serve directory
COPY --from=builder /app/public /usr/share/nginx/html

# Copy a custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
