default: build

clean:
	-rm -rf ./.version
	-rm -rf ./node_modules
	-rm -rf ./vendor
	-rm -f ./.build-*
	-rm -f ./public/static
	-rm -f composer.phar

composer.phar:
	docker run --rm --volume=$(PWD):/code -w=/code php:7.1-alpine php -r 'copy("https://getcomposer.org/installer", "composer-setup.php");'
	docker run --rm --volume=$(PWD):/code -w=/code php:7.1-alpine php composer-setup.php
	docker run --rm --volume=$(PWD):/code -w=/code php:7.1-alpine php -r 'unlink("composer-setup.php");'

vendor: composer.phar composer.lock
	docker run --rm --volume=$(PWD):/code -w=/code php:7.1-alpine php composer.phar install --ignore-platform-reqs --prefer-dist --no-progress --optimize-autoloader

node_modules: package-lock.json
	docker run --rm --volume=$(PWD):/code -w=/code node:8-alpine npm install

dependencies: vendor node_modules

build: dependencies
	-git describe --abbrev=0 --tags > ./.version
	-git rev-list --tags --max-count=1 >> ./.version
