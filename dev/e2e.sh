#!/bin/bash

export uid=$(id -u)
export gid=$(id -g)
export compose="docker compose --file docker-compose.ci.yml --file docker-compose.ci-local.yml --project-name ero-like-$CI_PIPELINE_ID-$CI_JOB_ID"
export npm="$compose run --rm api npm"
export migrate="$npm run migrate"

#$migrate
#$npm run fixtures
$compose -d postgres
$compose ps
