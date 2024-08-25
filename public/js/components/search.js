import { isArrayInArray } from "../utilities/array.js";

class Search extends HTMLElement {
	static #selectors = {
		form: "form",
		item: "flag-search-item",
	};

	#elements;

	constructor() {
		super();

		this.#elements = {
			form: /** @type {HTMLFormElement|null} */ (
				this.querySelector(Search.#selectors.form)
			),

			items: /** @type {SearchItem[]} */ ([
				...this.querySelectorAll(Search.#selectors.item),
			]),
		};

		this.#addListeners();
	}

	#addListeners() {
		if (!this.#elements.form) {
			return;
		}

		this.#elements.form.addEventListener("input", this.#filter.bind(this));

		this.#elements.form.addEventListener("reset", () => {
			// Wait for the form data to actually refresh after resetting.
			requestAnimationFrame(this.#filter.bind(this));
		});

		// Restore filtering after browser back navigation.
		window.addEventListener("load", this.#filter.bind(this));
	}

	#filter() {
		const { name, colors, patterns } = this.#getFormData();

		this.#elements.items.forEach((item) => item.hide());

		this.#elements.items
			.filter(
				(item) =>
					item.name.toLowerCase().includes(name) ||
					item.aliases.toLowerCase().includes(name),
			)
			.filter((item) => isArrayInArray(colors, item.colors))
			.filter((item) => isArrayInArray(patterns, item.patterns))
			.forEach((item) => item.show());
	}

	#getFormData() {
		if (!this.#elements.form) {
			return { name: "", colors: [], patterns: [] };
		}

		const formData = new FormData(this.#elements.form);

		const name = formData.get("name")?.toString().toLowerCase() ?? "";
		const colors = formData.getAll("colors");
		const patterns = formData.getAll("patterns");

		return { name, colors, patterns };
	}
}

class SearchItem extends HTMLElement {
	constructor() {
		super();

		this.name = this.dataset.name ?? "";
		this.aliases = this.dataset.aliases ?? "";
		this.colors = this.dataset.colors?.split(",");
		this.patterns = this.dataset.patterns?.split(",");
	}

	hide() {
		this.hidden = true;
	}

	show() {
		this.hidden = false;
	}
}

customElements.define("flag-search", Search);
customElements.define("flag-search-item", SearchItem);
