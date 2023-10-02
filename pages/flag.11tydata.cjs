module.exports = {
	layout: "rich-text.njk",
	pagination: {
		data: "flags",
		size: 1,
		alias: "id",
		addAllPagesToCollections: true,
	},
	permalink: (data) => `${data.id}/index.html`,
	eleventyComputed: {
		title: (data) => data.flags[data.id].name,
		description: (data) =>
			data.flags[data.id].description ??
			`${data.flags[data.id].name} pride flag`,
		social: {
			image: (data) => `public/img/${data.id}.svg`,
			imageAlt: (data) => `${data.flags[data.id].name} flag`,
			imagePreset: "flag",
		},
	},
};
