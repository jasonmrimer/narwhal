#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o xtrace
set -o pipefail

export PATH="${PATH}:/root/.yarn/bin"
export GRADLE_USER_HOME="${PWD}/gradle"

pushd repo

pushd client
yarn install --no-progress
yarn build
popd

./gradlew clean assemble

popd

cp -R repo/build artifacts/
cp repo/manifest.yml artifacts/
ls -al artifacts
ls -al artifacts/build
ls -al artifacts/build/libs
