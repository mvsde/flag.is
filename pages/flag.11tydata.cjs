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
		description: (data) => data.flags[data.id].description,
		social: {
			image: (data) => `public/img/${data.id}.svg`,
			imageAlt: (data) =>
				`${data.flags[data.id].name} flag. ${data.flags[data.id].alt}`,
			imagePreset: "flag",
		},
	},
};
