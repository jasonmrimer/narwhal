#!/usr/bin/env bash
mysql -u root -e "create database narwhaldev;"
mysql -u root -e "create user 'narwhal'@'localhost';"
mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO 'narwhal'@'localhost';"
