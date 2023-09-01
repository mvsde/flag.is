const yaml = require("yaml");

const DIRECTORIES = {
	// Relative to current directory.
	input: "pages",
	output: "build",

	// Relative to "input" directory.
	layouts: "../layouts",
	includes: "../components",
	data: "../data",
};

/**
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig Eleventy configuration
 */
module.exports = function (eleventyConfig) {
	// Copy
	eleventyConfig.addPassthroughCopy("assets");
	eleventyConfig.addPassthroughCopy({ public: "/" });

	// Data
	eleventyConfig.addDataExtension("yaml", (content) => yaml.parse(content));
	eleventyConfig.addGlobalData("layout", "base.njk");
	eleventyConfig.addGlobalData("base", process.env.URL);

	return {
		dir: DIRECTORIES,
		markdownTemplateEngine: "njk",
	};
};
