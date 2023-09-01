import { isArrayInArray } from "../utilities/array.js";

const SELECTORS = {
	container: ".js-Search",
	form: ".js-Search-form",
	item: ".js-Search-item",
};

export class Search {
	static selector = SELECTORS.container;

	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		this.elements = {
			container,

			form: /** @type {HTMLFormElement|null} */ (
				container.querySelector(SELECTORS.form)
			),

			items: /** @type {NodeListOf<HTMLLIElement>} */ (
				container.querySelectorAll(SELECTORS.item)
			),
		};

		this.items = [...this.elements.items].map((item) => new Item(item));

		this.addListeners();
	}

	addListeners() {
		if (!this.elements.form) {
			return;
		}

		this.elements.form.addEventListener("input", this.filter.bind(this));

		this.elements.form.addEventListener("reset", () => {
			// Wait for the form data to actually refresh after resetting.
			requestAnimationFrame(() => this.filter());
		});

		window.addEventListener("load", () => this.filter());
	}

	filter() {
		const { name, colors, patterns } = this.getFormData();

		this.items.forEach((item) => item.hide());

		this.items
			.filter(
				(item) =>
					item.name.toLowerCase().includes(name) ||
					item.aliases.toLowerCase().includes(name),
			)
			.filter((item) => isArrayInArray(colors, item.colors))
			.filter((item) => isArrayInArray(patterns, item.patterns))
			.forEach((item) => item.show());
	}

	getFormData() {
		if (!this.elements.form) {
			return { name: "", colors: [], patterns: [] };
		}

		const formData = new FormData(this.elements.form);

		const name = formData.get("name")?.toString().toLowerCase() ?? "";
		const colors = formData.getAll("colors");
		const patterns = formData.getAll("patterns");

		return { name, colors, patterns };
	}
}

class Item {
	/**
	 * @param {HTMLLIElement} container
	 */
	constructor(container) {
		this.elements = {
			container,
		};

		this.name = container.dataset.name ?? "";
		this.aliases = container.dataset.aliases ?? "";
		this.colors = container.dataset.colors?.split(",");
		this.patterns = container.dataset.patterns?.split(",");
	}

	hide() {
		this.elements.container.hidden = true;
	}

	show() {
		this.elements.container.hidden = false;
	}
}
