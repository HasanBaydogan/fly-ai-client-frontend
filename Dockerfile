# Use the official Nginx image to serve the React app
FROM nginx:stable-alpine

# Copy SSL certificate and key into the container
COPY cert.crt /etc/ssl/certs/
COPY cert.key /etc/ssl/private/

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/

# Copy the React app's build folder to Nginx's root directory
COPY build/ /usr/share/nginx/html/

# Expose port 443 for HTTPS
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
