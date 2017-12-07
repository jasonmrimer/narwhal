#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o xtrace
set -o pipefail

export PATH="${PATH}:/root/.yarn/bin"
export GRADLE_USER_HOME="${PWD}/gradle"

find /var/lib/mysql -type f -exec touch {} \;
service mysql start
mysql -u root -e "create database narwhaldev;"
mysql -u root -e "create user 'narwhal'@'localhost';"
mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO 'narwhal'@'localhost';"

pushd repo
./all-tests.sh
popd
