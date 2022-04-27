#!/bin/bash
set -e

export NODE_OPTIONS="--max-old-space-size=8192"

npm install

./node_modules/.bin/depcheck . --ignores="@types/*,depcheck,typescript"

npm run lint

npm run test:cover

./test/totalCoverage.js
