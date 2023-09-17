import { CACHE_CLEAR_EVENT } from "./config.js";

navigator.serviceWorker?.register("/sw.js", { type: "module" });
navigator.serviceWorker?.addEventListener("message", onMessage);

/**
 * @param {MessageEvent} event
 */
function onMessage(event) {
	if (event.data.name === CACHE_CLEAR_EVENT) {
		showUpdatePrompt();
	}
}

function showUpdatePrompt() {
	const shouldUpdate = window.confirm(
		"Update available. Reload and download update?",
	);

	if (shouldUpdate) {
		location.reload();
	}
}
