FROM nginx:1.13-alpine
MAINTAINER Wouter De Schuyter <wouter.de.schuyter@gmail.com>

# Nginx configuration file
COPY ./docker/nginx-api/default.conf /etc/nginx/conf.d/default.conf

# Copy required files
COPY ./public/api.php /code/public/api.php

# Change working directory
WORKDIR /code
