#!/bin/bash

# Remove the ipv6 mapping for localhost so that selenium can resolve correctly
cp /etc/hosts ~/hosts.new
sed -i 's/::1/# ::1/g' ~/hosts.new
cp -f ~/hosts.new /etc/hosts

set -e

until curl ${NARWHAL_APP_URL:='http://localhost:8080'} &>/dev/null; do
    sleep 1
done

bash -c "bundle exec rspec"
