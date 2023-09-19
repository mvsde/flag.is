import fs from "node:fs/promises";

import { glob } from "glob";

import { DIRECTORIES } from "../eleventy.config.cjs";
import { BUILD_METADATA_URL, CACHE_ASSETS_URL } from "../public/js/config.js";

export async function writeMetaData() {
	await writeCacheAssetList();
	await writeBuildInformation();
}

async function writeCacheAssetList() {
	const filename = `${DIRECTORIES.output}${CACHE_ASSETS_URL}`;

	const publicFiles = await glob("**/*", {
		cwd: "public",
		nodir: true,
		ignore: ["sw.js", "img/default.social.*"],
	});

	const flagImageFiles = await glob("*.svg", {
		cwd: "data/flags",
		nodir: true,
	});

	const data = `export const CACHE_ASSETS = [
	"/",
	"${BUILD_METADATA_URL}",
	"${CACHE_ASSETS_URL}",
	${publicFiles.map((file) => `"/${file}",`).join("\n\t")}
	${flagImageFiles.map((file) => `"/img/${file}",`).join("\n\t")}
];
`;

	console.log(`[meta] Writing ${filename}`);
	return fs.writeFile(filename, data);
}

function writeBuildInformation() {
	const filename = `${DIRECTORIES.output}${BUILD_METADATA_URL}`;

	const data = {
		date: new Date().toISOString(),
	};

	console.log(`[meta] Writing ${filename}`);
	return fs.writeFile(filename, JSON.stringify(data));
}
