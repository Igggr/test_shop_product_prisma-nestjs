Поднять БД

```bash
$ docker compose -f db/docker-compose.yaml up -d
```

запустить e2e-тесты

```bash
$ docker compose -f db/docker-compose.yaml up -d
$ npm run test:e2e
```