#!/usr/bin/env bash

set -e

function cleanup {
    cat ./tmp/narwhal.pid | xargs kill -9
    rm ./tmp/narwhal.pid
}
trap cleanup EXIT

export REACT_APP_HOST=http://localhost:9090

mkdir -p tmp

./gradlew clean

pushd client
yarn install
CI=true yarn test
yarn build

popd

if [ "$NARWHAL_MIL" = "true" ]
then
    ./gradlew test -PexcludeTests=**/UnicornMissionClientTest.class
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

pushd client
    CI=true yarn contracts
popd

if [ "$NARWHAL_CI" = "true" ]
then
    rspec
else
   bundle exec rspec
fi
