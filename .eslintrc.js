module.exports = {
	root: true,
	extends: "@react-native-community",
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "prettier"],
	overrides: [
		{
			files: ["*.ts", "*.tsx", "*.js"],
			rules: {
				"prettier/prettier": "error",
				quotes: ["error", "double"],
				"@typescript-eslint/no-shadow": ["error"],
				"no-shadow": "off",
				"no-undef": "off",
			},
		},
	],
};
