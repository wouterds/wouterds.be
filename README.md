# wouterdeschuyter.be

Source code of my personal website, [wouterdeschuyter.be](http://wouterdeschuyter.be). Open-source on Github. Yolo.

#### :construction: Work in progress! :construction:

Started on *23th of September 2017*.

Builds are auto deployed on push to [staging.wouterdeschuyter.be](http://staging.wouterdeschuyter.be).

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

Install NodeJS dependencies:

```shell
npm install
```

### Compiling frontend app

Compile the frontend app using Gulp:

```shell
gulp
```

Keep watching files for changes using:

```shell
gulp watch
```

If one of above commands fails, you probably need to install Gulp first:

```shell
npm install -g gulp
```

### Docker

Included Docker services:

- **nginx**
- **php**
- **mysql**

Just start Docker like this (add the `-d` flag to run in background):

### Database

Run the migrations on the database if not done already:

```shell
composer migrations:migrate
```

**Note:** This command needs to be run inside the running Docker container in order to be able to connect to the mysql database. But I also made a Make recipe for this to run it automatically inside the running Docker container:

```shell
make migrate
```
