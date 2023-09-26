console.log("[SW] Unregister");

const registrations = await navigator.serviceWorker.getRegistrations();
registrations.forEach((registration) => registration.unregister());

export {};
