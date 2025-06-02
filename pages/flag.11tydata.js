export default {
	layout: "rich-text.njk",
	tags: ["flag"],
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
		categories: (data) => {
			const flag = data.flags[data.id];

			if (!Array.isArray(flag.related)) return;

			const collection = data.collections.flag;

			return flag.related.map((tag) => ({
				name: data.flags[tag].name,
				flags: collection
					.filter((item) => data.flags[item.data.id].related?.includes(tag))
					.filter((item) => data.id !== item.data.id)
					.map((item) => ({
						id: item.data.id,
						name: data.flags[item.data.id].name,
						url: item.page.url,
						aspectRatio: data.flags[item.data.id].aspectRatio,
						alt: data.flags[item.data.id].alt,
					})),
			}));
		},
	},
};
