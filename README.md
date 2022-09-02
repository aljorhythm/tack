[![CI](https://github.com/aljorhythm/tack/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/aljorhythm/tack/actions/workflows/main.yml)

[![deploy to prod](https://github.com/aljorhythm/tack/actions/workflows/prod-deploy.yml/badge.svg?branch=main)](https://github.com/aljorhythm/tack/actions/workflows/prod-deploy.yml)

# Product

[Mural Canvas](https://app.mural.co/invitation/mural/twma7655/1661487340741?sender=uafe6f99b472d75abca6b1727&key=dcc5b1d2-015b-42bb-b1bc-66d0d7f52696)

[Trello](https://trello.com/invite/b/e7vsZBhG/125c5035cec022001b3bfc841abee266/tack)

# Technology

-   written in `typescript`
-   Password hashing with `bycryptjs`
-   Persistence with `mongodb`
-   api middleware with `next-connect`
-   unit testin with `jest`
-   E2E and API testing with `playwright`
    -   extended matchers with `expect-playwright`
-   styling with `tailwind.css`
-   workflow supported by `nodemon`, `makefile`
-   continuously deployed with `github actions`
-   hosted in `vercel`

# Contribution

## Environment variables

```
MONGODB_URI=mongodb://localhost:27017
AUTH_TOKEN_SECRET=somesecret
```

## Development

Example: Run development mode and tests

```
make dev &
TEST_HOST=http://localhost:3000 nodemon -e ts,tsx --exec CI=true npx playwright test api-tests --project=chromium
```
