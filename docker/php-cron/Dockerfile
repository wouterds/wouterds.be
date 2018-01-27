FROM php:7.2-cli-alpine
MAINTAINER Wouter De Schuyter <wouter.de.schuyter@gmail.com>

# Install extensions
RUN NPROC=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) \
    && docker-php-ext-install -j${NPROC} pdo pdo_mysql mysqli

# Copy required files
COPY ./docker/php-cron/cronjobs /etc/cron.d/cronjobs
COPY . /code

# Setup cronjobs
RUN touch /var/log/cron.log
RUN chmod 644 /etc/cron.d/cronjobs
RUN crontab /etc/cron.d/cronjobs

# Change working directory
WORKDIR /code

CMD ["/usr/sbin/crond", "-f", "-d", "0"]
