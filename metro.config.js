// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from "expo/metro-config";

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push("cjs");

export default defaultConfig;