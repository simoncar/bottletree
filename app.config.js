module.exports = ({ config }) => {
	const isDev = process.env.APP_ENV === "development" || process.env.APP_ENV === "staging" || process.env.APP_ENV === "apk";

	return {
		expo: {
			name: isDev ? "One Build DEV" : "One Build",
			slug: "bottletree",
			version: "1.0.198",
			orientation: "portrait",
			icon: "./assets/images/icon.png",
			scheme: "bottletree",
			userInterfaceStyle: "automatic",
			newArchEnabled: true,
			splash: {
				image: "./assets/images/splash.png",
				resizeMode: "contain",
				backgroundColor: isDev ? "#5D5CE7" : "#F9D96D",
			},
			assetBundlePatterns: ["**/*"],
			ios: {
				googleServicesFile: "./GoogleService-Info.plist",
				supportsTablet: true,
				bundleIdentifier: "com.simoncar.bottletree",
				config: {
					usesNonExemptEncryption: false
				},
				associatedDomains: ["applinks:b.otbapps.com", "applinks:b.simon.co"]
			},
			android: {
				googleServicesFile: "./" + process.env.GOOGLE_SERVICES_FILE,
				adaptiveIcon: {
					foregroundImage: "./assets/images/adaptive-icon.png",
					backgroundColor: isDev ? "#5D5CE7" : "#F9D96D",
				},
				package: process.env.ANDROID_PACKAGE || "co.simon.bottletree",
				"permissions": [
					"READ_EXTERNAL_STORAGE",
					"WRITE_EXTERNAL_STORAGE"
				]
			},
			web: {
				bundler: "metro",
				output: "static",
				favicon: "./assets/images/favicon.png"
			},
			extra: {
				router: {
					origin: false
				},
				eas: {
					projectId: "c4340333-f23a-41cb-a647-97dee3bc0a01"
				}
			},
			runtimeVersion: {
				policy: "sdkVersion"
			},
			updates: {
				url: "https://u.expo.dev/c4340333-f23a-41cb-a647-97dee3bc0a01"
			},
			experiments: {
				typedRoutes: true
			},
			plugins: [
				"@react-native-firebase/app",
				"@react-native-firebase/auth",
				[
					"expo-build-properties",
					{
						"ios": {
							"useFrameworks": "static"
						}
					}
				],
				"expo-font",
				[
					"expo-image-picker",
					{
						photosPermission: "Allow $(PRODUCT_NAME) to access your photos to share the images you select with other people that have access to the project."
					}
				],
				"expo-router",
				[
					"expo-contacts",
					{
						contactsPermission: "Allow $(PRODUCT_NAME) to access your contacts to select people you want to share a project with."
					}
				],
				[
					"expo-camera",
					{
						cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to take photos and videos."
					}
				],
				[
					"@sentry/react-native/expo",
					{
						"organization": "simon-co",
						"project": "bottletree",
						"url": "https://sentry.io/"
					}
				]
			]
		}
	}
}