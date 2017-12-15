all: tag

VERSION = $(shell cat package.json | grep "version" | sed -e 's/^.*: "\(.*\)".*/\1/')
PWD = $(shell pwd)

DOCKER_REPO  = docker.wouterdeschuyter.be
PROJECT_NAME = internal-wouterdeschuyter-website

TAG_NGINX_WEB = $(DOCKER_REPO)/$(PROJECT_NAME)-nginx-web
TAG_NGINX_API = $(DOCKER_REPO)/$(PROJECT_NAME)-nginx-api
TAG_PHP_FPM = $(DOCKER_REPO)/$(PROJECT_NAME)-php-fpm

DOCKERFILE_NGINX_WEB = ./docker/nginx-web/Dockerfile
DOCKERFILE_NGINX_API = ./docker/nginx-api/Dockerfile
DOCKERFILE_PHP_FPM = ./docker/php-fpm/Dockerfile

clean:
	-rm -rf ./.version
	-rm -rf ./node_modules
	-rm -rf ./package-lock.json
	-rm -rf ./vendor
	-rm -f ./composer.phar
	-rm -f ./composer-setup.php

composer.phar:
	docker run --rm --volume=$(PWD):/code -w=/code php:7.1-alpine php -r 'copy("https://getcomposer.org/installer", "./composer-setup.php");'
	docker run --rm --volume=$(PWD):/code -w=/code php:7.1-alpine php ./composer-setup.php
	docker run --rm --volume=$(PWD):/code -w=/code php:7.1-alpine php -r 'unlink("./composer-setup.php");'

vendor: composer.phar composer.json composer.lock
	docker run --rm --volume=$(PWD):/code -w=/code php:7.1-alpine php ./composer.phar install --ignore-platform-reqs --prefer-dist --no-progress --optimize-autoloader

node_modules: package.json
	docker run --rm --volume=$(PWD):/code -w=/code node:8-slim npm install

dependencies: vendor node_modules

lint: vendor
	docker run --rm --volume=$(PWD):/code -w=/code php:7.1-alpine php ./composer.phar lint

test: vendor
	docker exec -i internal-wouterdeschuyter-website-php-fpm php ./composer.phar test

migrate: vendor
	docker exec -i internal-wouterdeschuyter-website-php-fpm php ./composer.phar migrations:migrate

migrate-test: vendor
	docker exec -e MYSQL_DATABASE=wouterdeschuyter-tests -i internal-wouterdeschuyter-website-php-fpm php ./composer.phar migrations:migrate

new-migration: vendor
	docker exec -i internal-wouterdeschuyter-website-php-fpm php ./composer.phar migrations:generate

setup-db:
	docker exec -i internal-wouterdeschuyter-website-mysql mysql -uroot -proot < ./docker/mysql/setup.sql

setup: setup-db

.version:
	-git describe --abbrev=0 --tags > ./.version
	-git rev-list --tags --max-count=1 >> ./.version

dev: dependencies
	docker run --rm --volume=$(PWD):/code -w=/code node:8-slim npm start

.build-app: dependencies
	docker run --rm --volume=$(PWD):/code -w=/code node:8-slim npm run build
	touch .build-app

.build-nginx-web: $(DOCKERFILE_NGINX_WEB)
	docker build $(BUILD_NO_CACHE) -f $(DOCKERFILE_NGINX_WEB) -t $(TAG_NGINX_WEB) .
	touch .build-nginx-web

.build-nginx-api: $(DOCKERFILE_NGINX_API)
	docker build $(BUILD_NO_CACHE) -f $(DOCKERFILE_NGINX_API) -t $(TAG_NGINX_API) .
	touch .build-nginx-api

.build-php-fpm: $(DOCKERFILE_PHP_FPM)
	docker build $(BUILD_NO_CACHE) -f $(DOCKERFILE_PHP_FPM) -t $(TAG_PHP_FPM) .
	touch .build-php-fpm

build: .version .build-app .build-nginx-web .build-nginx-api .build-php-fpm

tag: build
	docker tag $(TAG_NGINX_WEB) $(TAG_NGINX_WEB):$(VERSION)
	docker tag $(TAG_NGINX_API) $(TAG_NGINX_API):$(VERSION)
	docker tag $(TAG_PHP_FPM) $(TAG_PHP_FPM):$(VERSION)

push: tag
	docker push $(TAG_NGINX_WEB):$(VERSION)
	docker push $(TAG_NGINX_API):$(VERSION)
	docker push $(TAG_PHP_FPM):$(VERSION)

push-latest: push
	docker push $(TAG_NGINX_WEB):latest
	docker push $(TAG_NGINX_API):latest
	docker push $(TAG_PHP_FPM):latest
