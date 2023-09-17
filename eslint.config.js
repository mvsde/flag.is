import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import nodeModule from "eslint-plugin-n/configs/recommended-module.js";
import nodeScript from "eslint-plugin-n/configs/recommended-script.js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	js.configs.recommended,
	prettier,

	{
		ignores: ["build"],
	},

	{
		languageOptions: {
			ecmaVersion: "latest",
		},
		plugins: {
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
		},
	},

	{
		files: ["*.js"],
		...nodeModule,
	},
	{
		files: ["*.cjs"],
		...nodeScript,
	},

	{
		files: ["*.cjs", "eleventy/**/*.js"],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},

	{
		files: ["public/**/*.js"],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
];
