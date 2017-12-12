# :construction: wouterdeschuyter.be

Source code of my personal website, [wouterdeschuyter.be](http://wouterdeschuyter.be). Open-source on Github. Yolo.

Builds are auto deployed on push to [staging.wouterdeschuyter.be](http://staging.wouterdeschuyter.be).

## Setup

Add an entry to your `/etc/hosts` file:

```shell
127.0.0.1 dev.wouterdeschuyter.be
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

Install NodeJS dependencies:

```shell
npm install
```

### Compiling frontend app

Compile the frontend app using:

```shell
npm run build
```

To compile and keep watching files for changes use:

```shell
npm start
```

### Docker

Included Docker services:

- **nginx**
- **php**
- **mysql**

Just start Docker like this (add the `-d` flag to run in background):

```shell
docker-compose -f ./docker/docker-compose-dev.yml up
```

### Database

Run the migrations on the database if not done already:

```shell
composer migrations:migrate
```

**Note:** This command needs to be run inside the running Docker container in order to be able to connect to the mysql database. But I also made a Make recipe for this to run it automatically inside the running Docker container:

```shell
make migrate
```
