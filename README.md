запустить e2e-тесты

```bash
$ docker compose -f db/docker-compose.testing.yaml up -d
$ npm run test:e2e
```

поднять БД

```bash
$ docker compose -f db/docker-compose.yaml up -d
```