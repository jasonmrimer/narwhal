#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o xtrace
set -o pipefail

export PATH="${PATH}:/root/.yarn/bin"
export GRADLE_USER_HOME="${PWD}/gradle"

pushd repo
./gradlew test
popd
