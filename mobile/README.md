# Tack Mobile

Native iOS + Android app for **Tack**, built with [Expo](https://expo.dev) +
[expo-router](https://docs.expo.dev/router/introduction/). Its purpose: log in
once, then **share any link from any app into Tack** via the OS share sheet.

## How it works

- **Auth** — `POST /api/token` returns a JWT. It's stored in the OS keychain
  (`expo-secure-store`) and sent on every request via the `token` header (Tack's
  custom auth header — not `Authorization: Bearer`). Credentials are also stored
  securely so the app can silently re-login when the token expires (the backend
  has no refresh-token endpoint by design).
- **Share** — `expo-share-intent` registers an iOS Share Extension and an
  Android `SEND` intent filter. When you share a URL to Tack, the app opens the
  `/share` screen, which posts `{ inputString }` to `POST /api/tack`.
- **Shared contract** — request/response types and endpoint paths come from the
  `@tack/shared` workspace package (repo root `/shared`), so the app never
  drifts from the backend.

## Requirements

> **Expo Go will not work** — the native share extension requires a custom
> **development build** (`expo-dev-client`).

- Node 22 (repo `.nvmrc`)
- Xcode (iOS) / Android Studio (Android) for local builds, or an
  [EAS](https://docs.expo.dev/eas/) account for cloud builds

## Setup

Dependencies are managed from the **repo root** (npm workspaces):

```bash
# from the repo root
npm install
```

## Configure the API URL

The app talks to the Next.js backend. Point it at your backend with either:

- `app.json` → `expo.extra.apiBaseUrl` (default, production), or
- an env var at start time (best for local dev against `make dev`):

```bash
# from /mobile — use your machine's LAN IP, not localhost, for a real device
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:3000 npm start
```

## Run a development build

```bash
cd mobile

# generate native projects + build/install a dev client on a device/simulator
npm run ios      # or: npm run android

# then start the dev server (dev client)
npm start
```

## Verify the star feature (end-to-end)

1. Log in inside the app.
2. Open Safari/Chrome (or any app), tap **Share**, choose **Tack**.
3. Confirm on the `/share` screen and tap **Save tack**.
4. Verify it appears in your account (web profile, or `GET /api/tack/tacks`).

## Project layout

```
mobile/
├─ app/              # expo-router screens
│  ├─ _layout.tsx    # ShareIntentProvider + routes shares to /share
│  ├─ index.tsx      # home (manual add + logout)
│  ├─ login.tsx      # email/password login
│  └─ share.tsx      # ★ receives shared URL → POST /api/tack
├─ lib/
│  ├─ config.ts      # API base URL resolution
│  ├─ auth.ts        # secure token + credential storage
│  └─ api.ts         # login + addTack (+ silent re-login)
├─ app.json          # Expo config incl. share-intent + secure-store plugins
└─ metro.config.js   # monorepo resolution for @tack/shared
```
