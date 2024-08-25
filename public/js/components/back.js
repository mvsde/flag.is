class Back extends HTMLElement {
	static #selectors = {
		link: "a",
	};

	static #classes = {
		isBack: "is-back",
	};

	#elements;

	constructor() {
		super();

		this.#elements = {
			link: /** @type {HTMLAnchorElement|null} */ (
				this.querySelector(Back.#selectors.link)
			),
		};

		if (this.#isReferredFromHomepage) {
			this.#setClasses();
			this.#addListeners();
		}
	}

	#setClasses() {
		this.#elements.link?.classList.add(Back.#classes.isBack);
	}

	#addListeners() {
		this.#elements.link?.addEventListener("click", this.#onClick.bind(this));
	}

	/**
	 * @param {PointerEvent} event
	 */
	#onClick(event) {
		event.preventDefault();
		history.back();
	}

	get #isReferredFromHomepage() {
		return this.#elements.link?.href === document.referrer;
	}
}

customElements.define("flag-back", Back);
