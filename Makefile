SHELL := /bin/sh

build.local:
	docker build . -t narcissus

build.test:
	docker-compose build narcissus

build: build.local


test: build.test
	DEPLOY_ENV=test docker-compose up


run.local: build
	docker run -e DEPLOY_ENV=local -t narcissus

run.prod: build
	docker run -e DEPLOY_ENV -t narcissus


run: run.local


clean:
	docker-compose down
