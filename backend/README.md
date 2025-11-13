## Installation

```bash
# Build docker image and run in background
# This will automatically runs the Database Migration using Prisma
$ docker compose -d --build

$ npm install
```

## Create .env from .env.example
```bash
cp .env.example .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```

[http://localhost:8000](http://localhost:8000)

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
