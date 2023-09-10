module.exports = {
	layout: "rich-text.njk",
	pagination: {
		data: "flags",
		size: 1,
		alias: "id",
	},
	permalink: (data) => `${data.id}/index.html`,
	eleventyComputed: {
		title: (data) => data.flags[data.id].name,
		description: (data) => `${data.flags[data.id].name} pride flag`,
		social: {
			image: (data) => `data/flags/${data.id}.svg`,
			image_alt: (data) => `${data.flags[data.id].name} flag`,
			image_preset: "flag",
		},
	},
};
