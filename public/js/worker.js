import { EVENT } from "./config.js";

navigator.serviceWorker?.register("/sw.js", { type: "module" });
navigator.serviceWorker?.addEventListener("message", onMessage);

/**
 * @param {MessageEvent} event
 */
function onMessage(event) {
	const name = event.data.name;

	if (name === EVENT.UPDATE_AVAILABLE) {
		showUpdatePrompt();
	}

	if (name === EVENT.UPDATE_DONE) {
		location.reload();
	}
}

async function showUpdatePrompt() {
	const startUpdate = window.confirm(
		"Update available. Download update and reload site?",
	);

	if (!startUpdate) {
		return;
	}

	const registration = await navigator.serviceWorker.getRegistration();
	registration?.active?.postMessage({ name: EVENT.START_UPDATE });
}
