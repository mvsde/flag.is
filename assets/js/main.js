import { Search } from "./components/search.js";

const Components = [Search];

for (const Component of Components) {
	/** @type {NodeListOf<HTMLElement>} */
	const elements = document.querySelectorAll(Component.selector);
	elements.forEach((element) => new Component(element));
}
