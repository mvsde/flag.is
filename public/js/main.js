import { Back } from "./components/back.js";
import { Search } from "./components/search.js";

const Components = [Back, Search];

for (const Component of Components) {
	/** @type {NodeListOf<HTMLElement>} */
	const elements = document.querySelectorAll(Component.selector);

	// @ts-expect-error
	elements.forEach((element) => new Component(element));
}
