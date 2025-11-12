const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// - for expo-sqlite Add wasm asset support
config.resolver = config.resolver || {};
config.resolver.assetExts = config.resolver.assetExts || [];
if (!config.resolver.assetExts.includes("wasm")) {
  config.resolver.assetExts.push("wasm");
}

// - for expo-sqlite Add COEP and COOP headers to support SharedArrayBuffer
const previousEnhanceMiddleware = config.server?.enhanceMiddleware;
config.server = config.server || {};
config.server.enhanceMiddleware = (middleware) => {
  // Preserve any existing enhancer
  const mw = previousEnhanceMiddleware
    ? previousEnhanceMiddleware(middleware)
    : middleware;

  return (req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    return mw(req, res, next);
  };
};

module.exports = config;
