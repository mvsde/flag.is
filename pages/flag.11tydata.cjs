const image = import("../image.js");

module.exports = {
	pagination: {
		data: "flags",
		size: 1,
		alias: "id",
	},
	permalink: (data) => `flags/${data.id}/index.html`,
	eleventyComputed: {
		title: (data) => data.flags[data.id].name,
		social: {
			image: async (data) =>
				(await image).createSocialShareFlag(`data/flags/${data.id}.svg`),
			image_alt: (data) => `${data.flags[data.id].name} flag`,
		},
	},
};
