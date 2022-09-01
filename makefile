setup:
	git config core.hooksPath .githooks
	npm ci
	npx playwright install --with-deps chromium webkit

format-check:
	npx prettier --check .

format:
	npx prettier --write .

.PHONY: build
build:
	npm run build

.PHONY: test
test:
	npm run test

test-ci:
	npm run test:ci

test-with-external:
	npm run test:external

test-e2e:
	sh test-e2e.sh

.PHONY: dev
dev:
	npm run dev

run:
	npm run start