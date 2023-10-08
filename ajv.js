import fs from "node:fs/promises";

import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import chalk from "chalk";
import { glob } from "glob";
import YAML from "yaml";

/**
 * @typedef {"colors"|"flag"|"patterns"} SchemaID
 */

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

await addSchema("schemas/colors.yaml");
await addSchema("schemas/flag.yaml");
await addSchema("schemas/patterns.yaml");

await validateData("data/colors.yaml", "colors");
await validateData("data/flags/*.yaml", "flag");
await validateData("data/patterns.yaml", "patterns");

/**
 * @param {string} file
 */
async function addSchema(file) {
	const schema = await loadFile(file);
	ajv.addSchema(schema);
}

/**
 * @param {string} filePattern
 * @param {SchemaID} schemaID
 */
async function validateData(filePattern, schemaID) {
	const files = await glob(filePattern);

	for (const file of files) {
		const data = await loadFile(file);
		ajv.validate(schemaID, data);
		logErrors({ file, schemaID, errors: ajv.errors });
	}
}

/**
 * @param {string} schema
 * @returns {Promise<any>}
 */
async function loadFile(schema) {
	const file = await fs.readFile(schema, { encoding: "utf8" });
	return YAML.parse(file);
}

/**
 *
 * @param {object} options
 * @param {string} options.file
 * @param {SchemaID} options.schemaID
 * @param {Ajv["errors"]} options.errors
 */
function logErrors({ file, schemaID, errors }) {
	if (!errors) {
		return;
	}

	process.exitCode = 1;
	let index = 1;

	console.log(chalk.underline(file));
	console.log();

	for (const error of errors) {
		const errorIndex = chalk.red(index++);
		const errorDataPath = chalk.cyan(error.instancePath);
		const errorMessage = error.message;
		const errorSchemaPath = chalk.italic(
			`schemas/${schemaID}.yaml${error.schemaPath}`,
		);

		console.log(`  ${errorIndex} ${errorDataPath} ${errorMessage}`);
		console.log(`    ${errorSchemaPath}`);
		console.log();
	}
}
