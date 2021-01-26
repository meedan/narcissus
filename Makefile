SHELL := /bin/sh

build.local:
	docker build narcissus

build.test:
	docker-compose build narcissus

build: build.local


test: build.test
	DEPLOY_ENV=test docker-compose up


run.local: build
	DEPLOY_ENV=local docker up narcissus

run.prod: build
	DEPLOY_ENV=${DEPLOY_ENV} docker up

run: run.local


clean:
	docker-compose down
