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
			.filter((item) => colors.isSubsetOf(item.colors))
			.filter((item) => patterns.isSubsetOf(item.patterns))
			.forEach((item) => item.show());
	}

	#getFormData() {
		if (!this.#elements.form) {
			return { name: "", colors: new Set(), patterns: new Set() };
		}

		const formData = new FormData(this.#elements.form);

		const name = formData.get("name")?.toString().toLowerCase() ?? "";
		const colors = new Set(formData.getAll("colors"));
		const patterns = new Set(formData.getAll("patterns"));

		return { name, colors, patterns };
	}
}

class SearchItem extends HTMLElement {
	constructor() {
		super();

		/** @type {string} */
		this.name = this.dataset.name ?? "";

		/** @type {string} */
		this.aliases = this.dataset.aliases ?? "";

		/** @type {Set<string>} */
		this.colors = new Set(this.dataset.colors?.split(","));

		/** @type {Set<string>} */
		this.patterns = new Set(this.dataset.patterns?.split(","));
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
