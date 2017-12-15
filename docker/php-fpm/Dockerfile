FROM php:7.1-fpm-alpine
MAINTAINER Wouter De Schuyter <wouter.de.schuyter@gmail.com>

# Install extensions
RUN NPROC=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) \
    && docker-php-ext-install -j${NPROC} pdo pdo_mysql mysqli

# Copy required files
COPY ./docker/php-fpm/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY ./storage /code/storage
COPY ./resources/views /code/resources/views
COPY ./vendor /code/vendor
COPY ./database /code/database
COPY ./src /code/src
COPY ./public/index.php /code/public/index.php

# Change working directory
WORKDIR /code
