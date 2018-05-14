#!/usr/bin/env bash

set -e

BASE_DIR=`pwd`

function cleanup {
    cat ${BASE_DIR}/tmp/narwhal.pid | xargs kill -9
    rm ${BASE_DIR}/tmp/narwhal.pid
}
trap cleanup EXIT

export REACT_APP_HOST=http://localhost:9090
source ./scripts/setup_env.sh

mkdir -p tmp

./gradlew clean

pushd client
yarn install
CI=true yarn test
yarn build
popd

if [ "$NARWHAL_CI" = "true" ]
then
    ./gradlew --stop
    ./gradlew test
else
    ./gradlew test
fi

./gradlew assemble
java -jar ./build/libs/narwhal-0.0.1-SNAPSHOT.jar --server.port=9090 &>./tmp/test.log &
echo $! > ./tmp/narwhal.pid

COUNTER=0
until curl http://localhost:9090 &>/dev/null; do
    sleep 1
    let COUNTER+=1

    if [[ "$COUNTER" -gt 40 ]]
    then
        echo "Could not connect to app server. Ya blew it!"
        exit 1
    fi

    if [[ $(( $COUNTER % 5 )) -eq 0 ]]
    then
        echo "Attempting to connect to the app server..."
    fi
done

./scripts/seed_db.sh

pushd client
    CI=true yarn test --testMatch='<rootDir>\src\**\?(*.)contract.ts?(x)'
popd

pushd acceptance
if [ "$NARWHAL_CI" = "true" ]
then
    rspec
else
   bundle exec rspec
fi
popd
