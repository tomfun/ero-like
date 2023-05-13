# Ero

## Project setup

1. for local development setup db:
```bash
docker-compose up db
```

2. Go to *api* and follow instructions
3. Go to *frontend* and follow instructions

## API has end to end (e2e) tests

Locally you can run it:
```bash
source ./dev/e2e-local.sh
# ....
# $npm run test:e2e -- --colors
# $test_debug
# ....

# You can run it
$npm run test:e2e -- --colors
# Or debug
$test_debug
```
