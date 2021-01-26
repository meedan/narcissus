#!/bin/bash

# Expects following environment variables to be populated:
#   DEPLOY_ENV

set -e
# check that required environment variables are set
if [[ -z ${DEPLOY_ENV+x} ]]; then
    echo "DEPLOY_ENV environment variable must be set. Exiting."
    exit 1
fi
echo "Running application in [${DEPLOY_ENV}] environment"

if [[ "${DEPLOY_ENV}" == "travis" || "${DEPLOY_ENV}" == "test" ]]; then
  npm run cov:before
  cp src/config.js.example src/config.js
  npm run lint
  npm run babel
  npm run test
  npm run cov:after

else
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false npm install
  cp src/config.js.example src/config.js
  npm run lint
  npm run babel
  cp -r node_modules dist
  SLOWMO_MS=250 node dist/local.js
fi

echo "$@"
exec "$@"
