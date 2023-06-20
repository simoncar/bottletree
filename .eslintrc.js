module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"react-native/react-native": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 13,
		"sourceType": "module"
	},
	"plugins": [
		"react",
		"react-native",
		"@typescript-eslint"
	],
	"rules": {

		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"react-native/no-unused-styles": 2,
		"react-native/split-platform-components": 2,
		"react-native/no-inline-styles": 2,
		"react-native/no-color-literals": 0,
		"react-native/no-raw-text": 2,
		"react-native/no-single-element-style-arrays": 2,


	}
};
