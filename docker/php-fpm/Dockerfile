FROM php:7.1-fpm-alpine
MAINTAINER Wouter De Schuyter <wouter.de.schuyter@gmail.com>

# Install extensions
RUN NPROC=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) \
    && docker-php-ext-install -j${NPROC} pdo pdo_mysql mysqli

# Copy required files
COPY ./docker/php-fpm/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY . /code

# Change working directory
WORKDIR /code
