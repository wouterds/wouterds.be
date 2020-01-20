PWD = $(shell pwd)
VERSION = $(shell cat package.json | grep "\"version\"" | sed -e 's/^.*: "\(.*\)".*/\1/')

DOCKER_COMPOSE = ./.docker/docker-compose${ENV_SUFFIX}.yml
DOCKERFILE_NODE = ./.docker/node/Dockerfile
DOCKERFILE_NGINX = ./.docker/nginx/Dockerfile

TAG_PREFIX = docker.wouterdeschuyter.be/wouterdeschuyter.be
TAG_NODE = ${TAG_PREFIX}/node
TAG_NGINX = ${TAG_PREFIX}/nginx

all: build

clean:
	-rm -rf node_modules
	-rm -rf .next
	-rm -rf .env
	-rm -rf .build-*

node_modules: yarn.lock
	docker run --rm -v ${PWD}:/code -w /code node:12-slim yarn

lint: node_modules
	docker run --rm -v ${PWD}:/code -w /code node:12-slim yarn lint

.build-app: node_modules
	docker run --rm -v ${PWD}:/code -w /code -e URL -e API_ENDPOINT -e RECAPTCHA_SITE_KEY -e GA_TRACKING_ID -e ENV -e SPOTIFY_CLIENT_ID node:12-slim yarn build
	touch .build-app

.build-nginx: ${DOCKERFILE_NGINX}
	docker build -f ${DOCKERFILE_NGINX} -t ${TAG_NGINX}:latest${ENV_SUFFIX} .
	touch .build-nginx

.build-node: .build-app ${DOCKERFILE_NODE}
	docker build -f ${DOCKERFILE_NODE} -t ${TAG_NODE}:latest${ENV_SUFFIX} .
	touch .build-node

build: .build-node .build-nginx
	docker tag ${TAG_NODE}:latest${ENV_SUFFIX} ${TAG_NODE}:${VERSION}${ENV_SUFFIX}
	docker tag ${TAG_NGINX}:latest${ENV_SUFFIX} ${TAG_NGINX}:${VERSION}${ENV_SUFFIX}

docker-login:
	docker login docker.wouterdeschuyter.be -u ${DOCKER_REGISTRY_USER} -p ${DOCKER_REGISTRY_PASS}

push: docker-login build
	docker push ${TAG_NODE}:latest${ENV_SUFFIX}
	docker push ${TAG_NODE}:${VERSION}${ENV_SUFFIX}
	docker push ${TAG_NGINX}:latest${ENV_SUFFIX}
	docker push ${TAG_NGINX}:${VERSION}${ENV_SUFFIX}

deploy:
	ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}${ENV_SUFFIX}"
	scp ${DOCKER_COMPOSE} ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}${ENV_SUFFIX}/docker-compose.yml
	ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH}${ENV_SUFFIX}; docker-compose pull"
	ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH}${ENV_SUFFIX}; docker-compose up -d"
