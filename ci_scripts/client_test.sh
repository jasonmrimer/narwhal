#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o xtrace
set -o pipefail

export PATH="${PATH}:/root/.yarn/bin"

pushd repo/client

yarn install --no-progress
CI=true yarn test