#!/usr/bin/env bash
./gradlew clean assemble
cp ./build/libs/narwhal-0.0.1-SNAPSHOT.jar ./artifacts
