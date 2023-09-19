const yaml = require("yaml");

const image = import("./eleventy/image.js");
const metaData = import("./eleventy/meta-data.js");

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

	// Data
	eleventyConfig.addDataExtension("yaml", (content) => yaml.parse(content));
	eleventyConfig.addGlobalData("sw", process.env.SW === "true");
	eleventyConfig.addGlobalData("layout", "default.njk");
	eleventyConfig.addGlobalData("base", process.env.URL);

	// Shortcodes
	eleventyConfig.addShortcode("image", async (inputPath, preset) =>
		(await image).generateImage(inputPath, preset),
	);

	// Events
	eleventyConfig.on("eleventy.after", async () =>
		(await metaData).writeMetaData(),
	);

	return {
		dir: DIRECTORIES,
		markdownTemplateEngine: "njk",
	};
};

module.exports.DIRECTORIES = DIRECTORIES;
