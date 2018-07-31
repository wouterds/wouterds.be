FROM arm32v6/php:7.2-fpm-alpine
LABEL maintainer="Wouter De Schuyter <wouter.de.schuyter@gmail.com>"

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
COPY ./docker/php-cron/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY ./docker/php-cron/cronjobs /etc/cron.d/cronjobs
COPY . /code

# Setup cronjobs
RUN touch /var/log/cron.log
RUN chmod 644 /etc/cron.d/cronjobs
RUN crontab /etc/cron.d/cronjobs

# Change working directory
WORKDIR /code

CMD ["/usr/sbin/crond", "-f", "-d", "0"]
