module.exports = {
	pagination: {
		data: "flags",
		size: 1,
		alias: "id",
	},
	permalink: (data) => `flags/${data.id}/index.html`,
	eleventyComputed: {
		title: (data) => data.flags[data.id].name,
	},
};
