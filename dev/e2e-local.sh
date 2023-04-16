#!/bin/bash

export CI_PIPELINE_ID=100
export CI_JOB_ID=22

export uid=$(id -u)
export gid=$(id -g)
export compose="docker compose --file docker-compose.ci.yml --file docker-compose.ci-local.yml --project-name ero-like-$CI_PIPELINE_ID-$CI_JOB_ID"
export npm="$compose run --rm api npm"
export migrate="$npm run migrate"

$migrate
$npm run fixtures
$compose ps

echo '$npm run test:e2e -- --colors'

export test_debug="$compose run --service-ports -v ./api:/ero-like/api api npm run test:e2e:debug -- --colors"
echo '$test_debug'


echo docker compose --file docker-compose.ci.yml --file docker-compose.ci-local.yml --project-name ero-like-$CI_PIPELINE_ID-$CI_JOB_ID down --volumes --remove-orphans
