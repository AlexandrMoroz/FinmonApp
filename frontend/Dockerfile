# # Create image based off of the official Node 10 image
# FROM node:16-alpine as builder

# # Copy dependency definitions
# COPY package.json package-lock.json ./

# # disabling ssl for npm for Dev or if you are behind proxy
# RUN npm set strict-ssl false

# ## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
# RUN npm ci && mkdir /app && mv ./node_modules ./app

# # Change directory so that our commands run inside this new directory
# WORKDIR /app

# # Get all the code needed to run the app
# COPY . /app/

# # Build app
# RUN npm run build

# FROM nginx
# # Copy the configuration file from the current directory and paste
# # it inside the container to use it as Nginx's default config.
# COPY nginx.conf /etc/nginx/nginx.conf
# #COPY dist/frontend /usr/share/nginx/html
# RUN ls 
# # Port 8080 of the container will be exposed and then mapped to port
# # 8080 of our host machine via Compose. This way we'll be able to
# # access the server via localhost:8080 on our host.
# EXPOSE 80

# # Start Nginx when the container has provisioned.
# CMD ["nginx", "-g", "daemon off;"]
# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:16-alpine as frontend-build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG configuration=production
RUN npm run build -- --output-path=./dist/out --configuration $configuration
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
