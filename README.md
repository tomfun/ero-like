# Ero

## Project setup

1. set ids mappings (optional for mac users)
```bash
echo "USER=$(id -nu)" >> .env
echo "uid=$(id -u)" >> .env
echo "gid=$(id -g)" >> .env
```
it creates `.env` file with something like that:
```dotenv
USER=tomfun
uid=1000
gid=1000
```
2. for local development setup db:
```bash
docker-compose up db
```
3. Go to *api* and follow instructions
4. Go to *frontend* and follow instructions

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
