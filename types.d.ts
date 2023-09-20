import { EVENT } from "./public/js/config.js";

type CacheAssets = string[];

interface BuildInformation {
	date: string;
}

interface SWMessage {
	name: keyof typeof EVENT;
}
