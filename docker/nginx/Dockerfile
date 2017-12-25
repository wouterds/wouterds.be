FROM nginx:1.13-alpine
MAINTAINER Wouter De Schuyter <wouter.de.schuyter@gmail.com>

# Copy required files
COPY ./docker/nginx-web/default.conf /etc/nginx/conf.d/default.conf
COPY ./public /code/public

# Change working directory
WORKDIR /code
