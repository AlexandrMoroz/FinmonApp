# Use the standard Nginx image from Docker Hub
FROM nginx
# Copy the configuration file from the current directory and paste
# it inside the container to use it as Nginx's default config.
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-build /app/dist/out/ /usr/share/nginx/html

# Port 8080 of the container will be exposed and then mapped to port
# 8080 of our host machine via Compose. This way we'll be able to
# access the server via localhost:8080 on our host.
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
