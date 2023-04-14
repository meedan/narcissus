# Narcissus

[![Maintainability](https://api.codeclimate.com/v1/badges/5247e8bc16825ce83d18/maintainability)](https://codeclimate.com/repos/5eab57cb05cace00cc00027c/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5247e8bc16825ce83d18/test_coverage)](https://codeclimate.com/repos/5eab57cb05cace00cc00027c/test_coverage)
[![Build Status](https://travis-ci.org/meedan/narcissus.svg?branch=develop)](https://travis-ci.org/meedan/narcissus)

Run Headless-Chrome by [Puppeteer](https://github.com/GoogleChrome/puppeteer) on AWS Lambda to take screenshots.

## Configuration

Copy `src/config.js.example` to `src/config.js` and adjust the configurations.

## Running locally

Just run `npm run local`, or `make run` to run in a Docker image.

## Running on AWS Lambda

Use Serverless by running `npm run deploy`.

## Running tests

Just run `npm run test` or `make test` to run in a Docker image.

## Calling the API

```
curl -X GET -H 'X-Api-Key: :key' http://host/?url=:url&selector=:selector
```

## TODO

* Compress images
