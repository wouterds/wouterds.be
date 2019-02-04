all: tag

PWD = $(shell pwd)

VERSION = 7.0.9
DOCKER_REPO  = docker.wouterdeschuyter.be
PROJECT_NAME = wouterdeschuyter-website

TAG_NGINX = $(DOCKER_REPO)/$(PROJECT_NAME)-nginx
TAG_PHP_FPM = $(DOCKER_REPO)/$(PROJECT_NAME)-php-fpm
TAG_PHP_CRON = $(DOCKER_REPO)/$(PROJECT_NAME)-php-cron

DOCKERFILE_NGINX = ./.docker/nginx/Dockerfile
DOCKERFILE_PHP_FPM = ./.docker/php-fpm/Dockerfile
DOCKERFILE_PHP_CRON = ./.docker/php-cron/Dockerfile

clean:
	-rm -rf ./.version
	-rm -rf ./node_modules
	-rm -rf ./package-lock.json
	-rm -rf ./vendor
	-rm -f ./composer.phar
	-rm -f ./composer-setup.php
	-rm -f ./.build-*
	-rm -f ./qemu-arm-static

qemu-support:
	curl -OL https://github.com/multiarch/qemu-user-static/releases/download/v3.1.0-2/qemu-arm-static
	chmod +x qemu-arm-static
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

composer.phar:
	docker run --rm --volume=$(PWD):/code -w=/code php:7.3-alpine php -r 'copy("https://getcomposer.org/installer", "./composer-setup.php");'
	docker run --rm --volume=$(PWD):/code -w=/code php:7.3-alpine php ./composer-setup.php
	docker run --rm --volume=$(PWD):/code -w=/code php:7.3-alpine php -r 'unlink("./composer-setup.php");'

vendor: composer.phar composer.json composer.lock
	docker run --rm --volume=$(PWD):/code -w=/code php:7.3-alpine php ./composer.phar install --ignore-platform-reqs --prefer-dist --no-progress --optimize-autoloader

node_modules: package.json
	docker run --rm --volume=$(PWD):/code -w=/code node:8-slim npm install

dependencies: vendor node_modules

lint: vendor
	docker run --rm --volume=$(PWD):/code -w=/code php:7.3-alpine php ./composer.phar lint

test-unit: vendor
	docker run --rm --volume=$(PWD):/code -w=/code php:7.3-alpine php ./composer.phar test:unit

test-database: vendor
	docker exec -i wouterdeschuyter-website-php-fpm php ./composer.phar test:database

test: vendor
	docker exec -i wouterdeschuyter-website-php-fpm php ./composer.phar test

migrate: vendor
	docker exec -i wouterdeschuyter-website-php-fpm php ./composer.phar migrations:migrate

migrate-test: vendor
	docker exec -e MYSQL_DATABASE=wouterdeschuyter-tests -i wouterdeschuyter-website-php-fpm php ./composer.phar migrations:migrate

new-migration: vendor
	docker exec -i wouterdeschuyter-website-php-fpm php ./composer.phar migrations:generate

setup-db:
	docker exec -i wouterdeschuyter-website-mysql mysql -uroot -proot < ./.docker/mysql/setup.sql

setup: setup-db migrate .build-app

.version:
	-git describe --abbrev=0 --tags > ./.version
	-git rev-list --tags --max-count=1 >> ./.version

dev: dependencies
	docker run --rm --volume=$(PWD):/code -w=/code node:8-slim npm start

.build-app: node_modules
	docker run --rm --volume=$(PWD):/code -w=/code node:8-slim npm run build
	touch .build-app

.build-nginx: $(DOCKERFILE_NGINX)
	docker build $(BUILD_NO_CACHE) -f $(DOCKERFILE_NGINX) -t $(TAG_NGINX) .
	touch .build-nginx

.build-php-cron: $(DOCKERFILE_PHP_CRON)
	docker build $(BUILD_NO_CACHE) -f $(DOCKERFILE_PHP_CRON) -t $(TAG_PHP_CRON) .
	touch .build-php-cron

.build-php-fpm: $(DOCKERFILE_PHP_FPM)
	docker build $(BUILD_NO_CACHE) -f $(DOCKERFILE_PHP_FPM) -t $(TAG_PHP_FPM) .
	touch .build-php-fpm

build: qemu-support dependencies .version .build-app .build-nginx .build-php-cron .build-php-fpm

tag: build
	docker tag $(TAG_NGINX) $(TAG_NGINX):$(VERSION)
	docker tag $(TAG_PHP_FPM) $(TAG_PHP_FPM):$(VERSION)
	docker tag $(TAG_PHP_CRON) $(TAG_PHP_CRON):$(VERSION)

push: tag
	docker push $(TAG_NGINX):$(VERSION)
	docker push $(TAG_PHP_FPM):$(VERSION)
	docker push $(TAG_PHP_CRON):$(VERSION)

push-latest: push
	docker push $(TAG_NGINX):latest
	docker push $(TAG_PHP_FPM):latest
	docker push $(TAG_PHP_CRON):latest

deploy:
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "mkdir -p ${DEPLOY_LOCATION}"
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "mkdir -p ${DEPLOY_LOCATION}/logs && chmod 777 ${DEPLOY_LOCATION}/logs"
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "mkdir -p ${DEPLOY_LOCATION}/media && chmod 777 ${DEPLOY_LOCATION}/media"

	scp ./.docker/docker-compose.yml ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_LOCATION}/docker-compose.yml
	scp ./.docker/docker-compose-prod.yml ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_LOCATION}/docker-compose-prod.yml
	scp ./.docker/docker.env ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_LOCATION}/docker.env

	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "cd ${DEPLOY_LOCATION}; docker-compose -f docker-compose.yml -f docker-compose-prod.yml pull"
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "cd ${DEPLOY_LOCATION}; docker-compose -f docker-compose.yml -f docker-compose-prod.yml down --volume"
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "cd ${DEPLOY_LOCATION}; docker-compose -f docker-compose.yml -f docker-compose-prod.yml up -d"

	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "docker exec ${DEPLOY_CONTAINER}_php-cron_1 php ./composer.phar migrations:migrate"
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "docker exec ${DEPLOY_CONTAINER}_php-cron_1 php ./console/app generate:sitemap"
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "docker exec ${DEPLOY_CONTAINER}_php-cron_1 php ./console/app generate:robots"
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "docker exec ${DEPLOY_CONTAINER}_php-cron_1 php ./console/app generate:rss"
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "docker exec ${DEPLOY_CONTAINER}_php-cron_1 php ./console/app blog:generate-structured-data"
