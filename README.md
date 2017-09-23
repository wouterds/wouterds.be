# wouterdeschuyter.be

Source code of my personal website, [wouterdeschuyter.be](http://wouterdeschuyter.be). Open-source on Github. Yolo.

## Setup

Add an entry to your `/etc/hosts` file:

```shell
127.0.0.1 wouterdeschuyter.dev
```

### Environment variables

```shell
cp .env.example .env
```

### Dependencies

Install Composer dependencies:

```shell
composer install
```

### Docker

Included Docker services:

- **nginx**
- **php**

Just start Docker like this (add the `-d` flag to run in background):

```shell
docker-compose -f docker/docker-compose.yml up
```
