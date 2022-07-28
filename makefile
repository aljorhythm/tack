setup:
	git config core.hooksPath .githooks
	npm ci

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

dev:
	npm run dev

run:
	npm run start