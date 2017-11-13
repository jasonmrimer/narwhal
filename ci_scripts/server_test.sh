#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o xtrace
set -o pipefail

export GRADLE_USER_HOME="${PWD}/gradle"

pushd repo

# ./gradlew flywayMigrate
./gradlew test
