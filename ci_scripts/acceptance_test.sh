#!/bin/bash

set -e

until curl ${NARWHAL_APP_URL:='http://localhost:8080'} &>/dev/null; do
    sleep 1
done

bash -c "bundle exec rspec"
