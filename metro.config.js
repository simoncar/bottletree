//const { getDefaultConfig } = require("expo/metro-config");
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const {
	wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");


//const config = getDefaultConfig(__dirname);
const config = getSentryExpoConfig(__dirname);

module.exports = wrapWithReanimatedMetroConfig(config);