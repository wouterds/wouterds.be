FROM php:7.2-fpm-alpine
MAINTAINER Wouter De Schuyter <wouter.de.schuyter@gmail.com>

# Install extensions
RUN apk add --no-cache \
      freetype-dev libpng-dev libjpeg-turbo-dev \
      freetype libpng libjpeg \
    && docker-php-ext-configure gd \
      --with-freetype-dir=/usr/include/ \
      --with-png-dir=/usr/include/ \
      --with-jpeg-dir=/usr/include/ \
    && NPROC=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) \
    && docker-php-ext-install -j${NPROC} \
        gd pdo pdo_mysql mysqli \
    && apk del freetype-dev libpng-dev libjpeg-turbo-dev

# Copy required files
COPY ./docker/php-fpm/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY . /code

# Change working directory
WORKDIR /code
