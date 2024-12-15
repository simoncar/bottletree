module.exports = {
	expo: {
		name: "One Build",
		slug: "bottletree",
		version: "1.0.190",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "bottletree",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		splash: {
			image: "./assets/images/splash.png",
			resizeMode: "contain",
			backgroundColor: "#5D5CE7"
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
			googleServicesFile: "./google-services.json",
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.png",
				backgroundColor: "#5D5CE7"
			},
			package: process.env.ANDROID_PACKAGE || "co.simon.bottletree"
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
				"expo-image-picker",
				{
					photosPermission: "Allow $(PRODUCT_NAME) to access your photos to share the images you select with other people that have access to the project."
				}
			],
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
			]
		]
	}
};