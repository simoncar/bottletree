// eslint.config.js
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
	{
		plugins: {
			"@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
			"react": require("eslint-plugin-react"),
			"react-native": require("eslint-plugin-react-native"),

		},
		rules: {
			semi: "error",
			"prefer-const": "error",
			"linebreak-style": ["error", "unix"],
			"quotes": ["error", "double"],
			"react-native/no-unused-styles": 2,
			"react-native/split-platform-components": 2,
			"@typescript-eslint/no-explicit-any": "off",
			"react-native/no-inline-styles": 2,
			"react-native/no-color-literals": 0,
			"react-native/no-raw-text": 2,
			"react-native/no-single-element-style-arrays": 2,
			"@typescript-eslint/explicit-function-return-type": "warn",
			"@typescript-eslint/no-unused-vars": "off"
		},
	}
]);