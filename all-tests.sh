#!/usr/bin/env bash

set -e
function cleanup {
    cat ./tmp/narwhal.pid | xargs kill -9
    rm ./tmp/narwhal.pid
}
trap cleanup EXIT

mkdir -p tmp

./gradlew clean

pushd client
yarn install
CI=true yarn test
yarn build
popd

./gradlew test

./gradlew assemble
java -jar ./build/libs/narwhal-0.0.1-SNAPSHOT.jar &>./tmp/test.log &
echo $! > ./tmp/narwhal.pid

until curl http://localhost:8080 &>/dev/null; do
    sleep 1
done

pushd client
CI=true yarn contracts
popd

if [ "$NARWHAL_CI" = "true" ]
then
    rspec
else
    bundle exec rspec
fi