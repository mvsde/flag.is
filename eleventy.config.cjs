const yaml = require("yaml");
const image = import("./image.js");

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
	eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
	eleventyConfig.addPassthroughCopy({ public: "/" });
	eleventyConfig.addPassthroughCopy({ "data/flags/*.svg": "img" });

	// Data
	eleventyConfig.addDataExtension("yaml", (content) => yaml.parse(content));
	eleventyConfig.addGlobalData("layout", "base.njk");
	eleventyConfig.addGlobalData("base", process.env.URL);

	// Shortcodes
	eleventyConfig.addShortcode("image", async (inputPath, preset) =>
		(await image).generateImage(inputPath, preset),
	);

	return {
		dir: DIRECTORIES,
		markdownTemplateEngine: "njk",
	};
};

module.exports.DIRECTORIES = DIRECTORIES;
