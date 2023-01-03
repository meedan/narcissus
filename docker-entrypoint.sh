#!/bin/bash

# Expects following environment variables to be populated:
#   DEPLOY_ENV, CONFIG_JS (optional)

set -e
# check that required environment variables are set
if [[ -z ${DEPLOY_ENV+x} ]]; then
    echo "DEPLOY_ENV environment variable must be set. Exiting."
    exit 1
fi
echo "Running application in [${DEPLOY_ENV}] environment"

if [[ "${DEPLOY_ENV}" == "travis" || "${DEPLOY_ENV}" == "test" ]]; then
  if [[ -n ${CC_TEST_REPORTER_ID+x} ]]; then
    npm run cov:before
  fi
  cp src/config.js.example src/config.js
  npm run lint
  npm run babel
  npm run test
  if [[ -n ${CC_TEST_REPORTER_ID+x} ]]; then
    npm run cov:after
  fi

else
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false npm install
  cp src/config.js.example src/config.js
  # Create config.js from environment if set.
  if [[ "${CONFIG_JS}" != "" ]]; then
    WORKTMP=$(mktemp)
    echo ${CONFIG_JS} | base64 -d > $WORKTMP
    if (( $? != 0 )); then
      echo "Error: could not decode CONFIG_JS ENV var: ${CONFIG_JS} . Using defaults."
      rm $WORKTMP
    else
      echo "Using decoded CONFIG_JS from ENV var: ${CONFIG_JS} ."
      mv $WORKTMP src/config.js
      sha1sum src/config.js
    fi
  fi
  npm run lint
  npm run babel
  cp -r node_modules dist
  SLOWMO_MS=250 node dist/local.js
fi

echo "$@"
exec "$@"
