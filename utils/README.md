# utils

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

# To run postgres docker

## Start postgresql server docker image:
```bash
docker run --rm --name pg -p 5432:5432  -e POSTGRES_PASSWORD=welcome  postgres:15
```
