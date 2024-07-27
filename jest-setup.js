import { Image } from "expo-image";

jest.mock("react-native", () => ({
	...jest.requireActual("react-native"),
	useColorScheme: jest.fn(),
}));

jest.mock("expo-image", () => {
	const actualExpoImage = jest.requireActual("expo-image");
	const { Image } = jest.requireActual("react-native");

	return { ...actualExpoImage, Image };
});

jest.mock("react-native", () => {
	const ReactNative = jest.requireActual("react-native");
	return Object.defineProperty(ReactNative, "Settings", {
		get: jest.fn(() => {
			return { get: jest.fn(), set: jest.fn(), watchKeys: jest.fn() };
		}),
	});
});
const mockedUseColorScheme = jest.fn();

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => {
	return {
		default: mockedUseColorScheme,
	};
});
