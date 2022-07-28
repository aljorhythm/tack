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

test:
	npm run test

test-nowatch:
	npm run test:no-watch

dev:
	npm run dev

run:
	npm run start