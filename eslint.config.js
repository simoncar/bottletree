// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      // Node
      "node_modules/",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",

      // Expo
      ".expo/",
      ".expo-shared/",

      // Build
      "dist/",
      "build/",
      "web-build/",
      "android/",
      "ios/",

      // Misc
      "coverage/",
      ".env*",
    ],
  },
]);
