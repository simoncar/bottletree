// Learn more https://docs.expo.io/guides/customizing-metro
//const { getDefaultConfig } = require("expo/metro-config");
// const { mergeConfig } = require("metro-config");
// const { createSentryMetroSerializer } = require("@sentry/react-native/dist/js/tools/sentryMetroSerializer");

// const defaultConfig = getDefaultConfig(__dirname);
// defaultConfig.resolver.assetExts.push("mjs", "cjs");

// const config = {
// 	serializer: {
// 		customSerializer: createSentryMetroSerializer(),
// 	},
// };


// module.exports = mergeConfig(defaultConfig, config);


const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = config;



