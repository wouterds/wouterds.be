FROM nginx:1.13-alpine
MAINTAINER Wouter De Schuyter <wouter.de.schuyter@gmail.com>

# Copy required files
COPY ./docker/nginx-web/default.conf /etc/nginx/conf.d/default.conf
COPY ./public/static /code/public/static
COPY ./public/index.php /code/public/index.php

# Change working directory
WORKDIR /code
