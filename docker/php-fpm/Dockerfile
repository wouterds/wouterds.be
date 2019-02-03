FROM arm32v6/php:7.3-fpm-alpine
LABEL maintainer="Wouter De Schuyter <wouter.de.schuyter@gmail.com>"

# Qemu support
COPY ./qemu-arm-static /usr/bin/qemu-arm-static

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

# Remove qemu binary
RUN rm /usr/bin/qemu-arm-static

# Change working directory
WORKDIR /code
