# Use an official Node runtime as a parent image
FROM node:18-alpine as build
# Set the working directory to /app
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application
COPY . .
# Build the application
RUN npm run build

# Use Nginx to serve the app
FROM nginx:alpine
# Copy the built app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
