// Metro config for using Expo inside this monorepo.
// It teaches Metro to watch the repo root (so it can resolve the `@tack/shared`
// workspace package) and to look for modules in both the app's and the root's
// node_modules. See https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Keep Expo's default watch folders and add the workspace root so Metro can
// resolve the `@tack/shared` package that lives outside this app's directory.
config.watchFolders = [...(config.watchFolders ?? []), workspaceRoot];
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
];

module.exports = config;
