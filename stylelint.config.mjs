export default {
	extends: ["stylelint-config-standard"],
	plugins: ["stylelint-order"],
	rules: {
		"selector-class-pattern": null,
		"custom-property-pattern": null,
		"custom-property-empty-line-before": null,
		"order/properties-alphabetical-order": true,
	},
};
