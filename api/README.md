## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

### Before npm install
You need to build [../client-config]
to do so follow build section in [../client-config/README.md]

### npm install
```bash
npm install
```

## Running the app

### Fixtures
Prefill with testing data
https://github.com/RobinCK/typeorm-fixtures

```bash
docker compose run api \
  npm run fixtures
```

### Migrations
```bash
# development
npm run build
npm run migrate
```

### After

```bash
# development
docker-compose up api
```

see start node scripts
```bash
npm run

# watch mode
# npm run start:dev
# ...
```

## Create Migration
```bash
# ts-node ./node_modules/typeorm/cli.js migration:create api/src/migration/some-name-here
# or
npx typeorm migration:create api/src/migration/some-name-here
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
