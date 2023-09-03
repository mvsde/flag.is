const SELECTORS = {
	container: ".js-Back",
};

export class Back {
	static selector = SELECTORS.container;

	/**
	 * @param {HTMLAnchorElement} container
	 */
	constructor(container) {
		this.elements = {
			container,
		};

		this.addListeners();
	}

	addListeners() {
		this.elements.container.addEventListener("click", this.onClick.bind(this));
	}

	/**
	 * @param {PointerEvent} event
	 */
	onClick(event) {
		if (!this.isReferredFromHomepage) {
			return;
		}

		event.preventDefault();
		history.back();
	}

	get isReferredFromHomepage() {
		return this.elements.container.href === document.referrer;
	}
}
