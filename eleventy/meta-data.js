import fs from "node:fs/promises";

import { DIRECTORIES } from "../eleventy.config.cjs";

export function writeMetaData() {
	const filename = `${DIRECTORIES.output}/build.json`;

	const data = {
		date: new Date().toISOString(),
	};

	console.log(`[meta] Writing ${filename}`);

	return fs.writeFile(filename, JSON.stringify(data));
}
