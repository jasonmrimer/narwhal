#!/usr/bin/env bash
mysql -u root narwhaldev < $(dirname $0)/seed_data.sql